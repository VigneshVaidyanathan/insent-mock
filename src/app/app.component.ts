import { Component } from '@angular/core';
import { BotSettings } from 'src/app/models/model';
import { IntentService } from 'src/app/service/intent.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'Insent Mock';
  settings!: BotSettings | null;
  showBot = false;
  isLoading = true;

  constructor(
    private intentService: IntentService
  ) {}

  async ngOnInit() {
    this.isLoading = true;
    this.settings = await this.intentService.getBotSettings();
    if (this.settings) {

      setTimeout(() => {
        this.showBot = true;
        this.isLoading = false;
        console.log(this.settings);
      }, 1000);
    }
  }
}
