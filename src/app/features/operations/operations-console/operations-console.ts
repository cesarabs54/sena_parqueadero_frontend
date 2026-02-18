import {Component, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {BadgeModule} from 'primeng/badge';
import {ToastModule} from 'primeng/toast';
import {DialogModule} from 'primeng/dialog';
import {MessageService} from 'primeng/api';
import {UserService} from '../../../core/services/user.service';
import {User} from '../../../core/models/user.model';
import {AccessLogEntry, AccessLogService} from '../../../core/services/access-log.service';

type OperationMode = 'ENTRY' | 'EXIT' | null;

@Component({
  selector: 'app-operations-console',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, CardModule, BadgeModule, ToastModule, DialogModule],
  providers: [MessageService],
  template: `
    <div class="operations-container flex flex-col items-center justify-center min-h-[80vh]">
      <p-toast></p-toast>

      <div class="text-center mb-12">
        <h1 class="text-5xl font-bold text-white mb-4">Control de Acceso</h1>
        <p class="text-slate-400 text-xl">Seleccione la operación a realizar</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <button
          class="p-8 rounded-3xl bg-green-600/20 hover:bg-green-600/30 border-2 border-green-500/50 hover:border-green-500 transition-all cursor-pointer flex flex-col items-center gap-6 group"
          (click)="startOperation('ENTRY')">
          <div
            class="w-32 h-32 rounded-full bg-green-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <i class="pi pi-sign-in text-6xl text-green-500"></i>
          </div>
          <span class="text-4xl font-bold text-white tracking-wider">INGRESAR</span>
        </button>

        <button
          class="p-8 rounded-3xl bg-red-600/20 hover:bg-red-600/30 border-2 border-red-500/50 hover:border-red-500 transition-all cursor-pointer flex flex-col items-center gap-6 group"
          (click)="startOperation('EXIT')">
          <div
            class="w-32 h-32 rounded-full bg-red-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <i class="pi pi-sign-out text-6xl text-red-500"></i>
          </div>
          <span class="text-4xl font-bold text-white tracking-wider">SALIR</span>
        </button>
      </div>

      <!-- Main Operation Modal -->
      <p-dialog
        [(visible)]="operationDialog"
        [modal]="true"
        [style]="{width: '600px'}"
        [header]="currentMode === 'ENTRY' ? 'Registrar Ingreso' : 'Registrar Salida'"
        [closable]="true"
        (onHide)="resetState()">

        <div class="flex flex-col gap-6 py-4">

          <!-- Step 1: Input Plate -->
          <div class="flex flex-col gap-2">
            <label class="text-slate-300 font-semibold">Número de Placa</label>
            <div class="p-inputgroup">
              <input
                pInputText
                [(ngModel)]="plate"
                class="text-3xl font-mono uppercase text-center py-3"
                placeholder="ABC-123"
                (keyup.enter)="checkPlate()"
                [disabled]="searchPerformed()"
                autofocus>
              <button
                pButton
                icon="pi pi-search"
                class="p-button-lg"
                (click)="checkPlate()"
                [loading]="loading()"
                [disabled]="searchPerformed() || !plate || plate.length < 3">
              </button>
              <button
                *ngIf="searchPerformed()"
                pButton
                icon="pi pi-times"
                class="p-button-secondary"
                (click)="resetSearch()">
              </button>
            </div>
          </div>

          <!-- Step 2: Result & Actions -->
          <div *ngIf="searchPerformed()" class="animate-fade-in">

            <!-- Authorized User Found -->
            <div *ngIf="foundUser(); else unknownVehicle"
                 class="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
              <div class="flex justify-between items-start mb-4">
                <div>
                  <h3
                    class="text-xl font-bold text-white">{{ foundUser()?.nombres }} {{ foundUser()?.apellidos }}</h3>
                  <p class="text-slate-400">{{ foundUser()?.cargo }}</p>
                  <div class="flex items-center gap-2 mt-2">
                    <i
                      [class]="foundUser()?.tipoVehiculo === 'Moto' ? 'pi pi-compass text-orange-400' : 'pi pi-car text-blue-400'"></i>
                    <span class="text-sm text-slate-300">{{ foundUser()?.placa }}</span>
                  </div>
                </div>
                <p-badge
                  [value]="foundUser()?.estado"
                  [severity]="foundUser()?.estado === 'Activo' ? 'success' : 'danger'"
                  size="large">
                </p-badge>
              </div>

              <div *ngIf="currentMode === 'ENTRY'">
                <button
                  *ngIf="foundUser()?.estado === 'Activo'"
                  pButton
                  label="CONFIRMAR INGRESO"
                  class="w-full p-button-success p-button-lg font-bold"
                  (click)="confirmAction()">
                </button>
                <div *ngIf="foundUser()?.estado !== 'Activo'"
                     class="text-center p-3 bg-red-500/10 rounded border border-red-500/30 text-red-400">
                  Usuario no autorizado para ingresar.
                </div>
              </div>

              <div *ngIf="currentMode === 'EXIT'">
                <button
                  pButton
                  label="REGISTRAR SALIDA"
                  class="w-full p-button-warning p-button-lg font-bold"
                  (click)="confirmAction()">
                </button>
              </div>
            </div>

            <!-- Unknown Vehicle -->
            <ng-template #unknownVehicle>
              <div class="bg-yellow-500/10 p-6 rounded-xl border border-yellow-500/30 text-center">
                <i class="pi pi-exclamation-triangle text-4xl text-yellow-500 mb-2"></i>
                <h3 class="text-lg font-bold text-white mb-1">Vehículo No Registrado</h3>
                <p class="text-slate-400 text-sm mb-4">La placa {{ plate | uppercase }} no pertenece
                  a un usuario activo.</p>

                <div *ngIf="currentMode === 'ENTRY'" class="grid grid-cols-2 gap-3">
                  <button pButton label="Registrar Visitante" icon="pi pi-user-plus"
                          class="p-button-outlined" (click)="showVisitorForm = true"></button>
                  <button pButton label="Rechazar" icon="pi pi-ban" severity="danger"
                          (click)="rejectEntry()"></button>
                </div>

                <div *ngIf="currentMode === 'EXIT'">
                  <p class="text-slate-400 mb-4">¿Registrar salida de vehículo visitante?</p>
                  <button pButton label="CONFIRMAR SALIDA" severity="warn" class="w-full"
                          (click)="confirmAction()"></button>
                </div>
              </div>
            </ng-template>

            <!-- Visitor Form (Nested inside modal) -->
            <div *ngIf="showVisitorForm"
                 class="mt-4 p-4 bg-slate-800 rounded-xl border border-slate-700 animate-fade-in">
              <h4 class="text-white font-bold mb-3">Datos del Visitante</h4>
              <div class="flex flex-col gap-3">
                <input pInputText [(ngModel)]="visitorName" placeholder="Nombre Completo"
                       class="w-full">
                <input pInputText [(ngModel)]="visitorDoc" placeholder="Documento de Identidad"
                       class="w-full">
                <input pInputText [(ngModel)]="visitorReason" placeholder="Motivo de Visita"
                       class="w-full">
                <div class="flex justify-end gap-2 mt-2">
                  <button pButton label="Cancelar" class="p-button-text p-button-sm"
                          (click)="showVisitorForm = false"></button>
                  <button pButton label="Autorizar Acceso" severity="success"
                          (click)="confirmVisitorEntry()"
                          [disabled]="!visitorName || !visitorReason"></button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </p-dialog>
    </div>
  `,
  styles: [`
    :host ::ng-deep .p-dialog-header {
      background: #1e293b;
      color: white;
      border-bottom: 1px solid #334155;
    }

    :host ::ng-deep .p-dialog-content {
      background: #0f172a;
      color: white;
    }

    :host ::ng-deep .p-inputtext:disabled {
      opacity: 0.7;
      background: #1e293b;
    }

    .animate-fade-in {
      animation: fadeIn 0.3s ease-in;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class OperationsConsole {
  private userService = inject(UserService);
  private accessLogService = inject(AccessLogService);
  private messageService = inject(MessageService);

  // State
  operationDialog = false;
  currentMode: OperationMode = null;
  plate = '';
  loading = signal(false);

  // Search State
  foundUser = signal<User | undefined>(undefined);
  searchPerformed = signal(false);

  // Visitor State
  showVisitorForm = false;
  visitorName = '';
  visitorDoc = '';
  visitorReason = '';

  startOperation(mode: OperationMode) {
    this.currentMode = mode;
    this.operationDialog = true;
    this.resetState();
  }

  resetState() {
    this.plate = '';
    this.resetSearch();
  }

  resetSearch() {
    this.searchPerformed.set(false);
    this.foundUser.set(undefined);
    this.showVisitorForm = false;
    this.visitorName = '';
    this.visitorDoc = '';
    this.visitorReason = '';
  }

  checkPlate() {
    if (!this.plate || this.plate.length < 3) return;

    this.loading.set(true);

    // Simulate API delay
    setTimeout(() => {
      this.userService.findUserByPlaca(this.plate).subscribe(user => {
        this.foundUser.set(user);
        this.searchPerformed.set(true);
        this.loading.set(false);
      });
    }, 500);
  }

  confirmAction() {
    // Authorized Entry or Exit
    const user = this.foundUser();
    const type = this.currentMode === 'ENTRY' ? 'ENTRY' : 'EXIT';

    const entry: AccessLogEntry = {
      plate: this.plate.toUpperCase(),
      timestamp: new Date(),
      type: type,
      userType: user ? 'AUTHORIZED' : 'VISITOR',
      userName: user ? `${user.nombres} ${user.apellidos}` : 'Visitante',
      comments: `${type === 'ENTRY' ? 'Ingreso' : 'Salida'} Registrada`
    };

    this.logAndClose(entry, 'success', 'Operación Exitosa');
  }

  confirmVisitorEntry() {
    const entry: AccessLogEntry = {
      plate: this.plate.toUpperCase(),
      timestamp: new Date(),
      type: 'ENTRY',
      userType: 'VISITOR',
      userName: this.visitorName,
      comments: `Visita: ${this.visitorReason}`
    };

    this.logAndClose(entry, 'success', 'Ingreso de Visitante Registrado');
  }

  rejectEntry() {
    const entry: AccessLogEntry = {
      plate: this.plate.toUpperCase(),
      timestamp: new Date(),
      type: 'REJECTED',
      userType: 'VISITOR',
      userName: 'Desconocido',
      comments: 'Ingreso Rechazado'
    };

    this.logAndClose(entry, 'warn', 'Ingreso Rechazado');
  }

  private logAndClose(entry: AccessLogEntry, severity: string, summary: string) {
    this.accessLogService.registerAccess(entry).subscribe(() => {
      this.messageService.add({
        severity: severity,
        summary: summary,
        detail: `${this.plate.toUpperCase()}`
      });
      this.operationDialog = false;
    });
  }
}
