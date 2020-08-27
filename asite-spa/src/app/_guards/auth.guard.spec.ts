import { TestBed, getTestBed } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../_services/auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router, ActivatedRouteSnapshot, Data } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';

class MockActivatedRouteSnapshot {
  data: Data|undefined;
}

class MockRouter {
  navigate(path: string) {}
}

describe('TestGuard', () => {
  let injector: TestBed;
  let authService: AuthService;
  let guard: AuthGuard;
  let router: Router;
  let activatedRouteSnapshot: ActivatedRouteSnapshot;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: Router, useClass: MockRouter },
        {
          provide: ActivatedRouteSnapshot,
          useClass: MockActivatedRouteSnapshot,
        },
      ],
      imports: [HttpClientTestingModule, MatDialogModule],
    });
    injector = getTestBed();
    authService = injector.inject(AuthService);
    router = injector.inject(Router);
    activatedRouteSnapshot = injector.inject(ActivatedRouteSnapshot);
    guard = injector.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should return true if role match', () => {
    activatedRouteSnapshot.data = { roles: ['just not empty array'] };
    spyOn(authService, 'roleMatch').and.returnValue(true);
    expect(guard.canActivate(activatedRouteSnapshot)).toEqual(true);
  });

  it('should redirect to about if role not match', () => {
    activatedRouteSnapshot.data = { roles: ['just not empty array'] };
    spyOn(authService, 'roleMatch').and.returnValue(false);
    spyOn(router, 'navigate');
    expect(guard.canActivate(activatedRouteSnapshot)).toEqual(false);
    expect(router.navigate).toHaveBeenCalledWith(['about']);
  });

  it('should return true if user logged in', () => {
    activatedRouteSnapshot.data = {};
    expect(guard.canActivate(activatedRouteSnapshot)).toEqual(false);
  });

  it('should redirect to about if user not logged in', () => {
    activatedRouteSnapshot.data = {};
    spyOn(router, 'navigate');
    expect(guard.canActivate(activatedRouteSnapshot)).toEqual(false);
    expect(router.navigate).toHaveBeenCalledWith(['about']);
  });
});
