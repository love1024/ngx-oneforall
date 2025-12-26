import { Component, effect } from '@angular/core';
import { stateSignal } from '@ngx-oneforall/signals';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'state-signal-demo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="demo-container">
      <h3>State Signal Demo</h3>

      <div class="state-display">
        <h4>Current State:</h4>
        <pre>{{ state() | json }}</pre>
      </div>

      <div class="signals-display">
        <h4>Accessed via nested signals:</h4>
        <p><strong>Name:</strong> {{ state.profile.name() }}</p>
        <p><strong>Age:</strong> {{ state.profile.age() }}</p>
        <p><strong>City:</strong> {{ state.profile.address.city() }}</p>
      </div>

      <div class="controls">
        <h4>Update via nested .set():</h4>
        <button (click)="updateName()">Toggle Name</button>
        <button (click)="incrementAge()">Increment Age</button>
        <button (click)="updateCity()">Toggle City</button>
        <button (click)="resetState()">Reset All</button>
      </div>
    </div>
  `,
  styles: [
    `
      .demo-container {
        padding: 1rem;
        border: 1px solid #ddd;
        border-radius: 8px;
      }

      .state-display,
      .signals-display,
      .controls {
        margin: 1rem 0;
      }

      pre {
        background: #f5f5f5;
        padding: 1rem;
        border-radius: 4px;
        overflow-x: auto;
      }

      button {
        margin-right: 0.5rem;
        margin-bottom: 0.5rem;
        padding: 0.5rem 1rem;
        border: none;
        background: #28a745;
        color: white;
        border-radius: 4px;
        cursor: pointer;
      }

      button:hover {
        background: #218838;
      }

      button:last-child {
        background: #6c757d;
      }

      button:last-child:hover {
        background: #5a6268;
      }
    `,
  ],
})
export class StateSignalDemoComponent {
  state = stateSignal({
    profile: {
      name: 'John Doe',
      age: 30,
      address: {
        city: 'New York',
        country: 'USA',
      },
    },
  });

  constructor() {
    effect(() => {
      console.log(this.state.profile.address());
    });
  }

  updateName() {
    // Direct nested update using .set() - automatically bubbles to root
    const currentName = this.state.profile.name();
    this.state.profile.name.set(
      currentName === 'John Doe' ? 'Jane Smith' : 'John Doe'
    );
  }

  incrementAge() {
    // Using .update() for derived values
    this.state.profile.age.update(age => age + 1);
  }

  updateCity() {
    // Deep nested update
    const currentCity = this.state.profile.address.city();
    this.state.profile.address.city.set(
      currentCity === 'New York' ? 'Los Angeles' : 'New York'
    );
  }

  resetState() {
    // Can also replace entire state at root level
    this.state.set({
      profile: {
        name: 'John Doe',
        age: 30,
        address: {
          city: 'New York',
          country: 'USA',
        },
      },
    });
  }
}
