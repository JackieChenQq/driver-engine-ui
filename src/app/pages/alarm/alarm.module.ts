import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlarmRoutingModule } from './alarm-routing.module';
import { AlarmComponent } from './alarm.component';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTransferModule } from 'ng-zorro-antd/transfer';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { FormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzRadioModule } from 'ng-zorro-antd/radio';


@NgModule({
  declarations: [AlarmComponent],
  imports: [
    CommonModule,
    NzDividerModule,
    NzTableModule,
    NzModalModule,
    NzTransferModule,
    NzTreeModule,
    NzInputModule,
    NzButtonModule,
    FormsModule,
    NzFormModule,
    NzRadioModule,
    AlarmRoutingModule
  ]
})
export class AlarmModule { }
