import { IAis, IAisPosition } from '../types/ais.type';
import Ais from '../models/Ais';

export interface IAisRepository {
  create(data: IAis): Promise<IAis>;
  getAll(): Promise<IAis[]>;
  getByMmsi(mmsi: string): Promise<IAis | null>;
  updatePositions(mmsi: string, newPosition: IAisPosition[]): Promise<void>;
}

export class AisRepository implements IAisRepository {
  async create(data: IAis): Promise<IAis> {
    const ais = new Ais(data);
    await ais.save();
    return ais;
  }

  async getAll(): Promise<IAis[]> {
    return Ais.find();
  }

  async getByMmsi(mmsi: string): Promise<IAis | null> {
    return Ais.findOne({ mmsi });
  }

  async updatePositions(
    mmsi: string,
    newPosition: IAisPosition[],
  ): Promise<void> {
    await Ais.findOneAndUpdate(
      { mmsi: mmsi },
      {
        $set: { positions: newPosition },
      },
      { new: true },
    );
  }
}
