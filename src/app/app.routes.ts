import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'vehicles',
    loadComponent: () => import('./features/vehicles/vehicle-list/vehicle-list.component').then(m => m.VehicleListComponent)
  },
  {
    path: 'admin',
    loadComponent: () => import('./features/admin/layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      {
        path: 'history',
        loadComponent: () => import('./features/admin/history/access-history.component').then(m => m.AccessHistoryComponent)
      },
      {
        path: 'zones',
        loadComponent: () => import('./features/admin/zones/zone-management.component').then(m => m.ZoneManagementComponent)
      },
      {path: '', redirectTo: 'history', pathMatch: 'full'}
    ]
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];
