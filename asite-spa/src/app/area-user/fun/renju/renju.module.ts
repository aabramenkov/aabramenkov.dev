import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat/chat.component';
import { RenjuComponent } from './renju.component';
import { AcceptGameInvitationDialogComponent } from './dialogs/accept-game-invitation-dialog/accept-game-invitation-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { InviteGamerDialogComponent } from './dialogs/invite-gamer-dialog/invite-gamer-dialog.component';

@NgModule({
  declarations: [
    ChatComponent,
    RenjuComponent,
    AcceptGameInvitationDialogComponent,
    InviteGamerDialogComponent,
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatSnackBarModule,
  ],
  exports: [RenjuComponent],
  entryComponents: [AcceptGameInvitationDialogComponent, InviteGamerDialogComponent],
})
export class RenjuModule {}
