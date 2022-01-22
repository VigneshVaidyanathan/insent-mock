import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { BotSettings, Member } from '../../models/model';

@Component({
  selector: 'app-bot-chat',
  templateUrl: './bot-chat.component.html',
  styleUrls: ['./bot-chat.component.scss'],
})
export class BotChatComponent implements OnInit {
  @Input('member') member!: Member;
  @Input('messages') messages: any[] = [];
  @Input('settings') settings!: BotSettings | null;

  @Output() inputEntered = new EventEmitter();
  @Output() buttonClicked = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  onInputEntered = (message: any) => {
    this.inputEntered.emit(message);
  };

  onButtonClicked($event: any) {
    this.buttonClicked.emit($event);
  }
}
