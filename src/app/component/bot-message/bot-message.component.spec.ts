import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntentService } from '../../service/intent.service';
import { BotMessageComponent } from './bot-message.component';

describe('BotMessageComponent', () => {
  let component: BotMessageComponent;
  let fixture: ComponentFixture<BotMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BotMessageComponent],
      imports: [HttpClientTestingModule],
      providers: [IntentService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BotMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
