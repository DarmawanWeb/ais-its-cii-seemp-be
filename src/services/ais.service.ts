import { type IAis, type IAisPosition } from '../models/Ais';
import { AisRepository } from '../repositories/ais.repository';
import { TimestampedAisMessage } from '../types/ais.type';

export class AisService {
  private aisRepository: AisRepository;

  constructor() {
    this.aisRepository = new AisRepository();
  }

  async createOrUpdateAis(
    data: TimestampedAisMessage,
  ): Promise<IAis | void | null> {
    const messageData = data.message.data;

    if (!messageData) {
      return null;
    }

    const { mmsi, navstatus, lat, lon, sog, cog, hdg, utc } = messageData;
    if (mmsi === '525005223') {
      console.log('AIS message for MMSI 525005223');
      return null;
    }

    if (
      !mmsi ||
      navstatus == null ||
      lat == null ||
      lon == null ||
      sog == null ||
      cog == null ||
      hdg == null
    ) {
      return null;
    }

    const timestamp = new Date(data.timestamp);
    timestamp.setSeconds(timestamp.getSeconds() - utc);

    const newPosition: IAisPosition = {
      navstatus,
      lat,
      lon,
      sog,
      cog,
      hdg,
      timestamp,
    };

    const existingAis = await this.aisRepository.getByMmsi(mmsi);

    if (!existingAis) {
      const newAis = {
        mmsi,
        positions: [newPosition],
      };
      return this.aisRepository.create(newAis as IAis);
    }

    const updatedPositions = [existingAis.positions[1], newPosition];
    this.aisRepository.updatePositions(mmsi, updatedPositions);
  }

  async getAllAis(): Promise<IAis[]> {
    return this.aisRepository.getAll();
  }

  async getAisByMmsi(mmsi: string): Promise<IAis | null> {
    return this.aisRepository.getByMmsi(mmsi);
  }
}
