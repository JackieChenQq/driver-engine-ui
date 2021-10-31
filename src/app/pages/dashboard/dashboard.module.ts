import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { MonitorComponent } from './monitor/monitor.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTransferModule } from 'ng-zorro-antd/transfer';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [DashboardComponent, MonitorComponent],
  imports: [
    CommonModule,
    NzTableModule,
    NzDividerModule,
    NzModalModule,
    NzTransferModule,
    NzTreeModule,
    NzInputModule,
    NzButtonModule,
    FormsModule,
    NzFormModule,
    NzRadioModule,
    NzCardModule,
    NzStatisticModule,
    NzIconModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
