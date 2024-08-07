import { NgClass } from '@angular/common';
import { booleanAttribute, ChangeDetectionStrategy, Component, forwardRef, HostBinding, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { BaseComponent } from '../core/base.component';
import { AutoFocusDirective } from '../directives/auto-focus.directive';

type InputType = 'text' | 'email' | 'url' | 'password' | 'tel' | 'non-numerical';

@Component({
  selector: 'osd-ui-input-text-field',
  templateUrl: './input-text-field.component.html',
  styleUrl: './input-text-field.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgClass, AutoFocusDirective],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputTextFieldComponent),
      multi: true,
    },
  ],
})
export class InputTextFieldComponent extends BaseComponent<string> {
  @Input({ transform: booleanAttribute }) public autofocus = false;
  @Input() public placeholder = '';
  @Input() public type: InputType = 'text';

  public parsedValue = '';

  @HostBinding('class.readonly') get checkReadonly(): boolean {
    return this.readonly;
  }

  @HostBinding('class.disabled') get checkDisabled(): boolean {
    return this.disabled;
  }

  public override writeValue(value: string): void {
    this.parsedValue = value;
    super.writeValue(value);
  }

  public changeValue(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    if (this.type === 'non-numerical') {
      this.parsedValue = (value || '').replace(/\d+/g, '').replace(/\s+/g, ' ');
      target.value = this.parsedValue;
    } else {
      this.parsedValue = value.replace(/\s+/g, ' ');
    }
    super.updateValue(this.parsedValue);
  }
}
