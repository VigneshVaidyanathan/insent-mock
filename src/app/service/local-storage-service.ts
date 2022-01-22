import { Injectable } from '@angular/core';

import { UserStorageInformation } from '../models/app.model';

const LOCAL_STORAGE = 'insent_storage';

@Injectable()
export class LocalStorageService {
  constructor() {}

  clearAllLocalStorageItems() {
    window.localStorage.clear();
  }

  setLoggedInUserInfo(userInfo: UserStorageInformation) {
    this.setLocalStorageItem(LOCAL_STORAGE, userInfo);
  }

  getLoggedInUserInfo(): UserStorageInformation {
    const userInfo: UserStorageInformation =
      this.getLocalStorageItem(LOCAL_STORAGE);
    return userInfo;
  }

  private getLocalStorageItem(itemName: string) {
    if (
      window.localStorage.getItem(itemName) !== null &&
      window.localStorage.getItem(itemName) !== undefined &&
      window.localStorage.getItem(itemName) !== ''
    ) {
      return window.localStorage.getItem(itemName)
        ? JSON.parse(window.localStorage.getItem(itemName) ?? '{}')
        : null;
    }
  }

  private setLocalStorageItem(itemName: string, item: any) {
    window.localStorage.setItem(itemName, JSON.stringify(item));
  }
}
