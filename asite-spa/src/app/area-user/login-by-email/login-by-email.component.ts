import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../_services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-by-email',
  templateUrl: './login-by-email.component.html',
  styleUrls: ['./login-by-email.component.scss']
})
export class LoginByEmailComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  loginForm = this.formBuilder.group({
    email: ['', Validators.email],
    password: ['', Validators.required],
  });

  ngOnInit(): void {
  }
  loginWithEmail() {
    this.authService.loginWithEmail(this.loginForm.value).subscribe(
      () => {
        this.router.navigate(['about'])
      },
      (error) => {
        this.router.navigate(['about'])
      }
    );
  }
}
