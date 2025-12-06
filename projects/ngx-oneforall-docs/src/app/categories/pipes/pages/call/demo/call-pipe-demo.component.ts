import { Component } from '@angular/core';
import { CallFunctionPipe } from '@ngx-oneforall/pipes';

@Component({
    selector: 'app-call-pipe-demo',
    standalone: true,
    imports: [CallFunctionPipe],
    template: `
    <div class="demo-container">
      <h3>Basic Usage</h3>
      <p>Sum (1 + 2): <strong>{{ sum | call: 1 : 2 }}</strong></p>
      
      <h3>With Context (Arrow Function)</h3>
      <p>Greeting: <strong>{{ getGreeting | call: 'World' }}</strong></p>

      <h3>With Context (Bound Method)</h3>
      <p>Counter Value: <strong>{{ getCounter | call }}</strong></p>
    </div>
  `,
    styles: [`
    .demo-container {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    h3 {
      margin-top: 1rem;
      margin-bottom: 0.5rem;
    }
  `]
})
export class CallPipeDemoComponent {
    counter = 42;

    sum(a: number, b: number): number {
        return a + b;
    }

    getGreeting = (name: string) => {
        return `Hello, ${name}!`;
    }

    getCounter = () => {
        return this.counter;
    }
}
