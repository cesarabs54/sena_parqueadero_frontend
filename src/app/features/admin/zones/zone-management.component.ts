import {Component, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import {DialogModule} from 'primeng/dialog';
import {InputTextModule} from 'primeng/inputtext';
import {InputNumberModule} from 'primeng/inputnumber';
import {FormsModule} from '@angular/forms';
import {ParkingService} from '../../../infrastructure/adapters/parking.service';
import {TooltipModule} from 'primeng/tooltip';

interface Zone {
  id: string;
  name: string;
  capacity: number;
  occupied: number;
}

@Component({
  selector: 'app-zone-management',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, DialogModule, InputTextModule, InputNumberModule, FormsModule, TooltipModule],
  template: `
    <div class="bg-slate-900 p-6 shadow-md rounded-xl border border-slate-800">
        <div class="flex justify-between items-center mb-6">
            <div>
                <h2 class="m-0 text-white font-bold text-2xl">Gestión de Zonas</h2>
                <p class="text-slate-400 mt-1 mb-0">Configuración de áreas y capacidades</p>
            </div>
            <p-button label="Nueva Zona" icon="pi pi-plus" (onClick)="openNew()" [rounded]="true"></p-button>
        </div>

        <p-table [value]="zones()" [loading]="loading()" styleClass="p-datatable-striped" [tableStyle]="{'min-width': '50rem'}">
            <ng-template pTemplate="header">
                <tr>
                    <th class="bg-slate-800 text-slate-300 font-semibold p-4 rounded-tl-lg border-b border-slate-700">Nombre</th>
                    <th class="bg-slate-800 text-slate-300 font-semibold p-4 border-b border-slate-700">Capacidad</th>
                    <th class="bg-slate-800 text-slate-300 font-semibold p-4 border-b border-slate-700">Ocupación Actual</th>
                    <th class="bg-slate-800 text-slate-300 font-semibold p-4 rounded-tr-lg border-b border-slate-700">Acciones</th>
                </tr>
            </ng-template>
            <ng-template pTemplate="body" let-zone>
                <tr class="border-b border-slate-800 last:border-0 hover:bg-slate-800/50 transition-colors">
                    <td class="p-4 font-bold text-white">{{ zone.name }}</td>
                    <td class="p-4">
                        <span class="p-2 bg-slate-800 rounded text-slate-300 font-medium">{{ zone.capacity }} espacios</span>
                    </td>
                    <td class="p-4">
                        <span class="p-2 rounded font-medium text-sm"
                              [ngClass]="{'bg-green-900/30 text-green-400': zone.occupied < zone.capacity * 0.8, 'bg-red-900/30 text-red-400': zone.occupied >= zone.capacity * 0.8}">
                            {{ zone.occupied }} vehículos
                        </span>
                    </td>
                    <td class="p-4">
                        <p-button icon="pi pi-pencil" [text]="true" [rounded]="true" (onClick)="editZone(zone)" pTooltip="Editar descripción" styleClass="text-slate-300 hover:text-white hover:bg-slate-800"></p-button>
                    </td>
                </tr>
            </ng-template>
            <ng-template pTemplate="emptymessage">
                <tr>
                    <td colspan="4" class="text-center p-8 text-slate-500">No hay zonas configuradas.</td>
                </tr>
            </ng-template>
        </p-table>

        <p-dialog [(visible)]="dialogVisible" [header]="'Detalles de Zona'" [modal]="true" [style]="{width: '450px'}" styleClass="rounded-xl overflow-hidden dark-dialog">
            <div class="flex flex-col gap-4 p-fluid" *ngIf="selectedZone">
                <div class="flex flex-col gap-2">
                    <label for="name" class="font-semibold text-slate-300">Nombre</label>
                    <input type="text" pInputText id="name" [(ngModel)]="selectedZone.name" class="w-full bg-slate-800 border-slate-700 text-white" />
                </div>
                <div class="flex flex-col gap-2">
                    <label for="capacity" class="font-semibold text-slate-300">Capacidad</label>
                    <p-inputNumber id="capacity" [(ngModel)]="selectedZone.capacity" [min]="1" [showButtons]="true" class="w-full" styleClass="bg-slate-800 border-slate-700 text-white"></p-inputNumber>
                </div>
            </div>
            <ng-template pTemplate="footer">
                <p-button label="Cancelar" icon="pi pi-times" [text]="true" (onClick)="hideDialog()" styleClass="text-slate-400 hover:text-white"></p-button>
                <p-button label="Guardar" icon="pi pi-check" (onClick)="saveZone()"></p-button>
            </ng-template>
        </p-dialog>
    </div>
  `,
  styles: [`
    :host ::ng-deep .p-datatable.p-datatable-striped .p-datatable-tbody > tr:nth-child(even) {
        background: rgba(255, 255, 255, 0.03);
    }
    :host ::ng-deep .p-datatable .p-datatable-tbody > tr {
        background: transparent;
        color: white;
    }
    :host ::ng-deep .p-datatable .p-datatable-tbody > tr:hover {
        background: rgba(30, 41, 59, 0.5); /* slate-800/50 */
    }

    /* Dark Dialog Overrides */
    :host ::ng-deep .p-dialog .p-dialog-header {
        background: rgb(15 23 42); /* slate-900 */
        color: white;
        border-bottom: 1px solid rgb(51 65 85); /* slate-700 */
    }
    :host ::ng-deep .p-dialog .p-dialog-content {
        background: rgb(15 23 42); /* slate-900 */
        color: white;
        padding-top: 1.5rem;
    }
    :host ::ng-deep .p-dialog .p-dialog-footer {
        background: rgb(15 23 42); /* slate-900 */
        border-top: 1px solid rgb(51 65 85); /* slate-700 */
    }
    :host ::ng-deep .p-inputnumber-input {
        background-color: rgb(30 41 59) !important; /* slate-800 */
        color: white !important;
        border-color: rgb(51 65 85) !important; /* slate-700 */
    }
  `]
})
export class ZoneManagementComponent implements OnInit {
  private parkingService = inject(ParkingService);
  zones = signal<Zone[]>([]);
  loading = signal<boolean>(false);

  dialogVisible = false;
  selectedZone: Zone = {id: '', name: '', capacity: 0, occupied: 0};

  ngOnInit() {
    this.loadZones();
  }

  loadZones() {
    this.loading.set(true);
    this.parkingService.getAllParkingLots().subscribe({
      next: (data) => {
        this.zones.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading zones', err);
        this.loading.set(false);
      }
    });
  }

  openNew() {
    this.selectedZone = {id: '', name: '', capacity: 0, occupied: 0};
    this.dialogVisible = true;
  }

  editZone(zone: Zone) {
    this.selectedZone = {...zone};
    this.dialogVisible = true;
  }

  hideDialog() {
    this.dialogVisible = false;
  }

  saveZone() {
    if (this.selectedZone.id) {
      this.parkingService.updateParkingLot(this.selectedZone.id, this.selectedZone).subscribe(() => {
        this.loadZones();
        this.dialogVisible = false;
      });
    } else {
      this.parkingService.createParkingLot(this.selectedZone).subscribe(() => {
        this.loadZones();
        this.dialogVisible = false;
      });
    }
  }
}
