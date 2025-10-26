import {
  IllegalTranshipmentQueue,
  type IIlegallTranshipmentQueue,
} from '../../models/illegal-transhipment/IllegalTranshipmentQueue';

export class IllegalTranshipmentQueueRepository {
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
    priority: number = 0,
  ): Promise<IIlegallTranshipmentQueue> {
    const [sortedShip1MMSI, sortedShip2MMSI] = this.sortMMSI(
      ship1MMSI,
      ship2MMSI,
    );
    const illegalTranshipmentQueue = new IllegalTranshipmentQueue({
      ship1MMSI: sortedShip1MMSI,
      ship2MMSI: sortedShip2MMSI,
      priority,
      status: 'pending',
    });
    return await illegalTranshipmentQueue.save();
  }

  async getAllSorted(): Promise<IIlegallTranshipmentQueue[]> {
    return IllegalTranshipmentQueue.find().sort({ priority: -1, createdAt: 1 });
  }

  async getByMMSI(
    ship1MMSI: string,
    ship2MMSI: string,
  ): Promise<IIlegallTranshipmentQueue | null> {
    const [sortedShip1MMSI, sortedShip2MMSI] = this.sortMMSI(
      ship1MMSI,
      ship2MMSI,
    );
    return IllegalTranshipmentQueue.findOne({
      ship1MMSI: sortedShip1MMSI,
      ship2MMSI: sortedShip2MMSI,
    });
  }

  async updateStatusAndPriority(
    ship1MMSI: string,
    ship2MMSI: string,
    status: 'pending' | 'in_progress' | 'completed' | 'failed',
    priority: number,
  ): Promise<IIlegallTranshipmentQueue | null> {
    const [sortedShip1MMSI, sortedShip2MMSI] = this.sortMMSI(
      ship1MMSI,
      ship2MMSI,
    );
    const queueEntry = await this.getByMMSI(sortedShip1MMSI, sortedShip2MMSI);
    if (queueEntry) {
      queueEntry.status = status;
      queueEntry.priority = priority;
      queueEntry.updatedAt = new Date();
      return await queueEntry.save();
    }
    return null;
  }

  async updatePriority(
    ship1MMSI: string,
    ship2MMSI: string,
    priority: number,
  ): Promise<IIlegallTranshipmentQueue | null> {
    const [sortedShip1MMSI, sortedShip2MMSI] = this.sortMMSI(
      ship1MMSI,
      ship2MMSI,
    );
    const queueEntry = await this.getByMMSI(sortedShip1MMSI, sortedShip2MMSI);
    if (queueEntry) {
      queueEntry.priority = priority;
      queueEntry.updatedAt = new Date();
      return await queueEntry.save();
    }
    return null;
  }

  async updateStatus(
    ship1MMSI: string,
    ship2MMSI: string,
    status: 'pending' | 'in_progress' | 'completed' | 'failed',
  ): Promise<IIlegallTranshipmentQueue | null> {
    const [sortedShip1MMSI, sortedShip2MMSI] = this.sortMMSI(
      ship1MMSI,
      ship2MMSI,
    );
    const queueEntry = await this.getByMMSI(sortedShip1MMSI, sortedShip2MMSI);
    if (queueEntry) {
      queueEntry.status = status;
      queueEntry.updatedAt = new Date();
      return await queueEntry.save();
    }
    return null;
  }
}
