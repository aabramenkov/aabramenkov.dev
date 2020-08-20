import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Gamer } from '../../models/models';


@Component({
  selector: 'app-invite-gamer-dialog',
  templateUrl: './invite-gamer-dialog.component.html',
  styleUrls: ['./invite-gamer-dialog.component.scss']
})
export class InviteGamerDialogComponent implements OnInit {
  public activeGamers: Gamer[] = [];
  constructor(public dialogRef: MatDialogRef<InviteGamerDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.activeGamers = this.data.activeGamers;
  }

  inviteGamer(gamer: Gamer) {
      this.dialogRef.close(gamer);
  }

}
