import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { APP_ICONS } from './icons';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  readonly icons = APP_ICONS;
}
