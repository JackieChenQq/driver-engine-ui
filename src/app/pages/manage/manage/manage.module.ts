import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageRoutingModule } from './manage-routing.module';
import { ManageComponent } from './manage.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTransferModule } from 'ng-zorro-antd/transfer';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { ModelsComponent } from './models/models/models.component';
import { ViewModelComponent } from './models/models/view/view-model/view-model.component';
import { FormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';


@NgModule({
  declarations: [ManageComponent, ModelsComponent, ViewModelComponent],
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
    NzIconModule,
    NzRadioModule,
    ManageRoutingModule
  ]
})
export class ManageModule { }
