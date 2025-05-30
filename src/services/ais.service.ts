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

    const { mmsi, navstatus, lat, lon, sog, cog, hdg } = messageData;

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

    const newPosition: IAisPosition = {
      navstatus,
      lat,
      lon,
      sog,
      cog,
      hdg,
      timestamp: new Date(data.timestamp),
    };

    const existingAis = await this.aisRepository.getByMmsi(mmsi);

    if (!existingAis) {
      const newAis = {
        mmsi,
        positions: [newPosition],
      };
      return this.aisRepository.create(newAis as IAis);
    }

    const updatedPositions = [existingAis.positions[0], newPosition];
    this.aisRepository.updatePositions(mmsi, updatedPositions);
  }

  async getAllAis(): Promise<IAis[]> {
    return this.aisRepository.getAll();
  }

  async getAisByMmsi(mmsi: string): Promise<IAis | null> {
    return this.aisRepository.getByMmsi(mmsi);
  }
}
