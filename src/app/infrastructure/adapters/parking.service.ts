import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AccessLog, AccessRequest, VehicleStatus} from '../../core/models/access.model';

import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ParkingService {
  private http = inject(HttpClient);
  private apiUrl = environment.api_url;

  registerEntry(request: AccessRequest): Observable<AccessLog> {
    return this.http.post<AccessLog>(`${this.apiUrl}/access/entry`, request);
  }

  registerExit(request: AccessRequest): Observable<AccessLog> {
    return this.http.post<AccessLog>(`${this.apiUrl}/access/exit`, request);
  }

  getVehicleStatus(plate: String): Observable<VehicleStatus> {
    return this.http.get<VehicleStatus>(`${this.apiUrl}/access/status/${plate}`);
  }

  getOccupancy(parkingLotId: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/access/occupancy/${parkingLotId}`);
  }

  // Admin Endpoints
  getAccessLogs(): Observable<AccessLog[]> {
    return this.http.get<AccessLog[]>(`${this.apiUrl}/access/logs`);
  }

  getAllParkingLots(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/parking-lot`);
  }

  createParkingLot(parkingLot: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/parking-lot`, parkingLot);
  }

  updateParkingLot(id: string, parkingLot: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/parking-lot/${id}`, parkingLot);
  }
}
