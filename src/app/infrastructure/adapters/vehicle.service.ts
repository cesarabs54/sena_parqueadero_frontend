import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthorizedVehicle} from '../../core/models/vehicle.model';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private http = inject(HttpClient);
  private apiUrl = '/api/vehicles';

  getAll(): Observable<AuthorizedVehicle[]> {
    return this.http.get<AuthorizedVehicle[]>(this.apiUrl);
  }

  create(vehicle: AuthorizedVehicle): Observable<AuthorizedVehicle> {
    return this.http.post<AuthorizedVehicle>(this.apiUrl, vehicle);
  }

  delete(plate: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${plate}`);
  }
}
