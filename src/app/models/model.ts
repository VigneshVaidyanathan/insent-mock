export class PopupTextMessage {
  text?: string;
  type?: string;
}

export class PopupButtonsMessageData {
  text?: string;
  sid?: string;
}

export class PopupButtonsMessage {
  type?: string;
  key?: string;
  buttons?: PopupButtonsMessageData[];
}

export class PopupMessage {
  message?: PopupTextMessage[] | PopupButtonsMessage[] | string;
  info?: boolean;
}

export class Bot {
  name?: string;
  company?: string;
  description?: string;
  img?: string;
  widgetIcon?: string;
  s3ImagePath?: string;
}

export class Color {
  headerBackgroundColor?: string;
  headerTextColor?: string;
  chatBackgroundColor?: string;
  chatTextColor?: string;
}

export class Widget {
  show?: boolean;
  delayTime?: number;
}

export class PopupMessage2 {
  show?: boolean;
  delayTime?: number;
}

export class Settings {
  widgetSound?: boolean;
  showPoweredByInsentText?: boolean;
  bot?: Bot;
  color?: Color;
  widget?: Widget;
  popupMessage?: PopupMessage2;
}

export class ExternalTriggers {
  forms?: any[];
  elements?: any[];
}

export class Session {
  id?: string;
  updateInterval?: number;
}

export class User {
  id?: string;
}

export class BotSettings {
  channelId?: string;
  popupMessage?: PopupMessage;
  settings?: Settings;
  externalTriggers?: ExternalTriggers;
  initiateSocketConnection?: boolean;
  session?: Session;
  subscriptionChannel?: string;
  user?: User;
  messageTimestamp?: number;
}

export class SendMessageEventMessage {
  text?: string;
}

export class SendMessageEventDisplay {
  image?: string;
  lead?: string;
  name?: string;
  text?: string;
  type?: string;
  time?: number;
}

export class SendMessageEventData {
  channelName?: string;
  senderId?: string;
  message?: SendMessageEventMessage;
}

export class WebscketMessageEvent {
  channel?: string;
  data?: SendMessageEventData;
  event?: string;
}

export class Member {
  name?: string;
  title?: string;
}
