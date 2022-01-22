import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BotSettings } from '../models/model';
import { environment } from './../../environments/environment';

export const GET_USER_URL: string = `getuser?url=insent-recruitment.web.app%2Fqualify-engage`;
export const GET_CHANNEL_INFO = `user/channels/`;
export const POST_CHANNEL_AUTH = `pusher/presence/auth/visitor?userid=`;

@Injectable({
  providedIn: 'root',
})
export class IntentService {
  constructor(private http: HttpClient) {}

  /**
   * Gets the user id and other settings related to the Insent Bot. This is the
   * base information to display the initial popup message and other things related to
   * the bot.
   * @returns
   */
  async getBotSettings(): Promise<BotSettings | null> {
    try {
      const userResult: any = await this.http
        .get(`${environment.insent.baseApi}${GET_USER_URL}`)
        .toPromise();
      return userResult as BotSettings;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  /**
   * This function gets the information related to the channel, that gives back information
   * related to the channel.
   * @param channelId The private channel id that needs to ne connected for the user's session.
   * @returns
   */
  async getChannelInfo(channelId: string) {
    const url = `${environment.insent.baseApi}${GET_CHANNEL_INFO}${channelId}`;
    try {
      const result = await this.http.get(url).toPromise();
      return result;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  /**
   * This function is used to authenticate the user, channel that needs to connect and the socket
   * connection to use for it. This is essential as this verifies that the websocket request sent
   * is valid and verified by the websocket server. Any messages to the server will happen only after
   * verifying the channel using this function.
   * @param userId The user id of the visitor trying to authenticate to the websocket servers.
   * @param channelName The private channel that the user wants to connect.
   * @param socketId The websocker channel id that is created when the user wants to interact with
   * the channel. This will be received after a connection success is received when connecting to the
   * websocket server.
   * @returns
   */
  async getChannelAuth(userId: string, channelName: string, socketId: string) {
    const url = `${environment.insent.baseApi}${POST_CHANNEL_AUTH}${userId}`;
    try {
      const result = await this.http
        .post(url, {
          socket_id: socketId,
          channel_name: channelName,
        })
        .toPromise();
      return result;
    } catch (err) {
      console.log(err);
      return null;
    }
  }
}
