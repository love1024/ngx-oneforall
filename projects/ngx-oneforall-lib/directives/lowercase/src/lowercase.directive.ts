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
  selector: '[lowercase]',
  host: {
    '(input)': 'onInput($event)',
    '(blur)': 'onInput($event)',
  },
})
export class LowercaseDirective implements OnInit {
  /**
   * Whether to update the actual output value (model/control).
   * If false, only the visual style `text-transform: lowercase` is applied.
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
        el.style.textTransform = 'lowercase';
      } else {
        el.style.textTransform = '';
      }
    });
  }

  ngOnInit(): void {
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

    const lower = value.toLowerCase();
    if (value !== lower) {
      this.elementRef.nativeElement.value = lower;
      this.ngControl?.control?.setValue(lower, { emitEvent: false });
    }
  }
}
