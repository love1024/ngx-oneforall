import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { base64UrlEncode, base64UrlDecode } from '@ngx-oneforall/utils/base64';

@Component({
  selector: 'lib-base64-url-demo',
  imports: [FormsModule],
  template: `
    <h2>Base64 URL Demo</h2>
    <h3>Base64 URL Encode</h3>
    <input
      type="text"
      [(ngModel)]="inputString"
      placeholder="Enter string to encode" />
    <button (click)="encode()">Encode</button>
    <p>Encoded String: {{ encodedString }}</p>
    <h3>Base64 URL Decode</h3>
    <input
      type="text"
      [(ngModel)]="encodedString"
      placeholder="Enter string to decode" />
    <button (click)="decode()">Decode</button>
    <p>Decoded String: {{ decodedString }}</p>
  `,
  styleUrl: './base64-url-demo.component.scss',
})
export class Base64UrlDemoComponent {
  inputString = '';
  encodedString = '';
  decodedString = '';

  encode() {
    this.encodedString = base64UrlEncode(this.inputString);
  }

  decode() {
    this.decodedString = base64UrlDecode(this.encodedString);
  }
}
