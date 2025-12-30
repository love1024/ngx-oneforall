import { Component, signal } from '@angular/core';
import { throttle } from 'ngx-oneforall/decorators/throttle';
// Create array of fruit names
const fruits = ['Apple', 'Banana', 'Orange', 'Grapes', 'Mango'];

@Component({
  selector: 'lib-throttle-demo',
  imports: [],
  template: `
    <h2>Throttle Demo</h2>
    <p>
      Click the button to add a random fruit to the list. The button is
      throttled to allow only one click every 5 seconds.
    </p>
    <p>Wait Seconds: {{ pendingSeconds() }}</p>
    <button [disabled]="pendingSeconds() > 0" (click)="addFruit()">
      Add Fruit
    </button>
    <ul>
      @for (fruit of selectedFruits(); track fruit) {
        <li>{{ fruit }}</li>
      }
    </ul>
  `,
  styleUrls: ['./throttle-demo.component.scss'],
})
export class ThrottleDemoComponent {
  // Create a signal to hold the pending seconds
  pendingSeconds = signal(0);

  // Create a signal to hold the selected fruits
  selectedFruits = signal<string[]>([]);

  @throttle(5000)
  addFruit() {
    this.selectedFruits.update(selectedFruits => {
      const randomIndex = Math.floor(Math.random() * fruits.length);
      const randomFruit = fruits[randomIndex];
      return [...selectedFruits, randomFruit];
    });

    this.startTimer();
  }

  /**
   * A helper function to start a timer that counts down from 5 seconds.
   */
  private startTimer() {
    this.pendingSeconds.set(5);
    const id = setInterval(() => {
      this.pendingSeconds.update(seconds => {
        if (seconds > 1) {
          return seconds - 1;
        }
        clearInterval(id);
        return 0;
      });
    }, 1000);
  }
}
