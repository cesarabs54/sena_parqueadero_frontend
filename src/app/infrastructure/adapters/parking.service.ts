import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AccessLog, AccessRequest} from '../../core/models/access.model';

import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ParkingService {
  private http = inject(HttpClient);
  private apiUrl = environment.api_url;

  registerEntry(request: AccessRequest): Observable<AccessLog> {
    return this.http.post<AccessLog>(`${this.apiUrl}/entry`, request);
  }

  registerExit(request: AccessRequest): Observable<AccessLog> {
    return this.http.post<AccessLog>(`${this.apiUrl}/exit`, request);
  }

  getOccupancy(parkingLotId: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/occupancy/${parkingLotId}`);
  }
}
