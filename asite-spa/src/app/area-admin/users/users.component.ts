import { Component, OnInit } from '@angular/core';
import { AdminService } from '../_services/admin.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogEditRoleComponent } from './dialog-edit-role/dialog-edit-role.component';
import { User } from 'src/app/_models/user.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  displayedColumns: string[] = [
    'photoUrl',
    'created',
    'registeredVia',
    'userName',
    'email',
    'roles',
    'action',
  ];
  users: User[];
  // dataSource: User[];

  constructor(private userService: AdminService, private dialog: MatDialog) {}

  ngOnInit() {
    this.userService.getUsers().subscribe((users) => {
      this.users = users;
    });
  }

  openEditRolesModal(user: User) {
    const initialState = {
      user,
      roles: this.getRolesArray(user),
    };

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = initialState;
    const modalDialogRef = this.dialog.open(
      DialogEditRoleComponent,
      dialogConfig
    );
    modalDialogRef.afterClosed().subscribe((roles) => {
      if (roles) {
        const rolesToUpdate = {
          roleNames: [
            ...roles.filter((rl) => rl.checked === true).map((rl) => rl.name),
          ],
        };
        if (rolesToUpdate) {
          this.userService.updateUserRoles(user, rolesToUpdate).subscribe(
            () => {
              user.roles = [...rolesToUpdate.roleNames];
            },
            (error) => {
              console.log(error);
            }
          );
        }
      }
    });
  }

  private getRolesArray(user: User) {
    const roles: any[] = [];
    const userRoles: string[] = user.roles;
    const availableRoles: any[] = [
      { name: 'Admin', value: 'Admin' },
      { name: 'Moderator', value: 'Moderator' },
      { name: 'User', value: 'User' },
      { name: 'VIP', value: 'VIP' },
    ];
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < availableRoles.length; i++) {
      let isMatch = false;
      // tslint:disable-next-line: prefer-for-of
      for (let j = 0; j < userRoles.length; j++) {
        if (availableRoles[i].value === userRoles[j]) {
          isMatch = true;
          availableRoles[i].checked = true;
          roles.push(availableRoles[i]);
          break;
        }
      }
      if (!isMatch) {
        availableRoles[i].checked = false;
        roles.push(availableRoles[i]);
      }
    }
    return roles;
  }
}
