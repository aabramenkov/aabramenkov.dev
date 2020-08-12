import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat/chat.component';
import { RenjuComponent } from './renju.component';
import { AcceptGameInvitationDialogComponent } from './dialogs/accept-game-invitation-dialog/accept-game-invitation-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    AcceptGameInvitationDialogComponent,
    ChatComponent,
    RenjuComponent,
  ],
  imports: [CommonModule, MatDialogModule],
  exports: [
    RenjuComponent
  ],
  entryComponents: [AcceptGameInvitationDialogComponent],
})
export class RenjuModule {}
