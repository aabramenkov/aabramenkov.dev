import { Component, OnInit } from '@angular/core';
import { UserService } from './user.service';
import { AuthService } from 'src/app/_services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from 'src/app/_models/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  userForm: FormGroup;
  user: User = {
    id: 0,
    userName: 'string',
    email: 'string',
    photoUrl: 'string',
    lastActive: new Date(),
    created: new Date(),
    registeredVia: 'string',
  };

  constructor(
    private userservice: UserService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.userservice
      .getUser(this.authService.decodedToken.nameid)
      .subscribe((data: User) => {
        this.user = data;
        this.userForm.setValue({
          userName: this.user.userName,
          email: this.user.email,
        });
      });
    this.createUserForm();
  }

  createUserForm() {
    this.userForm = this.formBuilder.group({
      userName: [this.user.userName, Validators.required],
      email: [this.user.email, [Validators.required, Validators.email]],
    });
  }
  onSubmit() {
    this.userservice.updateUser(this.user.id, this.userForm.value).subscribe(
      () => {
        this.snackBar.open('User sucesfully updated', 'aabramenkov.dev', {
          duration: 2000,
          panelClass: ['mat-toolbar', 'mat-primary'],
        });
      },
      (error) => {
        this.snackBar.open(error, 'aabramenkov.dev');
      }
    );
  }
}