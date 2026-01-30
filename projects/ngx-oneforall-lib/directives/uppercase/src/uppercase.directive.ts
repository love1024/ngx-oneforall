import {
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  input,
  OnInit,
  effect,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgControl } from '@angular/forms';
import { distinctUntilChanged } from 'rxjs';

@Directive({
  selector: '[uppercase]',
  host: {
    '(input)': 'onInput($event)',
    '(blur)': 'onInput($event)',
  },
})
export class UppercaseDirective implements OnInit {
  /**
   * Whether to update the actual output value (model/control).
   * If false, only the visual style `text-transform: uppercase` is applied.
   * Default: true
   */
  updateOutput = input(true);

  private readonly elementRef = inject(ElementRef);
  private readonly ngControl = inject(NgControl, { optional: true });
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    effect(() => {
      const update = this.updateOutput();
      const el = this.elementRef.nativeElement as HTMLElement;
      if (!update) {
        el.style.textTransform = 'uppercase';
      } else {
        el.style.textTransform = '';
      }
    });
  }

  ngOnInit(): void {
    // If we have an ngControl, we need to listen for value changes to handle initial values or programmatic updates
    this.ngControl?.valueChanges
      ?.pipe(distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((value: string) => {
        if (this.updateOutput()) {
          this.transform(value);
        }
      });
  }

  onInput(event: Event): void {
    if (!this.updateOutput()) {
      return;
    }
    const input = event.target as HTMLInputElement;
    this.transform(input.value);
  }

  private transform(value: string | null | undefined): void {
    if (!value) {
      return;
    }

    const upper = value.toUpperCase();
    if (value !== upper) {
      this.elementRef.nativeElement.value = upper;
      this.ngControl?.control?.setValue(upper, { emitEvent: false });
    }
  }
}
