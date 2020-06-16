import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AuthGuard } from './_guards/auth.guard';
import { AreaUserComponent } from './area-user/area-user.component';
import { AboutComponent } from './area-user/context/about/about.component';

const routes: Routes = [
  {
    path: '',
    component: AreaUserComponent,
    children: [
      { path: '', redirectTo: 'about', pathMatch: 'full'},
      { path: 'about', component: AboutComponent },
      {
        path: 'login',
        loadChildren: () =>
          import('./area-user/login-by-email/login-by-email.module').then(
            (m) => m.LoginByEmailModule
          ),
      },
      {
        path: 'authredirect',
        loadChildren: () =>
          import('./area-user/auth-redirect/auth-redirect.module').then(
            (m) => m.AuthRedirectModule
          ),
      },
      {
        path: 'portfolio',
        loadChildren: () =>
          import('./area-user/context/portfolio/portfolio.module').then(
            (m) => m.PortfolioModule
          ),
      },
      {
        path: 'contacts',
        loadChildren: () =>
          import('./area-user/context/contact/contact.module').then(
            (m) => m.ContactModule
          ),
      },

      {
        path: 'privacy',
        loadChildren: () =>
          import('./area-user/context/privacy/privacy.module').then(
            (m) => m.PrivacyModule
          ),
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('./area-user/profile/profile.module').then(
            (m) => m.ProfileModule
          ),
      },
      {
        path: 'blog',
        loadChildren: () =>
          import('./area-user/context/blog/blog.module').then(
            (m) => m.BlogModule
          ),
      },
      {
        path: 'specialoffer',
        loadChildren: () =>
          import('./area-user/context/special-offer/special-offer.module').then(
            (m) => m.SpecialOfferModule
          ),
      },
    ],
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./area-admin/area-admin.module').then((m) => m.AreaAdminModule),
    canActivate: [AuthGuard],
    data: { roles: ['Admin', 'Moderator', 'User'] },
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
