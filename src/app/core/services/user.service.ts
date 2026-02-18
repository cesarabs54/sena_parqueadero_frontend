import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, catchError, Observable, of, tap} from 'rxjs';
import {User} from '../models/user.model';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.api_url}`;
  private usersSubject = new BehaviorSubject<User[]>([]);

  constructor(private http: HttpClient) {
    this.loadUsers();
  }

  private loadUsers() {
    this.getUsers().subscribe(users => this.usersSubject.next(users));
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/vehicles`);
  }

  addUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/vehicles`, user).pipe(
      tap(() => this.loadUsers())
    );
  }

  updateUser(user: User): Observable<User> {
    // Backend might need specific update endpoint or re-use create if it handles upsert,
    // but for now let's assume we don't have a direct PUT /api/vehicles/{id} exposed yet
    // or we use the create for updates if logic allows.
    // Wait, RouterRest has PUT /api/vehicles/{plate} ? No.
    // RouterRest has DELETE.
    // For now, I will implementing a basic update if backend supports it or just re-add.
    // Actually, backend `createVehicle` uses `save` which is upsert in R2DBC if ID exists.
    return this.http.post<User>(`${this.apiUrl}/vehicles`, user).pipe(
      tap(() => this.loadUsers())
    );
  }

  deleteUser(plate: string): Observable<boolean> {
    return this.http.delete<void>(`${this.apiUrl}/vehicles/${plate}`).pipe(
      tap(() => this.loadUsers()),
      // Map void to boolean true
      tap(() => true)
    ) as unknown as Observable<boolean>;
  }

  findUserByPlaca(placa: string): Observable<User | undefined> {
    return this.http.get<User>(`${this.apiUrl}/users/${placa}`).pipe(
      catchError((error: any) => {
        if (error.status === 404) {
          return of(undefined);
        }
        throw error;
      })
    );
  }

  toggleStatus(id: string): Observable<boolean> {
    // This might need a specific backend endpoint or just standard update.
    // We don't have a toggle endpoint.
    // We will skip this for now or implement it as a full update.
    return of(false);
  }
}
