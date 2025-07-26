import { ShipRepository } from '../../repositories/ships/ships.repository';
import { IShip } from '../../models/ships/Ship';
import { IShipData } from '../../types/ship.type';
import { ShipGeneralRepository } from '../../repositories/ships/general.repository';
import { AisRepository } from '../../repositories/ais.repository';
import { SecondaryShip } from '../../models/SecondaryShip';

export class ShipService {
  private shipGeneralRepository: ShipGeneralRepository;
  private shipRepository: ShipRepository;
  private aisRepository: AisRepository;

  constructor() {
    this.shipRepository = new ShipRepository();
    this.aisRepository = new AisRepository();
    this.shipGeneralRepository = new ShipGeneralRepository();
  }

  async createShip(data: IShip): Promise<IShip> {
    return await this.shipRepository.create(data);
  }

  async getAllShips(): Promise<IShip[]> {
    return await this.shipRepository.getAll();
  }

  async getShipById(id: string): Promise<IShip | null> {
    return await this.shipRepository.getById(id);
  }

  async getShipByMMSI(mmsi: string): Promise<IShipData | null> {
    return await this.shipRepository.getByMMSI(mmsi);
  }

  async getSecondaryShipByMMSI(mmsi: string): Promise<IShipData | null> {
    const secondaryData =
      await this.shipRepository.getSecondaryShipByMMSI(mmsi);
    const positions = await this.aisRepository.getLastByMmsi(mmsi);

    if (!secondaryData || !positions) {
      return null;
    }
    return {
      ...(typeof secondaryData.toObject === 'function'
        ? secondaryData.toObject()
        : secondaryData),
      positions: positions.positions,
    } as IShipData;
  }

  async updateShip(id: string, data: Partial<IShip>): Promise<IShip | null> {
    return await this.shipRepository.update(id, data);
  }

  async deleteShip(id: string): Promise<IShip | null> {
    const shipData = await this.shipRepository.getById(id);
    if (shipData?.generalData) {
      const generalDataId = shipData.generalData as unknown as { _id: string };
      await this.shipGeneralRepository.delete(generalDataId._id);
    }
    await SecondaryShip.findOneAndDelete({ MMSI: shipData?.mmsi });
    return await this.shipRepository.delete(id);
  }

  async deleteShipByMMSI(mmsi: string): Promise<IShip | null> {
    const shipData = await this.shipRepository.getByMMSI(mmsi);
    if (!shipData) {
      return null;
    }
    if (shipData.generalData) {
      const generalDataId = shipData.generalData as unknown as { _id: string };
      await this.shipGeneralRepository.delete(generalDataId._id);
    }
    await SecondaryShip.findOneAndDelete({ MMSI: shipData.mmsi });
    return await this.shipRepository.delete((shipData as unknown as { _id: string })._id);
  }
}
