import Ais, { type IAisPosition, type IAis } from '../models/Ais';

export interface IAisRepository {
  create(data: IAis): Promise<IAis>;
  getAll(): Promise<IAis[]>;
  getByMmsi(mmsi: string): Promise<IAis | null>;
  updatePositions(mmsi: string, newPosition: IAisPosition[]): Promise<void>;
}

export class AisRepository implements IAisRepository {
  async create(data: IAis): Promise<IAis> {
    const ais = new Ais(data);
    console.log("Creating new AIS:", data);
    await ais.save();
    return ais;
  }

  async getAll(): Promise<IAis[]> {
    return Ais.aggregate([
      {
        $project: {
          mmsi: 1,
          positions: { $slice: ['$positions', -1] },
        },
      },
    ]);
  }

  async getByMmsi(mmsi: string): Promise<IAis | null> {
    return Ais.findOne({ mmsi });
  }

  async getLastByMmsi(mmsi: string): Promise<IAis | null> {
    const ais = await Ais.aggregate([
      { $match: { mmsi: mmsi } },
      {
        $project: {
          mmsi: 1,
          positions: { $slice: ['$positions', -1] },
        },
      },
    ]);
    if (ais.length > 1) {
      return ais[1];
    }
    return ais[0] || null;
  }

  async updatePositions(
    mmsi: string,
    newPosition: IAisPosition[],
  ): Promise<void> {
    console.log("Updating positions for MMSI:", mmsi, "with new position:", newPosition);
    await Ais.findOneAndUpdate(
    
      { mmsi: mmsi },
      {
        $set: { positions: newPosition },
      },
      { new: true },
    );
  }
}
