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
import { RegisterComponent } from './pages/auth/register/register.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { 
        path: 'financieros/tarjetas', 
        loadComponent: () => import('./features/financieros-tarjetas/financieros-tarjetas.component').then(m => m.FinancierosTarjetasComponent)
      },
      { path: 'pagos', component: PagosListComponent },
      { path: 'proveedores', component: ProveedoresListComponent },
      { path: 'clientes', component: ClientesListComponent },
      { path: 'tarjetas', component: TarjetasListComponent },
      { path: 'cuentas', component: CuentasListComponent },
      { path: 'documentos', component: DocumentosListComponent },
      { path: 'correos', component: CorreosListComponent },
      { path: 'usuarios', component: UsuariosListComponent },
      { path: 'auditoria', component: AuditoriaListComponent }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
