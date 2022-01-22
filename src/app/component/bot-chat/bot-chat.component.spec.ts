import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntentService } from '../../service/intent.service';
import { BotChatComponent } from './bot-chat.component';

describe('BotChatComponent', () => {
  let component: BotChatComponent;
  let fixture: ComponentFixture<BotChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BotChatComponent],
      imports: [HttpClientTestingModule],
      providers: [IntentService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BotChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
