import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { User } from 'src/app/_models/user.model';

@Component({
  selector: 'app-dialog-edit-role',
  templateUrl: './dialog-edit-role.component.html',
  styleUrls: ['./dialog-edit-role.component.css']
})
export class DialogEditRoleComponent implements OnInit {
  user: User;
  roles: any[];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<DialogEditRoleComponent>) {

    this.user = this.data.user;
    this.roles = this.data.roles;

  }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
