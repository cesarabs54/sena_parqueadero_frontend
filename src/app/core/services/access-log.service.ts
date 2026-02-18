import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

export interface AccessLogEntry {
  plate: string;
  timestamp: Date;
  type: 'ENTRY' | 'EXIT' | 'REJECTED';
  userType: 'AUTHORIZED' | 'VISITOR';
  userName?: string;
  comments?: string;
  parkingLotId?: string; // Add parkingLotId if needed, default to a fixed one for now or pass it.
}

@Injectable({
  providedIn: 'root'
})
export class AccessLogService {
  private apiUrl = `${environment.api_url}/access`;
  // We can default to a specific parking lot ID for now, or fetch it.
  // c5f9d1e0-8a7b-4c6d-9e2f-1a3b5c7d9e0f (Example UUID)
  private defaultParkingLotId = 'c5f9d1e0-8a7b-4c6d-9e2f-1a3b5c7d9e0f';

  constructor(private http: HttpClient) {
  }

  registerAccess(entry: AccessLogEntry): Observable<any> {
    const payload = {
      plate: entry.plate,
      parkingLotId: entry.parkingLotId || this.defaultParkingLotId,
      comments: entry.comments || (entry.type === 'ENTRY' ?
        (entry.userType === 'VISITOR' ? `Visita: ${entry.userName}` : 'Ingreso Autorizado') :
        (entry.type === 'EXIT' ? 'Salida' : 'Rechazado')),
      userType: entry.userType
    };

    let endpoint = '';
    switch (entry.type) {
      case 'ENTRY':
        endpoint = '/entry';
        break;
      case 'EXIT':
        endpoint = '/exit';
        break;
      case 'REJECTED':
        endpoint = '/rejection';
        break;
    }

    return this.http.post(`${this.apiUrl}${endpoint}`, payload);
  }

  getLogs(): Observable<AccessLogEntry[]> {
    return this.http.get<AccessLogEntry[]>(`${this.apiUrl}/logs`);
  }
}
