import {Component, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {BadgeModule} from 'primeng/badge';
import {ToastModule} from 'primeng/toast';
import {MessageService} from 'primeng/api';
import {ParkingService} from '../../../infrastructure/adapters/parking.service';
import {VehicleStatus} from '../../../core/models/access.model';

@Component({
  selector: 'app-operations-console',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, CardModule, BadgeModule, ToastModule],
  providers: [MessageService],
  template: `
    <div class="operations-container">
      <p-toast></p-toast>
      <div class="console-header text-center mb-6">
        <h1 class="text-4xl font-bold text-primary mb-2">Consola de Operaciones</h1>
        <p class="text-muted-color">Digita la placa para iniciar una acción de ingreso o salida.</p>
      </div>

      <div class="search-section flex justify-center mb-8">
        <div class="p-inputgroup search-input-group">
          <span class="p-inputgroup-addon">
            <i class="pi pi-search"></i>
          </span>
          <input
            type="text"
            pInputText
            [(ngModel)]="plate"
            (keyup.enter)="checkStatus()"
            placeholder="INGRESAR PLACA (Ej: ABC123)"
            class="text-3xl p-4 upper-case font-mono"
          />
          <button
            pButton
            label="Consultar"
            icon="pi pi-check-circle"
            (click)="checkStatus()"
            [loading]="loading()"
            class="p-button-lg"
          ></button>
        </div>
      </div>

      <div class="status-actions-grid flex justify-center" *ngIf="vehicleStatus()">
        <p-card [style]="{ width: '100%', maxWidth: '600px' }" class="status-card shadow-xl">
          <div class="flex flex-column align-items-center gap-4 py-4">

            <div
              class="plate-display text-6xl font-black bg-emphasis p-4 border-round-xl border-4 surface-border">
              {{ vehicleStatus()?.plate }}
            </div>

            <div class="flex gap-3 align-items-center">
              <p-badge
                [value]="vehicleStatus()?.isAuthorized ? 'AUTORIZADO' : 'VISITANTE'"
                [severity]="vehicleStatus()?.isAuthorized ? 'success' : 'warn'"
                size="large">
              </p-badge>
              <p-badge
                [value]="vehicleStatus()?.currentStatus === 'IN' ? 'EN PREDIO' : 'AFUERA'"
                [severity]="vehicleStatus()?.currentStatus === 'IN' ? 'danger' : 'success'"
                size="large">
              </p-badge>
            </div>

            <div class="owner-info text-2xl font-semibold text-color-secondary"
                 *ngIf="vehicleStatus()?.ownerName">
              Dueño: {{ vehicleStatus()?.ownerName }}
            </div>

            <div class="actions-buttons w-full grid pt-4 gap-4 px-4">
              <button
                *ngIf="vehicleStatus()?.currentStatus === 'OUT'"
                pButton
                label="REGISTRAR INGRESO"
                icon="pi pi-sign-in"
                severity="success"
                (click)="performAction('ENTRY')"
                class="col-12 text-2xl font-bold py-6 p-button-raised border-round-2xl transition-all"
              ></button>

              <button
                *ngIf="vehicleStatus()?.currentStatus === 'IN'"
                pButton
                label="REGISTRAR SALIDAS"
                icon="pi pi-sign-out"
                severity="danger"
                (click)="performAction('EXIT')"
                class="col-12 text-2xl font-bold py-6 p-button-raised border-round-2xl transition-all"
              ></button>
            </div>
          </div>
        </p-card>
      </div>

      <div class="empty-state text-center mt-8 py-8" *ngIf="!vehicleStatus() && !loading()">
        <i class="pi pi-id-card text-6xl text-muted-color mb-4 opacity-30"></i>
        <h3 class="text-xl text-muted-color">Bienvenido de nuevo, Octavio.</h3>
        <p class="text-secondary-color">Ingresa una placa para empezar el control.</p>
      </div>
    </div>
  `,
  styles: `
    .operations-container {
      padding: 2rem;
      max-width: 1000px;
      margin: 0 auto;
      min-height: 80vh;
    }

    .search-input-group {
      width: 100%;
      max-width: 700px;
    }

    .upper-case {
      text-transform: uppercase;
    }

    .surface-border {
      border-color: var(--p-content-border-color) !important;
    }

    .bg-emphasis {
      background: var(--p-content-background);
    }

    .transition-all:hover {
      transform: scale(1.02);
    }
  `,
})
export class OperationsConsole {
  private parkingService = inject(ParkingService);
  private messageService = inject(MessageService);

  plate = '';
  vehicleStatus = signal<VehicleStatus | null>(null);
  loading = signal(false);

  checkStatus() {
    if (!this.plate || this.plate.length < 3) return;

    this.loading.set(true);
    this.parkingService.getVehicleStatus(this.plate.toUpperCase()).subscribe({
      next: (status) => {
        this.vehicleStatus.set(status);
        this.loading.set(false);
      },
      error: (err: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo consultar la placa'
        });
        this.loading.set(false);
      }
    });
  }

  performAction(type: 'ENTRY' | 'EXIT') {
    if (!this.vehicleStatus()) return;

    const request = {
      plate: this.plate.toUpperCase(),
      parkingLotId: 'd290f1ee-6c54-4b01-90e6-d701748f0851' // Hardcoded ID for MVP as per current implementation
    };

    const operation = type === 'ENTRY'
      ? this.parkingService.registerEntry(request)
      : this.parkingService.registerExit(request);

    operation.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: type === 'ENTRY' ? 'Ingreso Registrado' : 'Salida Registrada',
          detail: `Operación exitosa para la placa ${this.plate.toUpperCase()}`
        });
        this.checkStatus(); // Refresh status after action
      },
      error: (err: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error || 'No se pudo registrar la acción'
        });
      }
    });
  }
}
