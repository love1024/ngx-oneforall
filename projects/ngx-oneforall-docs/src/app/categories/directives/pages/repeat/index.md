The `RepeatDirective` is a structural directive for Angular that allows you to dynamically repeat a template a specified number of times. This directive is useful when you need to render a block of HTML multiple times based on a numeric value, similar to the `ngFor` directive but with a focus on repeating a template a fixed number of times rather than iterating over a collection.

### Selector

```typescript
[repeat]
```

You can use the directive by adding the `repeat` attribute to an element in your template.

### Context Variables

When using the `RepeatDirective`, the following context variables are available within each repeated template:

- **$implicit**: The current index (number) of the iteration.
- **index**: Alias for `$implicit`, the current index.
- **first**: Boolean, `true` if this is the first iteration.
- **last**: Boolean, `true` if this is the last iteration.

### Example Usage

```html
<div *repeat="5; let i = $implicit; let isFirst = first; let isLast = last">
    <p>
        Index: {{ i }},
        First: {{ isFirst }},
        Last: {{ isLast }}
    </p>
</div>
```

This will render the `<div>` block five times, providing the current index, and flags for the first and last iterations.

### Live Demonstration

See the directive in action with the following live demonstration:

{{ NgDocActions.demoPane("RepeatDemoComponent") }}


