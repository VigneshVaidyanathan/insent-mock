import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { BotComponent } from 'src/app/component/bot/bot.component';

import { AppComponent } from './app.component';
import { BotChatComponent } from './component/bot-chat/bot-chat.component';
import { BotMessageComponent } from './component/bot-message/bot-message.component';
import { ApiInterceptor } from './guard/api.interceptor';
import { IntentService } from './service/intent.service';
import { LocalStorageService } from './service/local-storage-service';

@NgModule({
  declarations: [
    AppComponent,
    BotComponent,
    BotChatComponent,
    BotMessageComponent,
  ],
  imports: [
  BrowserModule,
    RouterModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [
    LocalStorageService,
    IntentService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
