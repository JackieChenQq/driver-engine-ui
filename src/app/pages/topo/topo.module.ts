import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TopoRoutingModule } from './topo-routing.module';
import { TopoComponent } from './topo.component';


@NgModule({
  declarations: [TopoComponent],
  imports: [
    CommonModule,
    TopoRoutingModule
  ]
})
export class TopoModule { }
