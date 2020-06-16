import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FbAuthComponent } from './fb-auth.component';
import { LinkedinAuthComponent } from './linkedin-auth.component';


const routes: Routes = [
  { path: 'fb', component: FbAuthComponent },
  { path: 'linkedin', component: LinkedinAuthComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRedirectRoutingModule { }
