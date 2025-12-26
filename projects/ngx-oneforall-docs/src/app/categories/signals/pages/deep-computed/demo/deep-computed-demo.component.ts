import { Component, signal } from '@angular/core';
import { deepComputed } from '@ngx-oneforall/signals/deep-computed';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'deep-computed-demo',
  standalone: true,
  imports: [JsonPipe],
  template: `
    <div class="demo-container">
      <h3>Deep Computed Signal Demo</h3>

      <div class="state-display">
        <h4>Current State:</h4>
        <pre>{{ user() | json }}</pre>
      </div>

      <div class="signals-display">
        <h4>Accessed via deep.profile.name():</h4>
        <p><strong>Name:</strong> {{ deep.profile.name() }}</p>
        <h4>Accessed via deep.profile.age():</h4>
        <p><strong>Age:</strong> {{ deep.profile.age() }}</p>
        <h4>Accessed via deep.profile.address.city():</h4>
        <p><strong>City:</strong> {{ deep.profile.address.city() }}</p>
      </div>

      <h4>Update original state:</h4>
      <div class="controls">
        <button (click)="updateName()">Change Name</button>
        <button (click)="updateAge()">Increment Age</button>
        <button (click)="updateCity()">Change City</button>
      </div>
    </div>
  `,
  styleUrl: './deep-computed-demo.component.scss',
})
export class DeepComputedDemoComponent {
  user = signal({
    profile: {
      name: 'John Doe',
      age: 30,
      address: {
        city: 'New York',
        country: 'USA',
      },
    },
  });

  deep = deepComputed(() => this.user());

  updateName() {
    const current = this.user();
    this.user.set({
      ...current,
      profile: {
        ...current.profile,
        name: current.profile.name === 'John Doe' ? 'Jane Smith' : 'John Doe',
      },
    });
  }

  updateAge() {
    const current = this.user();
    this.user.set({
      ...current,
      profile: {
        ...current.profile,
        age: current.profile.age + 1,
      },
    });
  }

  updateCity() {
    const current = this.user();
    this.user.set({
      ...current,
      profile: {
        ...current.profile,
        address: {
          ...current.profile.address,
          city:
            current.profile.address.city === 'New York'
              ? 'Los Angeles'
              : 'New York',
        },
      },
    });
  }
}
