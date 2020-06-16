import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpecialOfferRoutingModule } from './special-offer-routing.module';
import { SpecialOfferComponent } from './special-offer.component';
import { MaterialUserAreaModule } from '../../_materialModule/material-userarea.module';
import { SharedModule } from 'src/app/_sharedModule/shared.module';



@NgModule({
  declarations: [SpecialOfferComponent],
  imports: [
    CommonModule,
    SpecialOfferRoutingModule,
    MaterialUserAreaModule,
    SharedModule
  ]
})
export class SpecialOfferModule { }
