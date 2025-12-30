import { Component } from '@angular/core';
import { CallPipe } from 'ngx-oneforall/pipes/call';

@Component({
  selector: 'app-call-pipe-demo',
  imports: [CallPipe],
  template: `
    <div class="demo-container">
      <h3>Basic Usage</h3>
      <p>
        Sum (1 + 2): <strong>{{ sum | call: 1 : 2 }}</strong>
      </p>

      <h3>Arrow Function (Context Preserved)</h3>
      <p>
        Greeting: <strong>{{ getGreeting | call: 'World' }}</strong>
      </p>

      <h3>Accessing Component State</h3>
      <p>
        Counter Value: <strong>{{ getCounter | call }}</strong>
      </p>
    </div>
  `,
  styleUrl: './call-pipe-demo.component.scss',
})
export class CallPipeDemoComponent {
  counter = 42;

  sum(a: number, b: number): number {
    return a + b;
  }

  getGreeting = (name: string) => {
    return `Hello, ${name}!`;
  };

  getCounter = () => {
    return this.counter;
  };
}
