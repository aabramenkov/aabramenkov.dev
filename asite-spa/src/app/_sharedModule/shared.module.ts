import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HasRoleDirective } from './directives/hasRole.directive';
import { MaterialElevationDirective } from './directives/materialElevation.directive';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SafeHtmlPipe } from './pipes/safeHtml.pipe';

@NgModule({
   imports: [
      CommonModule,
      FontAwesomeModule
   ],
   exports: [
      SafeHtmlPipe,
      HasRoleDirective,
      MaterialElevationDirective,
      FontAwesomeModule
   ],
   declarations: [
      SafeHtmlPipe,
      HasRoleDirective,
      MaterialElevationDirective,
   ],
   providers: [
   ]
})
export class SharedModule { }
