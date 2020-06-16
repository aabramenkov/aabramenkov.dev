import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {faFacebookF} from '@fortawesome/free-brands-svg-icons';
import {faLinkedinIn} from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-login',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss'],
})
export class LoginDialogComponent implements OnInit {
  faFacebookF = faFacebookF;
  faLinkedinIn = faLinkedinIn;

  headerText: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<LoginDialogComponent>,
  ) {
    this.headerText = this.data.headerText;
  }
  ngOnInit() {}

  Login(loginMethod: string) {
    this.dialogRef.close(loginMethod);
  }

}
