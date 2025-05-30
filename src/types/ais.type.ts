interface Message {
  data: {
    valid: boolean;
    aistype: number;
    mmsi: string;
    navstatus: number;
    lon: number;
    lat: number;
    rot: number;
    sog: number;
    hdg: number;
  };
}

export interface TimestampedMessage {
  message: Message;
  timestamp: string;
}
