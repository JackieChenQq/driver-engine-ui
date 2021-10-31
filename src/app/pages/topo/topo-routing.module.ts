import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TopoComponent } from './topo.component';

const routes: Routes = [{ path: '', component: TopoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TopoRoutingModule { }
