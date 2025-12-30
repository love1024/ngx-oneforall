import { Component, inject } from '@angular/core';
import { ChildrenOutletContexts, RouterOutlet } from '@angular/router';
import {
  NgDocNavbarComponent,
  NgDocRootComponent,
  NgDocSidebarComponent,
} from '@ng-doc/app';
import { routingAnimation } from './animations/routing.animation';
import { NgDocThemeService } from '@ng-doc/app/services/theme';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-root',
  animations: [routingAnimation()],
  imports: [
    RouterOutlet,
    NgDocRootComponent,
    NgDocNavbarComponent,
    NgDocSidebarComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private contexts = inject(ChildrenOutletContexts);
  private readonly themeService = inject(NgDocThemeService);

  constructor() {
    this.themeService.set('auto');
  }

  get routingAnimations() {
    return this.contexts.getContext('primary')?.route?.snapshot?.title;
  }
}
