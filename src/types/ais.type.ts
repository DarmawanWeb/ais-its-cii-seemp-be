import { Document } from 'mongoose';

export interface IAisPosition {
  navstatus: number;
  lat: number;
  lon: number;
  sog: number;
  cog: number;
  hdg: number;
  timestamp: Date;
}

export interface IAis extends Document {
  mmsi: string;
  positions: IAisPosition[];
}

interface AisMessage {
  data: {
    valid: boolean;
    aistype: number;
    mmsi: string;
    navstatus: number;
    lon: number;
    lat: number;
    cog: number;
    sog: number;
    hdg: number;
  };
  port: string;
}

export interface TimestampedAisMessage {
  message: AisMessage;
  timestamp: string;
}
