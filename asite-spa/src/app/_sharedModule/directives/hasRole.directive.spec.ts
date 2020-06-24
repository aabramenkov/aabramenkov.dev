import { HasRoleDirective } from './hasRole.directive';
import { Component, ElementRef, Injectable } from '@angular/core';
import { TestBed, getTestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { AuthService } from 'src/app/_services/auth.service';
import { Observable} from 'rxjs';
import { of } from 'rxjs';

@Component({
  template: `<div>
    <p *appHasRole="['Admin', 'Moderator']">mockContext</p>
  </div>`,
})
class MockComponent {}

@Injectable()
class MockAuthService extends AuthService  {
  currentDecodedToken: Observable<any> = of({ role: ['Admin'] });
  roleMatch(): boolean{
      return true;
  }
}

describe('HasRoleDirective', () => {
  let elementRef: ElementRef;
  let fixture: ComponentFixture<MockComponent>;
  let mockAuthService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: AuthService,
          useClass: MockAuthService,
        },
      ],
      declarations: [MockComponent, HasRoleDirective],
      imports: [HttpClientTestingModule, MatDialogModule],
    });
    fixture = TestBed.createComponent(MockComponent);
    mockAuthService = TestBed.inject(AuthService);
  });

  it('should be null if roles not match', () => {
    spyOn(mockAuthService, 'roleMatch').and.returnValue(false);
    fixture.detectChanges();
    elementRef = fixture.debugElement.query(By.css('p'));
    expect(elementRef).toBeNull();
  });

  it('should not be empty if roles match', () => {
    spyOn(mockAuthService, 'roleMatch').and.returnValue(true);
    fixture.detectChanges();
    elementRef = fixture.debugElement.query(By.css('p'));
    expect(elementRef.nativeElement).toBeDefined();
  });
});
