import { Component, Input } from '@angular/core';
import * as moment from 'moment';
import {
  BotSettings,
  Member,
  PopupButtonsMessage,
  PopupTextMessage,
  SendMessageEventData,
  WebscketMessageEvent,
} from 'src/app/models/model';
import { IntentService } from 'src/app/service/intent.service';

import { environment } from './../../../environments/environment';

const WEBSOCKET_URL = environment.webSocketUrl;
const PUSHER_CONNECTED = 'pusher:connection_established';
const PUSHER_SUBSCRIBE = 'pusher:subscribe';
const PUSHER_SUBSCRIBE_SUCCEEDED = 'pusher_internal:subscription_succeeded';
const PUSHER_SERVER_MESSAGE = 'server-message';

@Component({
  selector: 'app-bot',
  templateUrl: './bot.component.html',
  styleUrls: ['./bot.component.scss'],
})
export class BotComponent {
  @Input('settings') settings: BotSettings | null = null;

  showPopover = true;
  showModal = false;
  socket!: WebSocket;

  member!: Member;
  messages: any[] = [];

  constructor(private intentService: IntentService) {}

  /**
   * When settings are present in the received message, and the popup message
   * is also present, different types of the popup messages are handled.
   * When Array -> parse through each message inside the array and assign them to the
   * messages array just to show the popup content.
   * When String (Not Array) -> Just get the text and put it as placeholder message and
   * show in the popup panel.
   */
  ngOnInit() {
    if (this.settings) {
      if (Array.isArray(this.settings?.popupMessage?.message)) {
        const messages = this.settings?.popupMessage?.message as any[];

        messages.map((m: any) => {
          let message: any;
          switch (m.type) {
            case 'text':
              message = m as PopupTextMessage;
              this.messages = [
                ...this.messages,
                {
                  isEvent: false,
                  text: message.text,
                  datetime: null,
                  isVisitor: false,
                  type: 'text',
                },
              ];

              break;
            case 'buttons':
              message = m as PopupButtonsMessage;
              this.messages = [
                ...this.messages,
                {
                  isEvent: false,
                  text: message.text,
                  datetime: null,
                  isVisitor: false,
                  type: 'buttons',
                  buttons: message.buttons,
                },
              ];
              break;
          }
        });
      } else {
        const message = this.settings?.popupMessage?.message as string;
        this.messages = [
          ...this.messages,
          {
            isEvent: false,
            text: message,
            datetime: null,
            isVisitor: false,
            type: 'text',
          },
        ];
      }
    }
  }

  /**
   * Toggles the popover.
   */
  togglePopover() {
    this.showPopover = !this.showPopover;
  }

  /**
   * This opens up the chat modal when the user clicks on the button or the popover text.
   * This is when the Websocket connection is created and the initial request to connect is sent.
   */
  async openModal() {
    this.messages = [];
    this.showPopover = false;
    this.showModal = true;

    if (this.settings) {
      await this.intentService.getChannelInfo(this.settings?.channelId ?? '');

      this.socket = new WebSocket(WEBSOCKET_URL);
      this.socket.addEventListener('open', this.handleOnConnected);
      this.socket.addEventListener('message', this.handleServerMessage);
    }
  }

  /**
   * Callback function after the websocket has opened a connection successfully.
   * @param ev
   */
  handleOnConnected = (ev: any) => {
    console.log('opened connection');
  };

  /**
   * This is the event handler for the Websocket's event received from server.
   */
  handleServerMessage = async (ev: any) => {
    const serverData = JSON.parse(ev.data);
    switch (serverData.event) {
      /**
       * Once after the succesfull connection is done(pusher:connection_established),
       * an auth request is sent to the Insent API to
       * get the auth token to use to verify to join the private channel for this chat.
       */
      case PUSHER_CONNECTED:
        const socketId = JSON.parse(serverData.data).socket_id;
        if (this.settings) {
          await this.getChannelAuth(socketId);
        }
        break;
      /**
       * This is received after the token is verified by the websocket server.
       * After the token is verified by the Socket (pusher_internal:subscription_succeeded),
       * we send a @insent message to invoke the Insent bot.
       */
      case PUSHER_SUBSCRIBE_SUCCEEDED:
        this.sendMessage(
          {
            text: '@insent',
          },
          false
        );
        break;
      /**
       * This is a generic message event that is sent from the bot. This is responsible for the
       * messages in the chat.
       */
      case PUSHER_SERVER_MESSAGE:
        this.handleServerCustomMessage(serverData.data);
        break;
    }
  };

  /**
   * Handling the user's input textbox entered. No validation present yet.
   * There is no automatic enter key submission as well. This function gets the user's
   * input and sends a new message in the socket with the user's input.
   */
  onInputEntered(inputs: any[]) {
    const textObj: any = {};
    inputs.map((s) => {
      textObj[s.key] = s.data;
    });
    this.sendMessage(textObj, false);
  }

