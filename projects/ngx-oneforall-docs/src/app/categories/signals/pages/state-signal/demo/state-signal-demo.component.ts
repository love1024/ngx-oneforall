import { Component, effect } from '@angular/core';
import { stateSignal } from 'ngx-oneforall/signals/state-signal';
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
  styleUrl: './state-signal-demo.component.scss',
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
    const currentName = this.state.profile.name();
    this.state.profile.name.set(
      currentName === 'John Doe' ? 'Jane Smith' : 'John Doe'
    );
  }

  incrementAge() {
    this.state.profile.age.update(age => age + 1);
  }

  updateCity() {
    const currentCity = this.state.profile.address.city();
    this.state.profile.address.city.set(
      currentCity === 'New York' ? 'Los Angeles' : 'New York'
    );
  }

  resetState() {
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
