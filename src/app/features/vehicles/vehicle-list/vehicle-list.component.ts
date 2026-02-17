import {Component, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import {VehicleService} from '../../../infrastructure/adapters/vehicle.service';
import {AuthorizedVehicle} from '../../../core/models/vehicle.model';
import {ConfirmationService, MessageService} from 'primeng/api';
import {ToastModule} from 'primeng/toast';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {VehicleFormComponent} from '../vehicle-form/vehicle-form.component';

@Component({
  selector: 'app-vehicle-list',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, ToastModule, ConfirmDialogModule, VehicleFormComponent],
  providers: [MessageService, ConfirmationService],
  templateUrl: './vehicle-list.component.html',
  styleUrl: './vehicle-list.component.css'
})
export class VehicleListComponent implements OnInit {
  private vehicleService = inject(VehicleService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  vehicles = signal<AuthorizedVehicle[]>([]);
  loading = signal<boolean>(false);
  showForm = false;

  ngOnInit() {
    this.loadVehicles();
  }

  loadVehicles() {
    this.loading.set(true);
    this.vehicleService.getAll().subscribe({
      next: (data) => {
        this.vehicles.set(data);
        this.loading.set(false);
      },
      error: (err) => {
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
          error: (err) => {
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