  /**
   * This function is responsible to parse the messages if any, that is received from the
   * server. This goes through the list of messages and figures out the type of each message
   * based on the properties and adds it to the messages list to show in the UI.
   * Currently supports Event, Text, Buttons and Input. Sometimes when the message type is text, we need
   * to request an empty server message, for the server to send the next options or messages if any.
   * @param serverMessage
   */
  handleServerCustomMessage = (serverMessage: string) => {
    const data = JSON.parse(serverMessage);
    if (data.messages.length > 0) {
      let isInputExpected = false;

      data.messages.map((m: any) => {
        // Handle the message type EVENT
        if (m.event) {
          if (data.members && data.members.length > 0) {
            this.member = {
              name: data.members[0].name,
              title: data.members[0].title,
            };
          }
          this.messages = [
            ...this.messages,
            {
              isEvent: true,
              text: m.event,
              datetime: moment().format('HH:mm A'),
              isVisitor: false,
              type: '',
            },
          ];
        }
        // Handle the message type TEXT
        else if (m.text) {
          isInputExpected = false;
          this.messages = [
            ...this.messages,
            {
              isEvent: false,
              text: m.text,
              datetime: moment().format('HH:mm A'),
              isVisitor: false,
              type: 'text',
            },
          ];
        }
        // Handle the message type BUTTONS
        else if (m.buttons) {
          isInputExpected = true;
          const pause = m.pause ?? 0;
          setTimeout(() => {
            this.messages = [
              ...this.messages,
              {
                isEvent: false,
                datetime: moment().format('HH:mm A'),
                isVisitor: false,
                type: 'buttons',
                key: m.buttons.key,
                buttons: m.buttons.fields,
              },
            ];
          }, pause);
        }
        // Handle the message type INPUT
        else if (m.input) {
          isInputExpected = true;
          const pause = m.pause ?? 0;
          setTimeout(() => {
            this.messages = [
              ...this.messages,
              {
                isEvent: false,
                datetime: moment().format('HH:mm A'),
                isVisitor: false,
                type: 'input',
                inputs: m.input.map((i: any) => {
                  return { data: '', ...i };
                }),
              },
            ];
          }, pause);
        }
      });

      // Send a dummy request to the server to make sure there is no content that should be
      // renderered without user interaction.
      if (!isInputExpected) {
        this.sendMessage({}, false);
      }
    }
  };

  /**
   * This function sends a click response to the websocket when the user clicks the
   * button from the predefined options from the bot. The existing message that corresponds to the
   * displaying the predefined buttons is replaced by the selected option, as thats how it is
   * designed to behave.
   */
  buttonClicked({
    key,
    button,
    index,
  }: {
    key: string;
    button: string;
    index: number;
  }) {
    const buttonObj: any = {};
    buttonObj[key] = [button];
    this.sendMessage(buttonObj, false);

    this.messages[index] = {
      isEvent: false,
      text: button,
      datetime: moment().format('HH:mm A'),
      isVisitor: true,
      type: 'text',
    };
  }

  /**
   * Sends the message to the websocket server with the required fields. This also adds
   * the message to the messages list to display in the message window. Few messages, that can be
   * avoided to display will not be added to the messages list based on the addToMessage boolean.
   * @param message Object (any) = The message to send to the websocket server. The type is a generic object as
   * different inputs can have different structure for sending messages.
   * @param addToMessage Bool = This boolean value is by default true. Adds to the messages list to show in the UI.
   */
  sendMessage = (message: any, addToMessage = true) => {
    if (this.settings) {
      const sendData: SendMessageEventData = {
        channelName: this.settings.channelId,
        message: message,
        senderId: this.settings.user?.id,
      };
      const data: WebscketMessageEvent = {
        channel: this.settings.subscriptionChannel,
        data: sendData,
        event: 'client-widget-message',
      };
      this.socket.send(JSON.stringify(data));

      if (addToMessage) {
        this.messages = [
          ...this.messages,
          {
            isEvent: false,
            text: message,
            datetime: moment().format('HH:mm A'),
            isVisitor: true,
          },
        ];
      }
    }
  };

  /**
   * This function is responsible to get the currently opened socket verified from the server to access the
   * requested channel and for the user. Without this we cannot send/receive messages to the channel.
   * @param socketId The socket id to verify and authenticate the channel.
   */
  getChannelAuth = async (socketId: string) => {
    if (this.settings) {
      const channelAuth: any = await this.intentService.getChannelAuth(
        this.settings?.user?.id ?? '',
        this.settings.subscriptionChannel ?? '',
        socketId
      );

      const data = {
        auth: channelAuth.auth,
        channel: this.settings.subscriptionChannel,
        channel_data: channelAuth.channel_data,
      };
      this.socket.send(
        JSON.stringify({
          event: PUSHER_SUBSCRIBE,
          data: data,
        })
      );
    }
  };

  /**
   * Closes the modal.
   */
  closeModal() {
    this.showPopover = false;
    this.showModal = false;
  }
}
