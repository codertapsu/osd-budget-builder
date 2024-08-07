import { NgClass } from '@angular/common';
import { booleanAttribute, ChangeDetectionStrategy, Component, forwardRef, HostBinding, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { BaseComponent } from '../core/base.component';
import { AutoFocusDirective } from '../directives/auto-focus.directive';

const numberFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 0,
  useGrouping: true,
  style: 'decimal',
});

@Component({
  selector: 'osd-ui-input-number-field',
  templateUrl: './input-number-field.component.html',
  styleUrl: './input-number-field.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgClass, AutoFocusDirective],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputNumberFieldComponent),
      multi: true,
    },
  ],
})
export class InputNumberFieldComponent extends BaseComponent<number> {
  @Input({ transform: booleanAttribute }) public autofocus = false;
  @Input() public min = Number.MIN_SAFE_INTEGER;
  @Input() public max = Number.MAX_SAFE_INTEGER;
  @Input() public step = 1;
  @Input() public placeholder = '';
  @Input() public allowNegative = false;
  @Input() public allowDecimal = true;
  @Input() public allowZero = true;
  @Input() public separator = true;

  public parsedValue = '';

  @HostBinding('class.readonly') get checkReadonly(): boolean {
    return this.readonly;
  }

  @HostBinding('class.disabled') get checkDisabled(): boolean {
    return this.disabled;
  }

  public override writeValue(value: number): void {
    const isNullOrUndefined = value === null || value === undefined;
    this.parsedValue = !this.separator
      ? String(value || '')
      : isNullOrUndefined
        ? ''
        : numberFormatter.format(Number(value));
    super.writeValue(value);
  }

  public changeValue(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    let commasRemoved = value.replace(/,/g, '');

    if (!this.allowNegative && commasRemoved.startsWith('-')) {
      this.parsedValue = commasRemoved.replace('-', '');
      target.value = this.parsedValue;
      return;
    }

    if (!this.allowZero && commasRemoved === '0') {
      this.parsedValue = '';
      target.value = this.parsedValue;
      return;
    }

    if (!this.allowDecimal && commasRemoved.endsWith('.')) {
      this.parsedValue = commasRemoved.replace('.', '');
      target.value = this.parsedValue;
      return;
    }
    if (commasRemoved === '.') {
      commasRemoved = '0.';
    }

    if (!this.separator) {
      this.parsedValue = String(value);
      target.value = this.parsedValue;
      super.updateValue(Number(value));
      return;
    }

    let toInt: number;
    let toLocale: string;
    if (commasRemoved.split('.').length > 1) {
      const decimal = isNaN(parseInt(commasRemoved.split('.')[1])) ? '' : parseInt(commasRemoved.split('.')[1]);
      toInt = parseInt(commasRemoved);
      toLocale = toInt.toLocaleString('en-US') + '.' + decimal;
    } else {
      toInt = parseInt(commasRemoved);
      toLocale = toInt.toLocaleString('en-US');
    }
    if (toLocale === 'NaN') {
      target.value = '';
      super.updateValue(null);
    } else {
      this.parsedValue = toLocale;
      target.value = this.parsedValue;
      const valueAsNumber = Number.parseFloat(toLocale.replace(/,/g, ''));
      super.updateValue(valueAsNumber);
    }
  }
}
