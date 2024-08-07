import { ChangeDetectionStrategy, Component, effect, forwardRef, signal } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

import { BaseComponent } from '../core/base.component';
import { PeriodPicker } from './period-picker.model';

@Component({
  selector: 'osd-ui-period-picker',
  templateUrl: './period-picker.component.html',
  styleUrl: './period-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PeriodPickerComponent),
      multi: true,
    },
  ],
})
export class PeriodPickerComponent extends BaseComponent<PeriodPicker> {
  private readonly _defaultYear = new Date().getFullYear();
  private readonly _defaultFromMonth = 0;
  private readonly _defaultToMonth = 11;
  private readonly _defaultLengthOfYears = 50;

  public readonly months = [
    { value: 0, name: 'January' },
    { value: 1, name: 'February' },
    { value: 2, name: 'March' },
    { value: 3, name: 'April' },
    { value: 4, name: 'May' },
    { value: 5, name: 'June' },
    { value: 6, name: 'July' },
    { value: 7, name: 'August' },
    { value: 8, name: 'September' },
    { value: 9, name: 'October' },
    { value: 10, name: 'November' },
    { value: 11, name: 'December' },
  ];
  public readonly years = Array.from({ length: this._defaultLengthOfYears }, (_, index) => this._defaultYear + index);

  public $selectedYear = signal<number>(this._defaultYear);
  public $fromMonth = signal<number>(this._defaultFromMonth);
  public $toMonth = signal<number>(this._defaultToMonth);

  public constructor() {
    super();
    effect(
      () => {
        this.updateValue({
          year: Number(this.$selectedYear()),
          fromMonth: Number(this.$fromMonth()),
          toMonth: Number(this.$toMonth()),
        });
      },
      { manualCleanup: false },
    );
  }

  public override writeValue(value: PeriodPicker): void {
    this.$selectedYear.set(value?.year || this._defaultYear);
    this.$fromMonth.set(value?.fromMonth || this._defaultFromMonth);
    this.$toMonth.set(value?.toMonth || this._defaultToMonth);
  }

  public onYearChange(year: number): void {
    this.$selectedYear.set(year);
  }

  public onFromMonthChange(month: number): void {
    this.$fromMonth.set(month);
  }

  public onToMonthChange(month: number): void {
    this.$toMonth.set(month);
  }
}
