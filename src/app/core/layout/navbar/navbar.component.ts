import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MenubarModule} from 'primeng/menubar';
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MenubarModule],
  template: `
    <p-menubar [model]="items">
      <ng-template pTemplate="start">
        <span class="font-bold text-xl ml-2">SmartPark</span>
      </ng-template>
    </p-menubar>`
})
export class NavbarComponent {
  items: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      routerLink: '/dashboard'
    },
    {
      label: 'Vehículos',
      icon: 'pi pi-car',
      routerLink: '/vehicles'
    }
  ];
}
