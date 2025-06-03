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
    utc: number;
  };
  port: string;
}

export interface TimestampedAisMessage {
  message: AisMessage;
  timestamp: string;
}

export interface ILocation {
  lat: number;
  lon: number;
}
