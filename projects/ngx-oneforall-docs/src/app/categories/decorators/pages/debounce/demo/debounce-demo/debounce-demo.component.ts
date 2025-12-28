import { Component, signal } from '@angular/core';
import { debounce } from '@ngx-oneforall/decorators/debounce';

@Component({
  selector: 'lib-debounce-demo',
  imports: [],
  template: `
    <!-- Demo that take user input and only add to the list after a debounce of 3 seconds  -->
    <h2>Debounce Demo</h2>
    <p>
      Type a fruit name and wait for 3 seconds to add it to the list. The
      function is debounced until there is a pause of 3 seconds in typing.
    </p>
    <p>Remaining Seconds: {{ pendingSeconds() }}</p>
    <input
      type="text"
      placeholder="Type a fruit name"
      (input)="fruitEntered($event); resetTimer()" />
    <ul>
      @for (fruit of selectedFruits(); track fruit) {
        <li>{{ fruit }}</li>
      }
    </ul>
  `,
  styleUrl: './debounce-demo.component.scss',
})
export class DebounceDemoComponent {
  // Create a signal to hold the pending seconds
  pendingSeconds = signal(0);

  // Create a signal to hold the selected fruits
  selectedFruits = signal<string[]>([]);

  // Create a signal to hold the timer ID
  private timerId: NodeJS.Timeout | null = null;

  @debounce(3000)
  fruitEntered(evt: Event) {
    const fruit = (evt.target as HTMLInputElement).value;
    if (!fruit) {
      return;
    }

    this.selectedFruits.update(selectedFruits => {
      return [...selectedFruits, fruit];
    });
    (evt.target as HTMLInputElement).value = '';
  }

  resetTimer() {
    this.pendingSeconds.set(3);
    clearInterval(this.timerId as NodeJS.Timeout);

    this.timerId = setInterval(() => {
      this.pendingSeconds.update(seconds => {
        if (seconds > 1) {
          return seconds - 1;
        }
        clearInterval(this.timerId as NodeJS.Timeout);
        return 0;
      });
    }, 1000);
  }
}
