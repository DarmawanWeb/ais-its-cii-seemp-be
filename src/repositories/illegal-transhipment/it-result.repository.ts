import {
  IllegalTranshipmentResult,
  type IIllegalTranshipmentResult,
} from '../../models/illegal-transhipment/IllegalTranshipmentResult';

export class IllegalTranshipmentResultRepository {
  private sortMMSI(ship1MMSI: string, ship2MMSI: string): [string, string] {
    if (ship1MMSI < ship2MMSI) {
      return [ship1MMSI, ship2MMSI];
    } else {
      return [ship2MMSI, ship1MMSI];
    }
  }

  async create(
    ship1MMSI: string,
    ship2MMSI: string,
    isIllegal: boolean,
    startTimestamp?: Date,
    endTimestamp?: Date,
    accuracy?: number,
    averagePriority?: number,
    priorityDistribution?: { low: number; medium: number; high: number }
  ): Promise<IIllegalTranshipmentResult> {
    const [sortedShip1MMSI, sortedShip2MMSI] = this.sortMMSI(
      ship1MMSI,
      ship2MMSI,
    );
    const result = new IllegalTranshipmentResult({
      ship1MMSI: sortedShip1MMSI,
      ship2MMSI: sortedShip2MMSI,
      isIllegal,
      startTimestamp,
      endTimestamp,
      accuracy,
      averagePriority,
      priorityDistribution,
      detectedAt: new Date(),
    });
    return await result.save();
  }

  async getLastDetection(
    ship1MMSI: string,
    ship2MMSI: string,
  ): Promise<IIllegalTranshipmentResult | null> {
    const [sortedShip1MMSI, sortedShip2MMSI] = this.sortMMSI(
      ship1MMSI,
      ship2MMSI,
    );
    return IllegalTranshipmentResult.findOne({
      ship1MMSI: sortedShip1MMSI,
      ship2MMSI: sortedShip2MMSI,
    }).sort({ detectedAt: -1 });
  }

  async getAllIllegalResults(): Promise<IIllegalTranshipmentResult[]> {
    return IllegalTranshipmentResult.find({ isIllegal: true }).sort({
      detectedAt: -1,
    });
  }

  async getResultsByMMSI(mmsi: string): Promise<IIllegalTranshipmentResult[]> {
    return IllegalTranshipmentResult.find({
      $or: [{ ship1MMSI: mmsi }, { ship2MMSI: mmsi }],
    }).sort({ detectedAt: -1 });
  }
}