import {Component, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TableModule} from 'primeng/table';
import {TagModule} from 'primeng/tag';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {FormsModule} from '@angular/forms';
import {AccessLog} from '../../../core/models/access.model';
import {ParkingService} from '../../../infrastructure/adapters/parking.service';

import {TooltipModule} from 'primeng/tooltip';

@Component({
  selector: 'app-access-history',
  standalone: true,
  imports: [CommonModule, TableModule, TagModule, ButtonModule, InputTextModule, FormsModule, TooltipModule],
  template: `
    <div class="bg-slate-900 p-6 shadow-md rounded-xl border border-slate-800">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h2 class="m-0 text-white font-bold text-2xl">Historial de Accesos</h2>
          <p class="text-slate-400 mt-1 mb-0">Monitorización de entradas y salidas en tiempo
            real</p>
        </div>
        <div class="flex gap-3">
                <span class="p-input-icon-left">
                    <i class="pi pi-search text-slate-400"></i>
                    <input pInputText type="text" [(ngModel)]="filterPlate"
                           placeholder="Buscar placa..."
                           class="rounded-lg bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-orange-500 focus:ring-orange-500"/>
                </span>
          <p-button icon="pi pi-refresh" [text]="true" [rounded]="true" (onClick)="loadLogs()"
                    pTooltip="Recargar"
                    styleClass="text-slate-300 hover:bg-slate-800 hover:text-white"></p-button>
          <p-button icon="pi pi-filter-slash" [text]="true" [rounded]="true"
                    (onClick)="clearFilter()" pTooltip="Limpiar filtros"
                    styleClass="text-slate-300 hover:bg-slate-800 hover:text-white"></p-button>
        </div>
      </div>

      <p-table [value]="logs()" [rows]="10" [paginator]="true" [loading]="loading()"
               styleClass="p-datatable-striped" [tableStyle]="{'min-width': '50rem'}">
        <ng-template pTemplate="header">
          <tr>
            <th
              class="bg-slate-800 text-slate-300 font-semibold p-4 rounded-tl-lg border-b border-slate-700">
              Placa
            </th>
            <th class="bg-slate-800 text-slate-300 font-semibold p-4 border-b border-slate-700">
              Tipo
            </th>
            <th class="bg-slate-800 text-slate-300 font-semibold p-4 border-b border-slate-700">
              Fecha y Hora
            </th>
            <th
              class="bg-slate-800 text-slate-300 font-semibold p-4 rounded-tr-lg border-b border-slate-700">
              Sede / Zona
            </th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-log>
          <tr
            class="border-b border-slate-800 last:border-0 hover:bg-slate-800/50 transition-colors">
            <td class="p-4">
              <div class="flex items-center gap-3">
                <i class="pi pi-car text-slate-500 text-xl"></i>
                <span class="font-bold text-white">{{ log.plate }}</span>
              </div>
            </td>
            <td class="p-4">
              <p-tag [value]="log.type === 'ENTRY' ? 'ENTRADA' : 'SALIDA'"
                     [severity]="log.type === 'ENTRY' ? 'success' : 'warn'"
                     [rounded]="true" styleClass="uppercase text-xs font-bold px-2 py-1"></p-tag>
            </td>
            <td class="text-slate-300 p-4">{{ log.timestamp | date:'medium' }}</td>
            <td class="p-4">
              <div class="flex items-center gap-2 text-slate-300">
                <i class="pi pi-building text-slate-500"></i>
                <span>Principal</span>
              </div>
            </td>
          </tr>
        </ng-template>
        <ng-template pTemplate="emptymessage">
          <tr>
            <td colspan="4" class="text-center p-8 text-slate-500 font-medium">No se encontraron
              registros.
            </td>
          </tr>
        </ng-template>
      </p-table>
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

    :host ::ng-deep .p-paginator {
      background: transparent;
      border: none;
      color: white;
    }

    :host ::ng-deep .p-paginator .p-paginator-pages .p-paginator-page {
      color: #94a3b8; /* slate-400 */
    }

    :host ::ng-deep .p-paginator .p-paginator-pages .p-paginator-page.p-highlight {
      background: rgba(249, 115, 22, 0.2);
      color: #f97316; /* orange-500 */
    }
  `]
})
export class AccessHistoryComponent implements OnInit {
  private parkingService = inject(ParkingService);
  logs = signal<AccessLog[]>([]);
  loading = signal<boolean>(false);
  filterPlate = '';

  ngOnInit() {
    this.loadLogs();
  }

  loadLogs() {
    this.loading.set(true);
    this.parkingService.getAccessLogs().subscribe({
      next: (data) => {
        this.logs.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading logs', err);
        this.loading.set(false);
      }
    });
  }

  clearFilter() {
    this.filterPlate = '';
    this.loadLogs();
  }
}
