import { Component, signal } from '@angular/core';
import { fileToBase64 } from 'ngx-oneforall/utils/base64';

@Component({
  selector: 'lib-file-to-base64-demo',
  imports: [],
  template: `
    <h2>File to Base64 Demo</h2>
    <input type="file" (change)="onFileSelected($event)" />
    @if (base64String()) {
      <h3>Base64 Image</h3>
      <img [src]="base64String()" height="200" width="200" alt="Base64 Image" />
    }
  `,
  styleUrls: ['./file-to-base64-demo.component.scss'],
})
export class FileToBase64DemoComponent {
  base64String = signal('');

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      fileToBase64(file).then(base64 => {
        this.base64String.set(base64);
      });
    }
  }
}
