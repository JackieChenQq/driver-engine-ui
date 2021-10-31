import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MonitorComponent } from './pages/dashboard/monitor/monitor.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/welcome' },
  { path: 'welcome', loadChildren: () => import('./pages/welcome/welcome.module').then(m => m.WelcomeModule) },
  { path: 'monitor', component: MonitorComponent },
  { path: 'manage', loadChildren: () => import('./pages/manage/manage/manage.module').then(m => m.ManageModule) },
  { path: 'alarm', loadChildren: () => import('./pages/alarm/alarm.module').then(m => m.AlarmModule) },
  { path: 'topo', loadChildren: () => import('./pages/topo/topo.module').then(m => m.TopoModule) },
  { path: 'dashboard', loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
