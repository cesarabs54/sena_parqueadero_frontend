import {Component, EventEmitter, inject, Input, Output, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {DialogModule} from 'primeng/dialog';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {CheckboxModule} from 'primeng/checkbox';
import {VehicleService} from '../../../infrastructure/adapters/vehicle.service';
import {AuthorizedVehicle} from '../../../core/models/vehicle.model';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-vehicle-form',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogModule, ButtonModule, InputTextModule, CheckboxModule],
  templateUrl: './vehicle-form.component.html',
  styleUrl: './vehicle-form.component.css'
})
export class VehicleFormComponent {
  private vehicleService = inject(VehicleService);
  private messageService = inject(MessageService);

  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() onSave = new EventEmitter<void>();

  plate: string = '';
  isActive: boolean = true;
  loading = signal<boolean>(false);

  save() {
    if (!this.plate) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atención',
        detail: 'La placa es requerida'
      });
      return;
    }

    this.loading.set(true);
    const vehicle: AuthorizedVehicle = {
      plate: this.plate.toUpperCase(),
      isActive: this.isActive
    };

    this.vehicleService.create(vehicle).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Vehículo registrado'
        });
        this.loading.set(false);
        this.onSave.emit();
        this.close();
      },
      error: (err) => {
        console.error('Error creating vehicle', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo registrar el vehículo'
        });
        this.loading.set(false);
      }
    });
  }

  close() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.plate = '';
    this.isActive = true;
  }
}
