import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Member } from '../../models/model';

@Component({
  selector: 'app-bot-message',
  templateUrl: './bot-message.component.html',
  styleUrls: ['./bot-message.component.scss'],
})
export class BotMessageComponent implements OnInit {
  @Input('member') member!: Member;
  @Input('message') message!: any;
  @Input('index') index: number = 0;

  @Output() inputEntered = new EventEmitter();
  @Output() buttonClicked = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  onInputEntered = (message: any) => {
    this.inputEntered.emit(message);
  };

  onButtonClicked(key: string, button: string, index: number) {
    this.buttonClicked.emit({
      key,
      button,
      index,
    });
  }
}
