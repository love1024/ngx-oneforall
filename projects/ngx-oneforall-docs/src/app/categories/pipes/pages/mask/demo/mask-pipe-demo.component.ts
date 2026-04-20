import { Component } from '@angular/core';
import { MaskPipe } from 'ngx-oneforall/pipes/mask';

@Component({
  selector: 'app-mask-pipe-demo',
  imports: [MaskPipe],
  template: `
    <div class="demo-section">
      <h4>Common Formats</h4>
      <div class="result-row">
        <span class="label">Phone</span>
        <span class="mask-format">(###) ###-####</span>
        <span class="raw">1234567890</span>
        <span class="arrow">→</span>
        <span class="output">{{ '1234567890' | mask: '(###) ###-####' }}</span>
      </div>
      <div class="result-row">
        <span class="label">Date</span>
        <span class="mask-format">##/##/####</span>
        <span class="raw">25122024</span>
        <span class="arrow">→</span>
        <span class="output">{{ '25122024' | mask: '##/##/####' }}</span>
      </div>
      <div class="result-row">
        <span class="label">SSN</span>
        <span class="mask-format">###-##-####</span>
        <span class="raw">123456789</span>
        <span class="arrow">→</span>
        <span class="output">{{ '123456789' | mask: '###-##-####' }}</span>
      </div>
      <div class="result-row">
        <span class="label">Credit Card</span>
        <span class="mask-format">#### #### #### ####</span>
        <span class="raw">4111111111111111</span>
        <span class="arrow">→</span>
        <span class="output">{{
          '4111111111111111' | mask: '#### #### #### ####'
        }}</span>
      </div>
      <div class="result-row">
        <span class="label">Time</span>
        <span class="mask-format">##:##</span>
        <span class="raw">1430</span>
        <span class="arrow">→</span>
        <span class="output">{{ '1430' | mask: '##:##' }}</span>
      </div>
    </div>

    <div class="demo-section">
      <h4>Prefix &amp; Suffix</h4>
      <div class="result-row">
        <span class="label">Country code</span>
        <span class="mask-format">(###) ###-#### + prefix: '+1 '</span>
        <span class="raw">1234567890</span>
        <span class="arrow">→</span>
        <span class="output">{{
          '1234567890' | mask: '(###) ###-####' : { prefix: '+1 ' }
        }}</span>
      </div>
      <div class="result-row">
        <span class="label">Percentage</span>
        <span class="mask-format">## + suffix: '%'</span>
        <span class="raw">85</span>
        <span class="arrow">→</span>
        <span class="output">{{ '85' | mask: '##' : { suffix: '%' } }}</span>
      </div>
      <div class="result-row">
        <span class="label">Currency</span>
        <span class="mask-format">#### + prefix: '$' suffix: '.00'</span>
        <span class="raw">1000</span>
        <span class="arrow">→</span>
        <span class="output">{{
          '1000' | mask: '####' : { prefix: '$', suffix: '.00' }
        }}</span>
      </div>
    </div>

    <div class="demo-section">
      <h4>Alpha Patterns</h4>
      <div class="result-row">
        <span class="label">Uppercase (U)</span>
        <span class="mask-format">UU-UU</span>
        <span class="raw">ABCD</span>
        <span class="arrow">→</span>
        <span class="output">{{ 'ABCD' | mask: 'UU-UU' }}</span>
      </div>
      <div class="result-row">
        <span class="label">Alphanumeric (A)</span>
        <span class="mask-format">AA-AA-AA</span>
        <span class="raw">A1B2C3</span>
        <span class="arrow">→</span>
        <span class="output">{{ 'A1B2C3' | mask: 'AA-AA-AA' }}</span>
      </div>
      <div class="result-row">
        <span class="label">Postal code (@#)</span>
        <span class="mask-format">@#@ #@#</span>
        <span class="raw">K1A0B1</span>
        <span class="arrow">→</span>
        <span class="output">{{ 'K1A0B1' | mask: '@#@ #@#' }}</span>
      </div>
    </div>

    <div class="demo-section">
      <h4>Number Coercion</h4>
      <div class="result-row">
        <span class="label">Number input</span>
        <span class="mask-format">(###) ###-####</span>
        <span class="raw">1234567890</span>
        <span class="arrow">→</span>
        <span class="output">{{ 1234567890 | mask: '(###) ###-####' }}</span>
      </div>
    </div>
  `,
  styleUrl: './mask-pipe-demo.component.scss',
})
export class MaskPipeDemoComponent {}
