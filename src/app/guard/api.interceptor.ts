import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { UserStorageInformation } from '../models/app.model';
import { LocalStorageService } from '../service/local-storage-service';
import { environment } from './../../environments/environment';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  isErrorDisplayed = false;

  constructor(private localStorageService: LocalStorageService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const userInfo: UserStorageInformation =
      this.localStorageService.getLoggedInUserInfo();
    if (userInfo !== undefined && userInfo.userId) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${environment.insent.botId}`,
          userid: userInfo.userId,
          'Access-Control-Allow-Origin': '*',
        },
      });
    } else {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${environment.insent.botId}`,
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    return next.handle(request);
  }
}
