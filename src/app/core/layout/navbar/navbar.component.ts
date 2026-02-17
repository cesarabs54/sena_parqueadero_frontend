import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MenubarModule],
  template: `
    <p-menubar [model]="items">
      <ng-template pTemplate="start">
        <span class="font-bold text-xl ml-2">SmartPark</span>
      </ng-template>
      <ng-template pTemplate="end">
        <div class="flex items-center gap-4 pl-6">
            <div class="flex flex-col items-end">
                <span class="font-semibold text-gray-800">Administrador</span>
                <span class="text-sm text-gray-500">SENA CDP</span>
            </div>
            <div class="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden cursor-pointer hover:bg-slate-300 transition-colors border border-slate-300">
                <i class="pi pi-user text-xl text-slate-600"></i>
            </div>
        </div>
      </ng-template>
    </p-menubar>`
})
export class NavbarComponent {
  items = [
    { label: 'Dashboard', icon: 'pi pi-home', routerLink: '/dashboard' },
    { label: 'Consola', icon: 'pi pi-desktop', routerLink: '/operations' },
    { label: 'Vehículos', icon: 'pi pi-car', routerLink: '/admin/vehicles' },
    { label: 'Admin', icon: 'pi pi-cog', routerLink: '/admin' }
  ];
}
