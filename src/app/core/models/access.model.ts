export interface AccessLog {
  id: string;
  plate: string;
  timestamp: string;
  type: 'ENTRY' | 'EXIT';
  parkingLotId: string;
}

export interface AccessRequest {
  plate: string;
  parkingLotId: string;
}
