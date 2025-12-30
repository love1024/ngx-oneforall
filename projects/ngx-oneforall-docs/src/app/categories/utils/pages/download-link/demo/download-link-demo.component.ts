import { Component } from '@angular/core';
import { downloadLink } from 'ngx-oneforall/utils/download-link';

@Component({
  selector: 'app-download-link-demo',
  standalone: true,
  template: `
    <div class="demo-container">
      <h3>Download Demo</h3>
      <p>
        Click the button below to download a dynamically generated text file.
      </p>
      <button (click)="downloadTextFile()">Download "hello.txt"</button>
      <button (click)="downloadImage()">Download Placeholder Image</button>
    </div>
  `,
  styleUrl: './download-link-demo.component.scss',
})
export class DownloadLinkDemoComponent {
  downloadTextFile() {
    const text =
      'Hello, this is a sample text file downloaded using downloadLink utility!';
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    downloadLink(url, 'hello.txt');

    // Cleanup
    setTimeout(() => URL.revokeObjectURL(url), 100);
  }

  downloadImage() {
    const imageUrl = 'https://via.placeholder.com/150';
    // Note: Cross-origin images might not download with the correct name if not on same origin
    // or if headers are restrictive, but it shows the usage.
    downloadLink(imageUrl, 'placeholder.png');
  }
}
