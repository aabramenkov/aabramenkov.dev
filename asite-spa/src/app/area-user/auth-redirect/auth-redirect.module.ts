import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRedirectRoutingModule } from './auth-redirect-routing.module';
import { FbAuthComponent } from './fb-auth.component';
import { LinkedinAuthComponent } from './linkedin-auth.component';


@NgModule({
  declarations: [
    FbAuthComponent,
    LinkedinAuthComponent
  ],
  imports: [
    CommonModule,
    AuthRedirectRoutingModule
  ]
})
export class AuthRedirectModule { }
