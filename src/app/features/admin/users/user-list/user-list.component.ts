import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../../../core/models/user.model';
import { UserService } from '../../../../core/services/user.service';
import { UserFormComponent } from '../user-form/user-form.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, InputTextModule, DialogModule, UserFormComponent, FormsModule],
  template: `
    <div class="card bg-slate-900 border border-slate-800 rounded-lg p-6 shadow-md h-full flex flex-col">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
            <div>
                <h2 class="text-2xl font-bold text-white mb-2">Gestión de Usuarios</h2>
                <p class="text-slate-400">Administra los usuarios del sistema</p>
            </div>
            <button pButton label="Nuevo Usuario" icon="pi pi-plus" class="p-button-outlined p-button-success" (click)="openNew()"></button>
        </div>

        <!-- Filter -->
        <div class="mb-4">
            <span class="p-input-icon-left w-full md:w-80">
                <i class="pi pi-search text-slate-400"></i>
                <input type="text" pInputText placeholder="Buscar usuario..." class="w-full bg-slate-800 border-slate-700 text-white" 
                (input)="onGlobalFilter($event)"/>
            </span>
        </div>

        <!-- Table -->
        <div class="flex-grow overflow-hidden rounded-lg border border-slate-800">
            <p-table #dt [value]="users" [rows]="10" [paginator]="true" [globalFilterFields]="['nombres','apellidos','documento','placa','email']"
                     styleClass="p-datatable-sm p-datatable-gridlines"
                     [rowHover]="true" dataKey="id">
                <ng-template pTemplate="header">
                    <tr class="bg-slate-800 text-slate-200">
                        <th pSortableColumn="nombres" class="text-slate-200 bg-slate-800 border-slate-700">Participante <p-sortIcon field="nombres"></p-sortIcon></th>
                        <th class="text-slate-200 bg-slate-800 border-slate-700">Documento</th>
                        <th class="text-slate-200 bg-slate-800 border-slate-700">Vehículo</th>
                        <th class="text-slate-200 bg-slate-800 border-slate-700">Cargo / Contrato</th>
                        <th class="text-slate-200 bg-slate-800 border-slate-700">Contacto</th>
                        <th class="text-slate-200 bg-slate-800 border-slate-700">Estado</th>
                        <th class="text-slate-200 bg-slate-800 border-slate-700 text-center">Acciones</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-user>
                    <tr class="hover:bg-slate-800/50 transition-colors border-b border-slate-800 text-slate-300">
                        <td class="border-slate-800">
                            <div class="flex flex-col">
                                <span class="font-bold text-white">{{user.nombres}} {{user.apellidos}}</span>
                                <span class="text-xs text-slate-500">{{user.email}}</span>
                            </div>
                        </td>
                        <td class="border-slate-800">
                            <span class="block">{{user.tipoDocumento}}</span>
                            <span class="text-sm text-slate-400">{{user.numeroDocumento}}</span>
                        </td>
                        <td class="border-slate-800">
                             <div class="flex items-center gap-2">
                                <i [class]="user.tipoVehiculo === 'Moto' ? 'pi pi-compass text-orange-400' : 'pi pi-car text-blue-400'"></i>
                                <span>{{user.placa}}</span>
                            </div>
                        </td>
                        <td class="border-slate-800">
                            <div class="flex flex-col">
                                <span>{{user.cargo}}</span>
                                <span class="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 inline-block w-fit mt-1">{{user.tipoContrato}}</span>
                            </div>
                        </td>
                        <td class="border-slate-800">{{user.contacto}}</td>
                        <td class="border-slate-800">
                            <span class="px-2 py-1 rounded text-xs font-bold" 
                            [class]="user.estado === 'Activo' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'">
                                {{user.estado}}
                            </span>
                        </td>
                        <td class="text-center border-slate-800">
                            <button pButton icon="pi pi-pencil" class="p-button-text p-button-info p-button-sm mr-1" (click)="editUser(user)"></button>
                             <button pButton [icon]="user.estado === 'Activo' ? 'pi pi-ban' : 'pi pi-check'" 
                             class="p-button-text p-button-sm" 
                             [class]="user.estado === 'Activo' ? 'p-button-danger' : 'p-button-success'"
                             (click)="toggleStatus(user)"></button>
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>

        <p-dialog [(visible)]="userDialog" [style]="{width: '50vw'}" header="Detalles del Usuario" [modal]="true" styleClass="p-fluid custom-modal">
            <app-user-form [user]="selectedUser" (onSave)="saveUser($event)" (onCancel)="hideDialog()"></app-user-form>
        </p-dialog>
    </div>
  `,
  styles: [`
    :host ::ng-deep .p-datatable-thead > tr > th {
        color: #e2e8f0;
    }
    :host ::ng-deep .p-paginator {
        background: transparent;
        border: none;
        color: #94a3b8;
    }
     :host ::ng-deep .p-paginator .p-paginator-pages .p-paginator-page {
        color: #94a3b8;
    }
     :host ::ng-deep .p-paginator .p-paginator-pages .p-paginator-page.p-highlight {
        background: rgba(255, 255, 255, 0.1);
        color: white;
    }
  `]
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  userDialog: boolean = false;
  selectedUser: User | null = null;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.getUsers().subscribe(data => this.users = data);
  }

  openNew() {
    this.selectedUser = null;
    this.userDialog = true;
  }

  editUser(user: User) {
    this.selectedUser = { ...user };
    this.userDialog = true;
  }

  hideDialog() {
    this.userDialog = false;
  }

  saveUser(user: User) {
    if (user.id) {
      this.userService.updateUser(user);
    } else {
      this.userService.addUser(user);
    }
    this.userDialog = false;
    this.selectedUser = null;
  }

  toggleStatus(user: User) {
    if (user.id) {
      this.userService.toggleStatus(user.id);
    }
  }

  onGlobalFilter(event: Event) {
    const input = event.target as HTMLInputElement;
    // Implement global filter logic if not using PrimeNG default filtering which is template driven
  }
}
