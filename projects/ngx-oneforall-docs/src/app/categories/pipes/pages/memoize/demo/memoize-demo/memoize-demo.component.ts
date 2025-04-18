import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MemoizePipe } from 'ngx-oneforall';

@Component({
  selector: 'lib-memoize-demo',
  imports: [MemoizePipe, FormsModule],
  template: `
    <h2>Memoize Pipe Demo</h2>
    <p>
      The memoize pipe caches the result of a function call and returns the
      cached result when the same input is provided again.
    </p>

    <label>
      <span>Type anything to trigger change detection</span>
      <br />
      <input type="text" [(ngModel)]="inputValue" />
    </label>

    <hr />

    <h3>Without Pipe</h3>
    <p>
      <strong>testFunction:</strong>
      {{ testFunction('default') }}
    </p>

    <hr />

    <h3>With Memoize Pipe</h3>
    <p>
      <strong>testFunction:</strong>
      {{ testFunction | memoize: this : 'memoize' }}
    </p>
  `,
  styleUrls: ['./memoize-demo.component.scss'],
})
export class MemoizeDemoComponent {
  inputValue = 'Hello World';

  fnCalledCount = {
    default: 0,
    memoize: 0,
  };

  /**
   * A function that returns a string indicating how many times it has been called.
   * The function is memoized using the memoize pipe.
   *
   * @param type - The type of function call ('memoize' or 'default').
   * @returns A string indicating how many times the function has been called.
   */
  testFunction(type: 'memoize' | 'default'): string {
    this.fnCalledCount[type]++;
    const count = this.fnCalledCount[type];
    return `I am called ${count} times`;
  }
}
