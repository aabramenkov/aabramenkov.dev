import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { JwtModule } from '@auth0/angular-jwt';
import { ErrorInterceptorProvider } from './_services/error.interceptor';
import { AreaUserComponent } from './area-user/area-user.component';
import { HeaderComponent } from './area-user/navigation/header/header.component';
import { SidenavListComponent } from './area-user/navigation/sidenav-list/sidenav-list.component';
import { LoginDialogComponent } from './area-user/login-dialog/login-dialog.component';
import { FooterComponent } from './area-user/navigation/footer/footer.component';
import { SharedModule } from './_sharedModule/shared.module';
import { MaterialBootstrapModule } from './area-user/_materialModule/material-bootstrap.module';
import { GraphQLModule } from './graphql.module';
import { AboutComponent } from './area-user/context/about/about.component';

export function tokenGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [
    AppComponent,
    AreaUserComponent,
    HeaderComponent,
    SidenavListComponent,
    LoginDialogComponent,
    FooterComponent,
    AboutComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
    MaterialBootstrapModule,
    JwtModule.forRoot({
      config: {
        // tslint:disable-next-line: object-literal-shorthand
        tokenGetter: tokenGetter,
        whitelistedDomains: ['localhost:5000', 'https://aabramenkov.dev'],
        blacklistedRoutes: ['localhost:5000/api/auth', 'https://aabramenkov.dev/api/auth']
      }
    }),
    GraphQLModule,

  ],
  entryComponents: [
    LoginDialogComponent
  ],
  providers: [
    ErrorInterceptorProvider
],
  bootstrap: [AppComponent]
})
export class AppModule { }
