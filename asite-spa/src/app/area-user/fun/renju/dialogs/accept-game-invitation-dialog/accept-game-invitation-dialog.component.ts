import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-accept-game-invitation-dialog',
  templateUrl: './accept-game-invitation-dialog.component.html',
  styleUrls: ['./accept-game-invitation-dialog.component.scss']
})
export class AcceptGameInvitationDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AcceptGameInvitationDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

  acceptInvitation(result: boolean) {
      this.dialogRef.close(result);
  }

}
