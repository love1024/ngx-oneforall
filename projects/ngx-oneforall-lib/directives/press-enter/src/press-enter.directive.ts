import { Directive, HostListener, input, output } from '@angular/core';

@Directive({
    selector: '[pressEnter]',
    standalone: true
})
export class PressEnterDirective {
    preventDefault = input<boolean>(true);
    pressEnter = output<void>();

    @HostListener('keydown.enter', ['$event'])
    onEnter(event: KeyboardEvent): void {
        if (this.preventDefault()) {
            event.preventDefault();
        }
        this.pressEnter.emit();
    }
}
