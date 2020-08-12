import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { SignalrService } from '../services/signalr.service';
import { Message } from '../models/models';

@Component({
  selector: 'app-renju-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  public messages: Message[] = [];
  @Input() userNameFrom: string;
  @Input() userNameTo: string;
  @ViewChild('msgText') msgInput: ElementRef;

  constructor(private signalrService: SignalrService) {}

  ngOnInit(): void {
    this.signalrService.messageListener().subscribe((message: Message) => {
      this.messages.push(message);
      this.msgInput.nativeElement.value = '';
    });
  }

  sendMessage(msgText: string) {
    const message: Message = {
      from: this.userNameFrom,
      to: this.userNameTo,
      sent: new Date(),
      text: msgText,
    };
    this.signalrService.sendMessage(message);
  }
}


