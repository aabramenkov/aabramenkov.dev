import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialUserAreaModule } from '../_materialModule/material-userarea.module';
import { UserService } from './user.service';


@NgModule({
  declarations: [
    ProfileComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    ReactiveFormsModule,
    MaterialUserAreaModule
  ],
  providers: [
    UserService
  ]
})
export class ProfileModule { }
