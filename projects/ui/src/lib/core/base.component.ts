import { ChangeDetectorRef, Directive, EventEmitter, inject, Input, Output, ViewRef } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

type VoidCallback<T = unknown> = (_?: T) => void;

@Directive()
export class BaseComponent<T> implements ControlValueAccessor {
  private readonly _changeDetectorRef = inject(ChangeDetectorRef);
  private readonly _onChangedFns = new Array<VoidCallback<T>>();
  private readonly _onTouchedFns = new Array<VoidCallback>();

  private _readonly: boolean;
  @Input() set readonly(value: boolean) {
    this._readonly = value !== null && `${value}` !== 'false';
  }

  get readonly(): boolean {
    return this._readonly;
  }

  private _disabled: boolean;
  @Input() set disabled(value: boolean) {
    this._disabled = value !== null && `${value}` !== 'false';
  }

  get disabled(): boolean {
    return this._disabled;
  }

  private _value: T;
  get value(): T {
    return this._value;
  }

  @Output() public readonly valueChange = new EventEmitter<T>();

  public static ngAcceptInputType_readonly: boolean | '';
  public static ngAcceptInputType_disabled: boolean | '';

  public registerOnChange(fn: VoidCallback): void {
    this._onChangedFns.push(fn);
  }

  public registerOnTouched(fn: VoidCallback): void {
    this._onTouchedFns.push(fn);
  }

  public writeValue(value: T): void {
    this._value = value;
    if (!(this._changeDetectorRef as ViewRef)['destroyed']) {
      this._changeDetectorRef.detectChanges();
    }
  }

  public setDisabledState(isDisabled: boolean): void {
    this._disabled = isDisabled;
    if (!(this._changeDetectorRef as ViewRef)['destroyed']) {
      this._changeDetectorRef.detectChanges();
    }
  }

  public markAsTouched(): void {
    this._onTouchedFns.forEach(fn => fn());
  }

  public updateValue(value: T): void {
    this._value = value;
    this._onChangedFns.forEach(fn => fn(value));
    this.valueChange.emit(value);
  }
}
