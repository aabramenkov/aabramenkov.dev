import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SnakeComponent } from './snake.component';
import {MatCardModule} from '@angular/material/card';



@NgModule({
  declarations: [SnakeComponent],
  imports: [
    CommonModule,
    MatCardModule
  ],
  exports: [SnakeComponent]
})
export class SnakeModule { }
