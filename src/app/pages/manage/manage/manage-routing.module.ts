import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageComponent } from './manage.component';
import { ModelsComponent } from './models/models/models.component';

const routes: Routes = [
  { path: '', component: ManageComponent },
  { path: 'models', component: ModelsComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageRoutingModule { }
