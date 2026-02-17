import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {ButtonModule} from 'primeng/button';
import {MenuModule} from 'primeng/menu';
import {InputTextModule} from 'primeng/inputtext';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, MenuModule, InputTextModule],
  template: `
    <div class="flex h-screen bg-slate-950">
      <!-- Sidebar (Dark Theme) -->
      <div class="w-72 h-full bg-slate-900 shadow-lg flex flex-col transition-all duration-300 border-r border-slate-800">
        <!-- Logo Area -->
        <div class="p-6 flex flex-col items-center border-b border-slate-800">
          <div class="w-32 h-32 flex items-center justify-center p-2 rounded-full bg-slate-800 mb-4 shadow-md overflow-hidden">
             <img src="Logo SENA.svg" alt="SENA Logo" class="w-full h-full object-contain drop-shadow-md">
          </div>
          <span class="text-xl font-bold text-white mb-1 tracking-tight">SmartPark Admin</span>
          <span class="text-sm text-slate-400">Panel de Control</span>
        </div>

        <!-- Navigation -->
        <div class="flex-grow p-4 overflow-y-auto custom-scrollbar">
            <div class="flex flex-col gap-2">
                <a routerLink="/admin/history" routerLinkActive="bg-orange-500/10 text-orange-500 border-l-4 border-orange-500"
                   class="p-3 flex items-center text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors duration-200 cursor-pointer no-underline">
                    <i class="pi pi-history text-xl mr-3"></i>
                    <span class="font-medium">Historial de Accesos</span>
                </a>
                <a routerLink="/admin/zones" routerLinkActive="bg-orange-500/10 text-orange-500 border-l-4 border-orange-500"
                   class="p-3 flex items-center text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors duration-200 cursor-pointer no-underline">
                    <i class="pi pi-map text-xl mr-3"></i>
                    <span class="font-medium">Gestión de Zonas</span>
                </a>
            </div>
        </div>

        <!-- Footer / Back -->
        <div class="p-4 border-t border-slate-800">
            <button pButton label="Volver a la App" icon="pi pi-arrow-left"
                class="p-button-text p-button-plain text-slate-400 w-full hover:text-white hover:bg-slate-800 rounded"
                routerLink="/dashboard"></button>
        </div>
      </div>

      <!-- Main Content -->
      <div class="flex-grow flex flex-col h-full overflow-hidden bg-slate-950">
        <!-- Topbar -->
        <div class="h-20 bg-slate-900 shadow-sm flex items-center px-8 justify-between z-1 relative border-b border-slate-800">
            <div class="flex items-center">
                <h1 class="text-2xl font-semibold text-white m-0">Dashboard</h1>
            </div>

            <div class="flex items-center gap-6">
                <span class="p-input-icon-left">
                    <i class="pi pi-search text-slate-400"></i>
                    <input type="text" pInputText placeholder="Buscar..." class="w-80 rounded-2xl bg-slate-800 border-none text-white focus:bg-slate-700 transition-all placeholder-slate-500" />
                </span>

                <div class="flex items-center gap-4 border-l border-slate-700 pl-6">
                    <div class="flex flex-col items-end">
                        <span class="font-semibold text-white">Administrador</span>
                        <span class="text-sm text-slate-400">SENA CDP</span>
                    </div>
                    <div class="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden cursor-pointer hover:bg-slate-700 transition-colors border border-slate-700">
                        <i class="pi pi-user text-xl text-slate-300"></i>
                    </div>
                </div>
            </div>
        </div>

        <!-- Scrollable Content -->
        <div class="flex-grow p-8 overflow-y-auto bg-slate-950">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
        display: block;
        height: 100vh;
    }
    .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background-color: rgba(255,255,255,0.1);
        border-radius: 20px;
    }
    .tracking-tight {
        letter-spacing: -0.5px;
    }
    /* Force PrimeNG Input Styles in Dark Mode if needed */
    :host ::ng-deep .p-inputtext {
        color: white;
        background-color: rgb(30 41 59); /* slate-800 */
        border: 1px solid rgb(51 65 85); /* slate-700 */
    }
  `]
})
export class AdminLayoutComponent {
  // Items array no longer needed as we use custom HTML for better styling control
}
