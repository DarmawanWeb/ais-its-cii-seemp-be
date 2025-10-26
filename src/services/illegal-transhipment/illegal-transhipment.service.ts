import {
  isInBatamBounds,
  checkIlegalTranshipmentPossibility,
} from '../../utils/illegal-transhipment';
import { IAisPosition } from '../../models/Ais';
import { AisRepository } from '../../repositories/ais.repository';
import { IllegalTranshipmentQueueRepository } from '../../repositories/illegal-transhipment/it-queue.repository';

export class IllegalTranshipmentService {
  private aisRepository: AisRepository;
  private itQueueRepository: IllegalTranshipmentQueueRepository;

  constructor() {
    this.aisRepository = new AisRepository();
    this.itQueueRepository = new IllegalTranshipmentQueueRepository();
  }

  async detectIllegalTranshipment(
    shipMMSI: string,
    shipPosition: IAisPosition,
  ): Promise<void> {
    const validLocation = isInBatamBounds(shipPosition.lat, shipPosition.lon);

    if (validLocation) {
      const batamShips = await this.aisRepository.getBatamShipsinLast5Minutes(
        new Date(Date.now() - 5 * 60 * 1000),
      );

      const index = batamShips.findIndex((ship) => ship.mmsi === shipMMSI);
      if (index !== -1) {
        batamShips.splice(index, 1);
      }
      const illegalTranshipmentPossibilities =
        checkIlegalTranshipmentPossibility(shipPosition, batamShips);

      for (const { mmsi, priority } of illegalTranshipmentPossibilities) {
        const existingEntry = await this.itQueueRepository.getByMMSI(
          shipMMSI,
          mmsi,
        );

        if (!existingEntry) {
          await this.itQueueRepository.create(shipMMSI, mmsi, priority);
        } else {
          await this.itQueueRepository.updatePriority(
            shipMMSI,
            mmsi,
            existingEntry.priority + priority,
          );
        }
      }
    }
  }
}
