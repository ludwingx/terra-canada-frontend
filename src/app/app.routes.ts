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

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
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
