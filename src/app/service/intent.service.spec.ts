import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { BotSettings } from '../models/model';
import { IntentService } from './intent.service';

describe('IntentService', () => {
  let service: IntentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [IntentService],
    });
    service = TestBed.inject(IntentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    const service: IntentService = TestBed.inject(IntentService);
    expect(service).toBeTruthy();
  });

  it('should be able to retrieve bot settings from the API via GET', fakeAsync(async () => {
    console.log(service.getBotSettings);
    const dummySettings: BotSettings = {
      channelId: 'temp-channel',
      externalTriggers: {},
      initiateSocketConnection: false,
      popupMessage: {
        info: false,
        message: '',
      },
      user: {
        id: 'temp-user',
      },
    };

    spyOn(service, 'getBotSettings').and.returnValue(
      Promise.resolve(dummySettings)
    );
    const result = await service.getBotSettings();

    expect(service.getBotSettings).toHaveBeenCalled();
    tick();
    expect(result?.channelId).toBe('temp-channel');
    expect(result?.user?.id).toBe('temp-user');
    expect(result).toEqual(dummySettings);
  }));

  it('should be able to retrieve channel info from the API via GET', fakeAsync(async () => {
    const dummyChannelInfo = {};

    spyOn(service, 'getChannelInfo').and.returnValue(
      Promise.resolve(dummyChannelInfo)
    );
    const result = await service.getChannelInfo('temp-channel');

    expect(service.getChannelInfo).toHaveBeenCalled();
    expect(service.getChannelInfo).toHaveBeenCalledWith('temp-channel');
    tick();
    expect(result).toEqual(dummyChannelInfo);
  }));

  it('should be able to retrieve channel auth info from the API via GET', fakeAsync(async () => {
    const dummyAuthInfo = {
      auth: 'temp-auth',
      channel_data: 'temp-channel-data',
    };

    spyOn(service, 'getChannelAuth').and.returnValue(
      Promise.resolve(dummyAuthInfo)
    );
    const result = await service.getChannelAuth(
      'temp-user',
      'temp-channel',
      'temp-socket'
    );

    expect(service.getChannelAuth).toHaveBeenCalled();
    expect(service.getChannelAuth).toHaveBeenCalledWith(
      'temp-user',
      'temp-channel',
      'temp-socket'
    );
    tick();
    expect(result).toEqual(dummyAuthInfo);
  }));
});
