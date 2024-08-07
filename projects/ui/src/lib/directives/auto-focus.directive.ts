import { afterNextRender, Directive, ElementRef, inject, Input } from '@angular/core';

@Directive({
  selector: '[osdUiAutoFocus]',
  standalone: true,
})
export class AutoFocusDirective {
  private readonly _elementRef = inject(ElementRef);

  @Input() public osdUiAutoFocus = false;

  public constructor() {
    afterNextRender(() => {
      const isElementFocusable =
        this._elementRef.nativeElement instanceof HTMLInputElement ||
        this._elementRef.nativeElement instanceof HTMLTextAreaElement;
      if (isElementFocusable && this.osdUiAutoFocus) {
        this._elementRef.nativeElement.focus();
      }
    });
  }
}
