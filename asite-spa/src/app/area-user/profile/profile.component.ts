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
  userForm!: FormGroup;
  user: User = {
    id: 0,
    userName: 'string',
    nickName: 'string',
    email: 'string',
    photoUrl: '',
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
    this.createUserForm();
    this.userservice
      .getUser(this.authService.decodedToken.nameid)
      .subscribe((data: User) => {
        this.user = data;
        this.userForm.setValue({
          nickName: this.user.nickName,
          email: this.user.email,
        });
      });
  }

  createUserForm() {
    this.userForm = this.formBuilder.group({
      nickName: [this.user.nickName, Validators.required],
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
