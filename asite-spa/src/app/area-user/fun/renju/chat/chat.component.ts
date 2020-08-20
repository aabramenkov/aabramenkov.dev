import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { SignalrService } from '../services/signalr.service';
import { Message } from '../models/models';

@Component({
  selector: 'app-renju-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  @Input() chatMessages: Message[] = [];
  @Input() thisUserName!: string;
  @Output() msgEvent = new EventEmitter<string>();
  @ViewChild('msgText') msgInput!: ElementRef;

  constructor() {}

  ngOnInit(): void {
  }

  sendMessage(msgText: string) {
    this.msgEvent.emit(msgText);
    this.msgInput.nativeElement.value = '';
  }
}
