import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SnakeComponent } from './snake/snake.component';
import { FunComponent } from './fun.component';
import {FunRoutingModule} from './fun-routing.module';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import { RenjuComponent } from './renju/renju.component';

@NgModule({
  declarations: [SnakeComponent, FunComponent, RenjuComponent],
  imports: [
    CommonModule,
    FunRoutingModule,
    MatCardModule,
    MatButtonModule
  ],
})
export class FunModule { }
