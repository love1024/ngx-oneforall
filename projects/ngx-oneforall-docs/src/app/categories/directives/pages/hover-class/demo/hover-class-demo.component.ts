import { Component } from '@angular/core';
import { HoverClassDirective } from 'ngx-oneforall/directives/hover-class';

@Component({
  selector: 'lib-hover-class-demo',
  standalone: true,
  imports: [HoverClassDirective],
  template: `
    <h2>Hover class directive demo</h2>

    <div hoverClass="change-color change-background" class="hover-demo-box">
      Hover to apply styles using directive
    </div>
  `,
  styleUrl: 'hover-class-demo.component.scss',
})
export class HoverClassDemoComponent {}
