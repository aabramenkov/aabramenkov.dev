import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FunComponent } from './fun.component';
import { SnakeComponent } from './snake/snake.component';
import { RenjuComponent } from './renju/renju.component';


const routes: Routes = [
  {path: '',  component: FunComponent, children: [
    { path: '', redirectTo: 'snake', pathMatch: 'full'},
    { path: 'snake', component: SnakeComponent },
    { path: 'renju', component: RenjuComponent }
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FunRoutingModule { }
