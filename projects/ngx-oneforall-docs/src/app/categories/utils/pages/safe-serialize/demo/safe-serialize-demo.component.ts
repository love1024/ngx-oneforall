import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { safeSerialize } from '@ngx-oneforall/utils';

@Component({
  selector: 'lib-safe-serialize-demo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="demo">
      <h3>Example cases</h3>
      <div class="examples-row">
        <div class="example" *ngFor="let ex of examples; let i = index">
          <div class="example-header">
            <h4>{{ ex.title }}</h4>
          </div>
          <div class="example-body">
            <div class="label">Value</div>
            <pre class="output">{{ ex.label }}</pre>
            <div class="label">Serialized</div>
            <pre class="output">{{ getOutput(i) }}</pre>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./safe-serialize-demo.component.scss'],
})
export class SafeSerializeDemoComponent {
  // predefined example cases (include functions, symbols, bigint and circular refs)
  examples = [
    {
      title: 'Simple array',
      value: [1, 'a', { fn: null }],
      label: '[1, "a", { fn: null }]',
    },
    {
      title: 'Function, Symbol & BigInt',
      value: [() => 'hi', Symbol('s'), BigInt(123)],
      label: '[() => "hi", Symbol("s"), BigInt(123)]',
    },
    {
      title: 'Nested circular object',
      value: (() => {
        const a: { name: string; other?: unknown } = { name: 'a' };
        const b: { name: string; child: { name: string; other?: unknown } } = {
          name: 'b',
          child: a,
        };
        (a as { other?: unknown }).other = b;
        return a;
      })(),
      label:
        '(() => { const a = { name: "a" }; const b = { name: "b", child: a }; a.other = b; return a; })()',
    },
    {
      title: 'Complex object (Map/Set)',
      value: {
        n: 42,
        arr: [1, 2, 3],
        map: new Map([['k', 'v']]),
        set: new Set([1, 2, 3]),
      },
      label:
        '{ n: 42, arr: [1, 2, 3], map: new Map([["k", "v"]]), set: new Set([1, 2, 3]) }',
    },
  ] as { title: string; value: unknown; label: string }[];

  outputs = signal<Record<number, string>>({});

  constructor() {
    const map: Record<number, string> = {};
    for (let i = 0; i < this.examples.length; i++) {
      try {
        map[i] = safeSerialize(this.examples[i].value);
      } catch (err) {
        map[i] = `Error: ${String(err)}`;
      }
    }
    this.outputs.set(map);
  }

  getOutput(i: number) {
    return this.outputs()[i] || '(error serializing)';
  }
}
