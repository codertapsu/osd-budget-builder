import { DOCUMENT } from '@angular/common';
import { Directive, ElementRef, HostListener, inject, Input } from '@angular/core';

@Directive({
  selector: '[osdContextMenu]',
  standalone: true,
})
export class ContextMenuDirective {
  private readonly _document = inject(DOCUMENT);
  private readonly _hostElement = inject(ElementRef<HTMLElement>).nativeElement as HTMLElement;

  @Input('osdContextMenu') public popoverElement: HTMLElement;

  private hideContextMenu = (event: MouseEvent): void => {
    const target = event.target as HTMLElement;
    if (!this._hostElement.contains(target) && !this.popoverElement.contains(target)) {
      this.popoverElement.style.display = 'none';
      document.removeEventListener('click', this.hideContextMenu);
    }
  };

  @HostListener('contextmenu', ['$event'])
  public onRightClick(event: MouseEvent): void {
    event.preventDefault();
    this.showContextMenu();
  }

  private showContextMenu(): void {
    const hostRect = this._hostElement.getBoundingClientRect();
    const popoverRect = this.popoverElement.getBoundingClientRect();
    let top = hostRect.bottom;
    let left = hostRect.left;
    if (left + popoverRect.width > window.innerWidth) {
      left = window.innerWidth - popoverRect.width;
    }
    if (top + popoverRect.height > window.innerHeight) {
      top = hostRect.top - popoverRect.height;
    }
    this.popoverElement.style.position = 'fixed';
    this.popoverElement.style.top = `${top}px`;
    this.popoverElement.style.left = `${left}px`;
    this.popoverElement.style.display = 'block';

    this._document.addEventListener('click', this.hideContextMenu);
  }
}
