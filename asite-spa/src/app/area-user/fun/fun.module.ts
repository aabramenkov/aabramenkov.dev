import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FunComponent } from './fun.component';
import {FunRoutingModule} from './fun-routing.module';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import { RenjuModule } from './renju/renju.module';
import {SnakeModule} from './snake/snake.module';

@NgModule({
  declarations: [FunComponent],
  imports: [
    CommonModule,
    FunRoutingModule,
    MatCardModule,
    MatButtonModule,
    RenjuModule,
    SnakeModule
  ],
})
export class FunModule { }
