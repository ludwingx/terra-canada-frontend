import { Routes } from '@angular/router';
import { MainLayoutComponent } from './components/layout/main-layout/main-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PagosListComponent } from './pages/pagos/pagos-list.component';
import { ProveedoresListComponent } from './pages/proveedores/proveedores-list.component';
import { ClientesListComponent } from './pages/clientes/clientes-list.component';
import { TarjetasListComponent } from './pages/tarjetas/tarjetas-list.component';
import { CuentasListComponent } from './pages/cuentas/cuentas-list.component';
import { DocumentosListComponent } from './pages/documentos/documentos-list.component';
import { CorreosListComponent } from './pages/correos/correos-list.component';
import { UsuariosListComponent } from './pages/usuarios/usuarios-list.component';
import { AuditoriaListComponent } from './pages/auditoria/auditoria-list.component';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './pages/auth/login/login.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { 
    path: 'login', 
    loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent) 
  },
  { path: 'register', redirectTo: 'login', pathMatch: 'full' },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { 
        path: 'dashboard', 
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent) 
      },
      { 
        path: 'financieros/tarjetas', 
        loadComponent: () => import('./features/financieros-tarjetas/financieros-tarjetas.component').then(m => m.FinancierosTarjetasComponent)
      },
      { 
        path: 'pagos', 
        loadComponent: () => import('./pages/pagos/pagos-list.component').then(m => m.PagosListComponent) 
      },
      { 
        path: 'proveedores', 
        loadComponent: () => import('./pages/proveedores/proveedores-list.component').then(m => m.ProveedoresListComponent) 
      },
      { 
        path: 'clientes', 
        loadComponent: () => import('./pages/clientes/clientes-list.component').then(m => m.ClientesListComponent) 
      },
      { 
        path: 'tarjetas', 
        loadComponent: () => import('./pages/tarjetas/tarjetas-list.component').then(m => m.TarjetasListComponent) 
      },
      { 
        path: 'cuentas', 
        loadComponent: () => import('./pages/cuentas/cuentas-list.component').then(m => m.CuentasListComponent) 
      },
      { 
        path: 'documentos', 
        loadComponent: () => import('./pages/documentos/documentos-list.component').then(m => m.DocumentosListComponent) 
      },
      { 
        path: 'correos', 
        loadComponent: () => import('./pages/correos/correos-list.component').then(m => m.CorreosListComponent) 
      },
      { 
        path: 'usuarios', 
        loadComponent: () => import('./pages/usuarios/usuarios-list.component').then(m => m.UsuariosListComponent) 
      },
      { 
        path: 'auditoria', 
        loadComponent: () => import('./pages/auditoria/auditoria-list.component').then(m => m.AuditoriaListComponent) 
      }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
