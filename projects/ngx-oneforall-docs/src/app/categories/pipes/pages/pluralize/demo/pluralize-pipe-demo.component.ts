import { Component } from '@angular/core';
import { PluralizePipe } from '@ngx-oneforall/pipes';

@Component({
    selector: 'app-pluralize-pipe-demo',
    standalone: true,
    imports: [PluralizePipe],
    template: `
    <div class="demo-container">
      <h3>Basic Usage</h3>
      <p>1 apple: <strong>{{ 1 | pluralize: 'apple' }}</strong></p>
      <p>2 apples: <strong>{{ 2 | pluralize: 'apple' }}</strong></p>
      <p>0 apples: <strong>{{ 0 | pluralize: 'apple' }}</strong></p>

      <h3>Custom Plural Form</h3>
      <p>1 person: <strong>{{ 1 | pluralize: 'person':'people' }}</strong></p>
      <p>2 people: <strong>{{ 2 | pluralize: 'person':'people' }}</strong></p>

      <h3>Auto-Pluralization (ES/IES)</h3>
      <p>1 box: <strong>{{ 1 | pluralize: 'box' }}</strong></p>
      <p>2 boxes: <strong>{{ 2 | pluralize: 'box' }}</strong></p>
      <p>1 city: <strong>{{ 1 | pluralize: 'city' }}</strong></p>
      <p>2 cities: <strong>{{ 2 | pluralize: 'city' }}</strong></p>

      <h3>Without Number</h3>
      <p>2 apples (no number): <strong>{{ 2 | pluralize: 'apple':undefined:false }}</strong></p>
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
export class PluralizePipeDemoComponent { }
