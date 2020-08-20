import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../_models/user.model';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { LoginDialogComponent } from '../area-user/login-dialog/login-dialog.component';
import {URLBuilder} from '@wizpanda/url-builder';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  decodedToken: any;

  isloggedInTmp: boolean = false;
  jwtHelper = new JwtHelperService();
  baseUrl = environment.apiUrl;

  decodedTokenBehavourSubject = new BehaviorSubject<any>({});
  currentDecodedToken = this.decodedTokenBehavourSubject.asObservable();

  currentUser: User | undefined;
  photoUrl = new BehaviorSubject<string>(' ../../assets/user.png');
  currentPhotoUrl = this.photoUrl.asObservable();

  constructor(private http: HttpClient, public dialog: MatDialog) {
    const tokenFromLocalStorage = localStorage.getItem('token');
    if (
      tokenFromLocalStorage &&
      !this.jwtHelper.isTokenExpired(tokenFromLocalStorage)
    ) {
      this.decodedToken = this.jwtHelper.decodeToken(tokenFromLocalStorage);
      this.changeDecodedToken(this.decodedToken);

      const userFromLocalStorage = localStorage.getItem('user');
      if (userFromLocalStorage) {
        this.currentUser = JSON.parse(userFromLocalStorage);
        if (this.currentUser) {
          this.changeMemberPhoto(this.currentUser.photoUrl);
        }
      }
    }
  }

  login(header: string, initialUrl?: string) {
    if (initialUrl) {
      localStorage.setItem('actualPageUrl', initialUrl);
    }
    const initialState = {
      headerText: header,
    };

    const loginDialogConfig = new MatDialogConfig();
    loginDialogConfig.data = initialState;
    loginDialogConfig.width = '300px';
    loginDialogConfig.height = '200px';

    const loginMatDialogRef = this.dialog.open(
      LoginDialogComponent,
      loginDialogConfig
    );
    loginMatDialogRef.afterClosed().subscribe((loginMethod) => {
      switch (loginMethod) {
        case 'facebook': {
          this.fbLogin();
          break;
        }
        case 'linkedin': {
          this.linkedinLogin();
          break;
        }
      }
    });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('actualPageUrl');
    this.decodedToken = null;
    this.currentUser = undefined;
    this.changeDecodedToken(null);
  }

  loginWithEmail(userForLogin: any) {
    return this.http.post(this.baseUrl + 'login', userForLogin).pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          localStorage.setItem('token', user.token);
          localStorage.setItem('user', JSON.stringify(user.user));
          this.decodedToken = this.jwtHelper.decodeToken(user.token);
          this.currentUser = user.user;
          this.changeDecodedToken(this.decodedToken);
          if (this.currentUser) {
            this.changeMemberPhoto(this.currentUser.photoUrl);
          }
        }
      })
    );
  }

  private fbLogin() {
    const urlBuilder = new URLBuilder(environment.fbAuthUrl);
    urlBuilder.setPath('oauth');
    urlBuilder.setQueryParam('client_id', environment.fbClientId);
    urlBuilder.appendQueryParam('redirect_uri', environment.fbRedirectUrl);
    urlBuilder.appendQueryParam('scope', 'email');
    urlBuilder.appendQueryParam('state', 'state123');
    window.location.href = urlBuilder.toString();


// from old urlBuilder
    // const url = buildUrl(environment.fbAuthUrl, {
    //   path: 'oauth',
    //   queryParams: {
    //     client_id: environment.fbClientId,
    //     redirect_uri: environment.fbRedirectUrl,
    //     scope: 'email',
    //     state: 'state123',
    //   },
    // });
  }

  fbAuth(fbAuthCode: string): Observable<any> {
    return this.http.post(this.baseUrl + 'fbauth/fblogin', { fbAuthCode }).pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          localStorage.setItem('token', user.token);
          localStorage.setItem('user', JSON.stringify(user.user));
          this.decodedToken = this.jwtHelper.decodeToken(user.token);
          this.currentUser = user.user;
          this.changeDecodedToken(this.decodedToken);
          if (this.currentUser) {
            this.changeMemberPhoto(this.currentUser.photoUrl);
          }
        }
      })
    );
  }

  private linkedinLogin() {
    const urlBuilder = new URLBuilder(environment.linkedinAuthUrl);
    urlBuilder.setQueryParam('response_type', 'code');
    urlBuilder.appendQueryParam('client_id', environment.linkedinClientId);
    urlBuilder.appendQueryParam('redirect_uri', environment.linkedinRedirectUrl);
    urlBuilder.appendQueryParam('scope', 'r_emailaddress r_liteprofile');
    urlBuilder.appendQueryParam('state', 'state123');
    window.location.href = urlBuilder.toString();

    // const url = buildUrl(environment.linkedinAuthUrl, {
    //   queryParams: {
    //     response_type: 'code',
    //     client_id: environment.linkedinClientId,
    //     redirect_uri: environment.linkedinRedirectUrl,
    //     scope: 'r_emailaddress r_liteprofile',
    //     state: 'state123',
    //   },
    // });
  }
  linkedinAuth(linkedinAuthCode: string): Observable<any> {
    return this.http
      .post(this.baseUrl + 'linkedinAuth/login', { linkedinAuthCode })
      .pipe(
        map((response: any) => {
          const user = response;
          if (user) {
            localStorage.setItem('token', user.token);
            localStorage.setItem('user', JSON.stringify(user.user));
            this.decodedToken = this.jwtHelper.decodeToken(user.token);
            this.currentUser = user.user;
            this.changeDecodedToken(this.decodedToken);
            if (this.currentUser) {
              this.changeMemberPhoto(this.currentUser.photoUrl);
            }
          }
        })
      );
  }
  changeMemberPhoto(photoUrl: string) {
    this.photoUrl.next(photoUrl);
  }

  changeDecodedToken(decodedToken: any) {
    this.decodedTokenBehavourSubject.next(decodedToken);
  }

  public get loggedIn(): boolean {
    const token = localStorage.getItem('token') || '{}';
    return !this.jwtHelper.isTokenExpired(token);
  }

  roleMatch(allowedRoles: string[]): boolean {
    let isMatch = false;
    if (!this.decodedToken) {
      return isMatch;
    }
    if (!this.decodedToken.role) {
      return isMatch;
    }
    const userRoles = this.decodedToken.role as Array<string>;
    allowedRoles.forEach((element) => {
      if (userRoles.includes(element)) {
        isMatch = true;
        return;
      }
    });
    return isMatch;
  }
}
