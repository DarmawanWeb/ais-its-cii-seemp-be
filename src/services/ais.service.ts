import { type IAis, type IAisPosition } from '../models/Ais';
import { AisRepository } from '../repositories/ais.repository';
import { TimestampedAisMessage } from '../types/ais.type';
import { CIIService } from './cii/cii.service';
import { predictedNavStatus } from './predict-navstatus.service';
import { findNearestCoastDistance } from '../utils/find-nearest-coast';


export class AisService {
  private aisRepository: AisRepository;
  private ciiService: CIIService = new CIIService();

  constructor() {
    this.aisRepository = new AisRepository();
  }

  async createOrUpdateAis(
    data: TimestampedAisMessage,
  ): Promise<IAis | void | null> {
    const messageData = data.message.data;
    try {


      if (!messageData) {
        return null;
      }

       const { mmsi, navstatus, lat, lon, sog, cog, hdg, utc } = messageData;

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


      const minDistance : number = findNearestCoastDistance("data/indonesia.json", lat, lon);
      const timestamp = new Date(data.timestamp);
      timestamp.setSeconds(timestamp.getSeconds() - utc);

      let newPosition: IAisPosition;
  
      const existingAis = await this.aisRepository.getByMmsi(mmsi);

      if (!existingAis) {
        console.log('No existing AIS entry for MMSI:', mmsi);
        console.log("SOG:", sog, "COG:", cog, "HDG:", hdg, "MinDistance:", minDistance);
      newPosition = {
        navstatus,
        lat,
        lon,
        sog,
        cog,
        hdg,
        timestamp,
        predictedNavStatus: predictedNavStatus({ sog, cog, hdg }, { sog, cog, hdg }, minDistance),
        
      };
    
        const newAis = {
          mmsi,
          positions: [newPosition],
        };
        return this.aisRepository.create(newAis as IAis);
      }      
      newPosition = {
        navstatus,
        lat,
        lon,
        sog,
        cog,
        hdg,
        timestamp,
        predictedNavStatus: predictedNavStatus({sog, cog, hdg}, existingAis.positions[0], minDistance),
      };
      const updatedPositions = [existingAis.positions[1], newPosition];
      this.aisRepository.updatePositions(mmsi, updatedPositions);
      const validMMSIs = ["525005223", "222222222", "111111111"];
      if (validMMSIs.includes(data.message.data.mmsi)) {
        console.log('Updating AIS for MMSI:', data.message.data.lat);
        await this.ciiService.getCIIByMMSI(data.message.data.mmsi);
      }
    } catch (error) {
      console.error('Error creating or updating AIS:', error);
      return null;
    }

  }

  async getAllAis(): Promise<IAis[]> {
    return this.aisRepository.getAll();
  }

  async getAisByMmsi(mmsi: string): Promise<IAis | null> {
    return this.aisRepository.getByMmsi(mmsi);
  }
}