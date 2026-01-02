import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { LanguageSwitcherComponent } from './shared/components/language-switcher/language-switcher.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TranslocoModule, LanguageSwitcherComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App { }
