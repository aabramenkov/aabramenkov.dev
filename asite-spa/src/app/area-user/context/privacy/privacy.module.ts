import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrivacyRoutingModule } from './privacy-routing.module';
import { PrivacyPolicyComponent } from './privacy-policy.component';
import { SharedModule } from 'src/app/_sharedModule/shared.module';
import { MaterialUserAreaModule } from '../../_materialModule/material-userarea.module';


@NgModule({
  declarations: [
    PrivacyPolicyComponent
  ],
  imports: [
    CommonModule,
    PrivacyRoutingModule,
    SharedModule,
    MaterialUserAreaModule
  ]
})
export class PrivacyModule { }
