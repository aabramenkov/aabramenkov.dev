import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FunComponent } from './fun.component';


const routes: Routes = [
  {path: '', component: FunComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FunRoutingModule { }
