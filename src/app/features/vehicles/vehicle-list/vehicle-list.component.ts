import {Component, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import {VehicleService} from '../../../infrastructure/adapters/vehicle.service';
import {AuthorizedVehicle} from '../../../core/models/vehicle.model';
import {ConfirmationService, MessageService} from 'primeng/api';
import {ToastModule} from 'primeng/toast';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {AccessRequest} from '../../../core/models/access.model';
import {VehicleFormComponent} from '../vehicle-form/vehicle-form.component';
import {ParkingService} from '../../../infrastructure/adapters/parking.service';

import {SelectModule} from 'primeng/select';
import {DialogModule} from 'primeng/dialog';
import {FormsModule} from '@angular/forms';

import {TooltipModule} from 'primeng/tooltip';

import {InputTextModule} from 'primeng/inputtext';

@Component({
  selector: 'app-vehicle-list',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, ToastModule, ConfirmDialogModule, VehicleFormComponent, SelectModule, DialogModule, FormsModule, TooltipModule, InputTextModule],
  providers: [MessageService, ConfirmationService],
  templateUrl: './vehicle-list.component.html',
  styleUrl: './vehicle-list.component.css'
})
export class VehicleListComponent implements OnInit {
  private vehicleService = inject(VehicleService);
  private parkingService = inject(ParkingService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  vehicles = signal<AuthorizedVehicle[]>([]);
  parkingLots = signal<any[]>([]);
  loading = signal<boolean>(false);
  showForm = false;

  // Zone Selection Dialog
  showZoneSelection = false;
  selectedPlate: string = '';
  selectedAction: 'ENTRY' | 'EXIT' = 'ENTRY';
  selectedZone: any = null;

  // Visitor Access
  showVisitorForm = false;
  visitorPlate: string = '';
  visitorZone: any = null;

  ngOnInit() {
    this.loadVehicles();
    this.loadParkingLots();
  }

  loadParkingLots() {
    this.parkingService.getAllParkingLots().subscribe((lots: any[]) => {
      this.parkingLots.set(lots);
      if (lots.length > 0) {
        this.selectedZone = lots[0];
      }
    });
  }

  loadVehicles() {
    this.loading.set(true);
    this.vehicleService.getAll().subscribe({
      next: (data: AuthorizedVehicle[]) => {
        this.vehicles.set(data);
        this.loading.set(false);
      },
      error: (err: any) => {
        console.error('Error loading vehicles', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los vehículos'
        });
        this.loading.set(false);
      }
    });
  }

  initAccess(plate: string, action: 'ENTRY' | 'EXIT') {
    this.selectedPlate = plate;
    this.selectedAction = action;

    if (this.parkingLots().length === 1) {
      this.selectedZone = this.parkingLots()[0];
      this.processAccess();
    } else {
      this.showZoneSelection = true;
    }
  }

  processAccess() {
    if (!this.selectedZone) return;

    const request: AccessRequest = {plate: this.selectedPlate, parkingLotId: this.selectedZone.id};
    const operation = this.selectedAction === 'ENTRY'
      ? this.parkingService.registerEntry(request)
      : this.parkingService.registerExit(request);

    operation.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: this.selectedAction === 'ENTRY' ? 'Bienvenido' : 'Hasta Luego',
          detail: `Vehículo ${this.selectedPlate} - ${this.selectedAction === 'ENTRY' ? 'Ingreso registrado' : 'Salida registrada'}`
        });
        this.showZoneSelection = false;
      },
      error: (err: any) => {
        console.error('Access error', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error de Acceso',
          detail: err.error || 'No se pudo registrar el acceso'
        });
      }
    });
  }

  registerVisitorEntry() {
    if (!this.visitorPlate || !this.visitorZone) return;

    const request: AccessRequest = {plate: this.visitorPlate, parkingLotId: this.visitorZone.id};
    this.parkingService.registerEntry(request).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Ingreso Visitante',
          detail: `Vehículo ${this.visitorPlate} ha ingresado a ${this.visitorZone.name}`
        });
        this.showVisitorForm = false;
        this.visitorPlate = '';
      },
      error: (err: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error || 'No se pudo registrar el ingreso del visitante'
        });
      }
    });
  }

  deleteVehicle(plate: string) {
    this.confirmationService.confirm({
      message: '¿Está seguro de eliminar este vehículo?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.vehicleService.delete(plate).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Vehículo eliminado'
            });
            this.loadVehicles();
          },
          error: (err: any) => {
            console.error('Error deleting vehicle', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo eliminar el vehículo'
            });
          }
        });
      }
    });
  }
}
