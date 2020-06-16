import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginByEmailComponent } from './login-by-email.component';


const routes: Routes = [
  {path: '', component: LoginByEmailComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginByEmailRoutingModule { }
