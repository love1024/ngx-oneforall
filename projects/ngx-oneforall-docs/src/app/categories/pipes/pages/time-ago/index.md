
The `TimeAgoPipe` is a custom Angular pipe that dynamically calculates and displays the time elapsed since a given date or timestamp. It is particularly useful for applications that require real-time updates, such as social media feeds, notifications, or activity logs.

---

## How It Works

The `TimeAgoPipe` calculates the difference between the current time and the provided timestamp. Based on the elapsed time, it determines the appropriate unit (e.g., seconds, minutes, hours, days) and returns a human-readable string.

For example:
- A timestamp 10 seconds ago will display: `10 seconds ago`.
- A timestamp 3 days ago will display: `3 days ago`.

If the `live` parameter is set to `true` (default), the pipe will automatically update the displayed value as time progresses.

---

## Usage

### Basic Usage

To use the `TimeAgoPipe`, simply pass a `Date` object or an ISO date string to the pipe in your template:

```html file="./snippets.html"#L1-L1
```

### Example
```ts file="./demo/time-ago-demo/time-ago-demo.component.ts"#L4-L12
```

#### Live Demonstration

{{ NgDocActions.demo("TimeAgoDemoComponent") }}

## Advanced Usage
### Live updates
By default, the pipe updates dynamically. You can disable live updates by passing false as the second argument:

```html file="./snippets.html"#L3-L3
```

### Custom Labels
You can provide custom labels for the pipe by using the `provideTimeAgoPipeLabels` provider which returns new labels. For example:

```ts
import { provideTimeAgoPipeLabels, TimeAgoLabels } from './time-ago.providers';
@Component({
  ...
  providers: [
     provideTimeAgoPipeLabels(() => {
      return {
        prefix: '',
        suffix: 'ago',
        second: 'sec',
        seconds: 'secs',
        minute: 'min',
        minutes: 'mins',
        hour: 'hr',
        hours: 'hrs',
        day: 'day',
        days: 'days',
        week: 'wk',
        weeks: 'wks',
        month: 'mo',
        months: 'mos',
        year: 'yr',
        years: 'yrs',
      } as TimeAgoLabels;
    }),
  ],
})
export class PostComponent {}
```

#### Live Demonstration

{{ NgDocActions.demo("TimeAgoCustomClockDemoComponent") }}

### Custom Clock
You can provide a custom clock implementation by using the `provideTimeAgoPipeClock` provider. This is useful for scenarios where the clock needs to be controlled. The custom implementation should return an observable and the pipe will update whenever that observable will emit a value. 

```ts
import { provideTimeAgoPipeClock } from '@ngx-oneforall/pipes';
import { timer } from 'rxjs';

@Component({
  ...
  providers: [
    provideTimeAgoPipeClock(() => {
      return timer(5000);
    }),
  ],
})
export class PostComponent {}

```

#### Live Demonstration

{{ NgDocActions.demo("TimeAgoCustomLabelsDemoComponent") }}
