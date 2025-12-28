import { Component } from '@angular/core';
import { SafeHtmlPipe } from '@ngx-oneforall/pipes/safe-html';
@Component({
  selector: 'lib-safe-html-pipe-demo',
  imports: [SafeHtmlPipe],
  template: `
    <div class="demo-container">
      <h2>Safe HTML Pipe Demo</h2>
      <p>
        This demo showcases the use of the <strong>SafeHtmlPipe</strong> to
        safely bind HTML content.
      </p>
      <h3>Unsafe HTML:</h3>
      <pre>{{ unsafeHtml }}</pre>
      <h3>Rendered Safe HTML:</h3>
      <div class="safe-html-output" [innerHTML]="unsafeHtml | safeHtml"></div>
    </div>
  `,
  styleUrls: ['./safe-html-pipe-demo.component.scss'],
})
export class SafeHtmlPipeDemoComponent {
  unsafeHtml = `<div style="color: red;"><h1>Safe HTML Example</h1><p>This is a <strong>test</strong> paragraph with <em>inline styles</em>.</p></div>`;
}
