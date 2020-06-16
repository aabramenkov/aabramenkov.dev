import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginByEmailRoutingModule } from './login-by-email-routing.module';
import { LoginByEmailComponent } from './login-by-email.component';
import { MaterialUserAreaModule } from '../_materialModule/material-userarea.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';


@NgModule({
  declarations: [LoginByEmailComponent],
  imports: [
    CommonModule,
    LoginByEmailRoutingModule,
    MaterialUserAreaModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,

  ]
})
export class LoginByEmailModule { }
