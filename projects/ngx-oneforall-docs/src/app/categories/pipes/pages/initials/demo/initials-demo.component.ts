import { Component } from '@angular/core';
import { InitialsPipe } from 'ngx-oneforall/pipes/initials';

@Component({
  selector: 'lib-initials-demo',
  standalone: true,
  imports: [InitialsPipe],
  template: `
    <div class="demo-container">
      <h2>Initials Pipe Demo</h2>

      <div class="demo-section">
        <h3>Full Name (Default: 2)</h3>
        <code>'John Doe' | initials</code>
        <div class="result">
          <div class="avatar">{{ 'John Doe' | initials }}</div>
          <span>Output: {{ 'John Doe' | initials }}</span>
        </div>
      </div>

      <div class="demo-section">
        <h3>Single Name</h3>
        <code>'John' | initials</code>
        <div class="result">
          <div class="avatar">{{ 'John' | initials }}</div>
          <span>Output: {{ 'John' | initials }}</span>
        </div>
      </div>

      <div class="demo-section">
        <h3>Three Names (Limit 3)</h3>
        <code>'John Middle Doe' | initials:3</code>
        <div class="result">
          <div class="avatar">{{ 'John Middle Doe' | initials: 3 }}</div>
          <span>Output: {{ 'John Middle Doe' | initials: 3 }}</span>
        </div>
      </div>

      <div class="demo-section">
        <h3>LowerCase Input</h3>
        <code>'jane doe' | initials</code>
        <div class="result">
          <div class="avatar">{{ 'jane doe' | initials }}</div>
          <span>Output: {{ 'jane doe' | initials }}</span>
        </div>
      </div>
    </div>
  `,
  styleUrl: './initials-demo.component.scss',
})
export class InitialsDemoComponent {}
