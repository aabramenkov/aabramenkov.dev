import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SnakeComponent } from './snake/snake.component';
import { FunComponent } from './fun.component';
import {FunRoutingModule} from './fun-routing.module';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import { RenjuModule } from './renju/renju.module';

@NgModule({
  declarations: [SnakeComponent, FunComponent],
  imports: [
    CommonModule,
    FunRoutingModule,
    MatCardModule,
    MatButtonModule,
    RenjuModule
  ],
})
export class FunModule { }
