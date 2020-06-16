import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactRoutingModule } from './contact-routing.module';
import { ContactComponent } from './contact.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialUserAreaModule } from '../../_materialModule/material-userarea.module';
import { SharedModule } from 'src/app/_sharedModule/shared.module';


@NgModule({
  declarations: [
    ContactComponent
  ],
  imports: [
    CommonModule,
    ContactRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialUserAreaModule,
    SharedModule

  ]
})
export class ContactModule { }
