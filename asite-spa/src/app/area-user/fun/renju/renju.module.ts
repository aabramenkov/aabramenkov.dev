import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AcceptGameInvitationDialogComponent } from './dialog/accept-game-invitation-dialog/accept-game-invitation-dialog.component';
import { ChatComponent } from './chat/chat.component';



@NgModule({
  declarations: [AcceptGameInvitationDialogComponent, ChatComponent],
  imports: [
    CommonModule
  ]
})
export class RenjuModule { }
