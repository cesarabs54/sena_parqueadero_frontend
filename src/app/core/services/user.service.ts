import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User } from '../models/user.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: User[] = [
    {
      id: '550e8400-e29b-41d4-a716-446655440000',
      placa: 'XYZ-123',
      tipoVehiculo: 'Carro',
      tipoDocumento: 'CC',
      numeroDocumento: '123456789',
      nombres: 'Juan',
      apellidos: 'Pérez',
      tipoContrato: 'Funcionario',
      cargo: 'Analista',
      email: 'juan.perez@example.com',
      contacto: '3001234567',
      estado: 'Activo'
    },
    {
      id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
      placa: 'ABC-987',
      tipoVehiculo: 'Moto',
      tipoDocumento: 'TI',
      numeroDocumento: '987654321',
      nombres: 'Ana',
      apellidos: 'Gómez',
      tipoContrato: 'Aprendiz',
      cargo: 'Desarrollador',
      email: 'ana.gomez@example.com',
      contacto: '3109876543',
      estado: 'Inactivo'
    }
  ];

  private usersSubject = new BehaviorSubject<User[]>(this.users);

  constructor() { }

  getUsers(): Observable<User[]> {
    return this.usersSubject.asObservable();
  }

  addUser(user: User): Observable<User> {
    const newUser = { ...user, id: uuidv4(), estado: 'Activo' as 'Activo' };
    this.users = [...this.users, newUser];
    this.usersSubject.next(this.users);
    return of(newUser);
  }

  updateUser(user: User): Observable<User> {
    this.users = this.users.map(u => u.id === user.id ? user : u);
    this.usersSubject.next(this.users);
    return of(user);
  }

  deleteUser(id: string): Observable<boolean> {
    // Soft delete or status toggle logic can be here. For now, simple remove.
    // Ideally, we might just toggle status to Inactivo.
    this.users = this.users.filter(u => u.id !== id);
    this.usersSubject.next(this.users);
    return of(true);
  }

  toggleStatus(id: string): Observable<boolean> {
    const user = this.users.find(u => u.id === id);
    if (user) {
      user.estado = user.estado === 'Activo' ? 'Inactivo' : 'Activo';
      this.usersSubject.next([...this.users]);
      return of(true);
    }
    return of(false);
  }
}
