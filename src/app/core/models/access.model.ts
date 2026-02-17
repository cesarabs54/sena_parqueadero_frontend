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

export interface VehicleStatus {
  plate: string;
  currentStatus: 'IN' | 'OUT';
  isAuthorized: boolean;
  ownerName: string;
}
