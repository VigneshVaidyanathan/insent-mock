import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntentService } from '../../service/intent.service';
import { BotComponent } from './bot.component';

describe('BotComponent', () => {
  let component: BotComponent;
  let fixture: ComponentFixture<BotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BotComponent],
      imports: [HttpClientTestingModule],
      providers: [IntentService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
