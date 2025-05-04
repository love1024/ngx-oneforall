import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { base64UrlEncode, base64UrlDecode } from '@ngx-oneforall/utils';

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
  styles: `
    h2 {
      font-size: 24px;
      margin-bottom: 10px;
    }
    h3 {
      font-size: 20px;
      margin-top: 20px;
      margin-bottom: 10px;
    }
    input {
      width: 300px;
      padding: 5px;
      margin-right: 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    button {
      padding: 5px 10px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    button:hover {
      background-color: #0056b3;
    }
  `,
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
