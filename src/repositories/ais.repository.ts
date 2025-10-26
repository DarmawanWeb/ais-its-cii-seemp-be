import Ais, { type IAisPosition, type IAis } from '../models/Ais';

export interface IAisRepository {
  create(data: IAis): Promise<IAis>;
  getAll(): Promise<IAis[]>;
  getByMmsi(mmsi: string): Promise<IAis | null>;
  updatePositions(mmsi: string, newPosition: IAisPosition[]): Promise<void>;
  getShipRouteByMMSI(mmsi: string, duration: number): Promise<IAisPosition[]>;
}

export class AisRepository implements IAisRepository {
  async create(data: IAis): Promise<IAis> {
    const ais = new Ais(data);
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

  async getBatamShipsinLast5Minutes(cutoffTime: Date): Promise<IAis[]> {
    return Ais.aggregate([
      {
        $project: {
          mmsi: 1,
          positions: {
            $filter: {
              input: '$positions',
              as: 'position',
              cond: {
                $and: [
                  { $gte: ['$$position.timestamp', cutoffTime] },
                  {
                    $and: [
                      { $gte: ['$$position.lat', -0.89028] },
                      { $lte: ['$$position.lat', 3.0372] },
                      { $gte: ['$$position.lon', 103.97159] },
                      { $lte: ['$$position.lon', 109.22838] },
                    ],
                  },
                ],
              },
            },
          },
        },
      },
      {
        $match: {
          'positions.0': { $exists: true },
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
    await Ais.findOneAndUpdate(
      { mmsi: mmsi },
      {
        $set: { positions: newPosition },
      },
      { new: true },
    );
  }

  async getShipRouteByMMSI(
    mmsi: string,
    duration: number,
  ): Promise<IAisPosition[]> {
    const endTime = new Date();
    const startTime = new Date(endTime.getTime() - duration);

    const ship = await Ais.findOne({ mmsi });

    if (!ship) {
      return [];
    }

    const route = ship.positions.filter((position) => {
      const posTime = new Date(position.timestamp);
      return posTime >= startTime && posTime <= endTime;
    });

    return route.sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    );
  }
}
