import { DOCUMENT, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, LOCALE_ID, OnDestroy, OnInit, signal } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

import { InputNumberFieldComponent, InputTextFieldComponent, PeriodPicker, PeriodPickerComponent } from 'osd-ui';

import { DEFAULT_BUDGET } from '@constants';
import { ContextMenuDirective } from '@shared/directives/context-menu.directive';
import { calculateTotalsCategories } from '@shared/helpers/calculate-totals-categories.helper';
import { extractMonthNames } from '@shared/helpers/extract-month-names.helper';
import { createCategoryGroup, createCategoryItem } from '@shared/helpers/form-creator.helper';
import { isNullOrUndefined } from '@shared/helpers/operators.helper';
import { queryElement } from '@shared/helpers/query-element.helper';
import { Budget } from '@shared/models/budget.model';
import { CategoryItem } from '@shared/models/category-item.model';

@Component({
  selector: 'osd-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    RouterOutlet,
    NgIf,
    FormsModule,
    ReactiveFormsModule,
    PeriodPickerComponent,
    InputTextFieldComponent,
    InputNumberFieldComponent,
    ContextMenuDirective,
  ],
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly _numberOfMonths = 12;
  private readonly _locale = inject(LOCALE_ID);
  private readonly _document = inject(DOCUMENT);
  private readonly _window = this._document.defaultView;

  public readonly monthNames = extractMonthNames(this._locale);
  public readonly $subTotalsIncomes = signal<number[][]>([]);
  public readonly $totalsIncomes = signal<number[]>(Array.from({ length: this._numberOfMonths }, () => 0));
  public readonly $subTotalsExpenses = signal<number[][]>([]);
  public readonly $totalsExpenses = signal<number[]>(Array.from({ length: this._numberOfMonths }, () => 0));
  public readonly $profitLoss = signal<number[]>(Array.from({ length: this._numberOfMonths }, () => 0));
  public readonly $openingBalances = signal<number[]>(Array.from({ length: this._numberOfMonths }, () => 0));
  public readonly $closingBalances = signal<number[]>(Array.from({ length: this._numberOfMonths }, () => 0));

  public budgetForm: FormGroup;

  get periodFC(): FormControl {
    return this.budgetForm.get('period') as FormControl;
  }

  get incomesFA(): FormArray {
    return this.budgetForm.get('incomes') as FormArray;
  }

  get expensesFA(): FormArray {
    return this.budgetForm.get('expenses') as FormArray;
  }

  get columnsSpan(): number {
    return this.periodFC.value.toMonth - this.periodFC.value.fromMonth + 3;
  }

  public ngOnInit(): void {
    this.budgetForm = this.createBudgetForm(DEFAULT_BUDGET);
    this.calculateTotals(this.budgetForm.getRawValue());
    this.setupKeyboardEvent();
  }

  public ngOnDestroy(): void {
    this._document.removeEventListener('keydown', this.onKeyUp);
  }

  public onPeriodChange(period: PeriodPicker): void {
    this.periodFC.patchValue(period);
    this.calculateBalances();
  }

  public resetForm(): void {
    const isConfirmed = this._window.confirm('Are you sure you want to reset the form?');
    if (isConfirmed) {
      this.budgetForm = this.createBudgetForm(DEFAULT_BUDGET);
      this.calculateTotals(this.budgetForm.getRawValue());
    }
  }

  public calculateSubTotalsIncomes(groupIndex: number, columnIndex: number): void {
    const items = this.incomesFA.at(groupIndex).get('items').value as CategoryItem[];
    const totalByColumn = items.reduce((acc, item) => acc + item.valuesByMonth[columnIndex], 0);

    const currentSubTotals = this.$subTotalsIncomes();
    currentSubTotals[groupIndex][columnIndex] = totalByColumn;
    this.$subTotalsIncomes.set(currentSubTotals);

    const currentTotals = this.$totalsIncomes();
    currentTotals[columnIndex] = currentSubTotals.reduce((acc, subTotal) => acc + subTotal[columnIndex], 0);
    this.$totalsIncomes.set(currentTotals);

    this.calculateProfitLoss(columnIndex);
  }

  public calculateSubTotalsExpenses(groupIndex: number, columnIndex: number): void {
    const items = this.expensesFA.at(groupIndex).get('items').value as CategoryItem[];
    const totalByColumn = items.reduce((acc, item) => acc + item.valuesByMonth[columnIndex], 0);

    const currentSubTotals = this.$subTotalsExpenses();
    currentSubTotals[groupIndex][columnIndex] = totalByColumn;
    this.$subTotalsExpenses.set(currentSubTotals);

    const currentTotals = this.$totalsExpenses();
    currentTotals[columnIndex] = currentSubTotals.reduce((acc, subTotal) => acc + subTotal[columnIndex], 0);
    this.$totalsExpenses.set(currentTotals);

    this.calculateProfitLoss(columnIndex);
  }

  public addIncomeGroup(): void {
    this.incomesFA.push(createCategoryGroup());
  }

  public removeIncomeGroup(index: number): void {
    const isConfirmed = this._window.confirm('Are you sure you want to delete this group?');
    if (isConfirmed) {
      this.incomesFA.removeAt(index);
      this.recalculateTotals(this.incomesFA);
    }
  }

  public addExpenseGroup(): void {
    this.expensesFA.push(createCategoryGroup());
  }

  public removeExpenseGroup(index: number): void {
    const isConfirmed = this._window.confirm('Are you sure you want to delete this group?');
    if (isConfirmed) {
      this.expensesFA.removeAt(index);
      this.recalculateTotals(this.expensesFA);
    }
  }

  public addIncomeItem(index: number): void {
    (this.incomesFA.at(index).get('items') as FormArray).push(createCategoryItem());
  }

  public removeIncomeItem(groupIndex: number, rowIndex: number): void {
    const isConfirmed = this._window.confirm('Are you sure you want to delete this item?');
    if (isConfirmed) {
      (this.incomesFA.at(groupIndex).get('items') as FormArray).removeAt(rowIndex);
      this.recalculateTotals(this.incomesFA);
    }
  }

  public addExpenseItem(index: number): void {
    (this.expensesFA.at(index).get('items') as FormArray).push(createCategoryItem());
  }

  public removeExpenseItem(groupIndex: number, rowIndex: number): void {
    const isConfirmed = this._window.confirm('Are you sure you want to delete this item?');
    if (isConfirmed) {
      (this.expensesFA.at(groupIndex).get('items') as FormArray).removeAt(rowIndex);
      this.recalculateTotals(this.expensesFA);
    }
  }

  public applyToAll(groupIndex: number, rowIndex: number, columnIndex: number, type: 'income' | 'expense'): void {
    const groupTypeFA = type === 'income' ? this.incomesFA : this.expensesFA;
    const groupFA = groupTypeFA.at(groupIndex).get('items') as FormArray;
    const valuesByMonthFA = groupFA.at(rowIndex).get('valuesByMonth') as FormArray;
    const targetValue = valuesByMonthFA.at(columnIndex).value;
    valuesByMonthFA.controls.forEach((control, index) => {
      if (index !== columnIndex) {
        control.patchValue(targetValue);
      }
    });
    this.recalculateTotals(groupFA);
  }

  private recalculateTotals(groupFA: FormArray): void {
    const { fromMonth, toMonth } = this.periodFC.value as PeriodPicker;
    for (let groupIndex = 0; groupIndex < groupFA.length; groupIndex++) {
      for (let columnIndex = fromMonth; columnIndex <= toMonth; columnIndex++) {
        this.calculateSubTotalsIncomes(groupIndex, columnIndex);
        this.calculateSubTotalsExpenses(groupIndex, columnIndex);
      }
    }
    this.calculateTotals(this.budgetForm.getRawValue());
  }

  private createBudgetForm(budget: Budget) {
    return new FormGroup({
      label: new FormControl(budget.label, [Validators.required]),
      period: new FormControl(budget.period, [Validators.required]),
      incomes: new FormArray((budget.incomes || []).map(createCategoryGroup)),
      expenses: new FormArray((budget.expenses || []).map(createCategoryGroup)),
    });
  }

  private setupKeyboardEvent(): void {
    this._document.addEventListener('keydown', this.onKeyUp.bind(this));
  }

  private onKeyUp(event: KeyboardEvent): void {
    const activeElement = this._document.activeElement;
    const isInput = activeElement instanceof HTMLInputElement;
    const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    const isArrowKey = arrowKeys.includes(event.key);
    const targetElement = activeElement.closest('[data-coordinates]') as HTMLElement;
    if (!isInput || !isArrowKey || !targetElement) {
      return;
    }
    const [collectionIndex, groupIndex, rowIndex, columnIndex] = targetElement.dataset['coordinates']
      .split('+')
      .map(Number);
    this.handleArrowKeys(collectionIndex, groupIndex, rowIndex, columnIndex, event.key);
  }

  private handleArrowKeys(
    collectionIndex: number,
    groupIndex: number,
    rowIndex: number,
    columnIndex: number,
    key: string,
  ): void {
    const collections = [this.incomesFA, this.expensesFA];
    const collection = collections[collectionIndex];
    const isLastGroup = groupIndex === collection.length - 1;
    const isLastRow = rowIndex === (collection.at(groupIndex).get('items') as FormArray).length - 1;

    let focusableElements: HTMLElement;
    let selectors: string[];
    if (key === 'ArrowUp') {
      selectors = [
        `[data-coordinates="${collectionIndex}+${groupIndex}+${rowIndex - 1}+${columnIndex}"]`,
        `[data-coordinates="${collectionIndex}+${groupIndex}+${rowIndex - 1}"]`,
      ];
      if (!isNullOrUndefined(rowIndex)) {
        selectors.push(`[data-coordinates="${collectionIndex}+${groupIndex}"]`);
      }
      if (groupIndex > 0 && isNullOrUndefined(rowIndex)) {
        const lastRowPrevGroupIndex = (collection.at(groupIndex - 1).get('items') as FormArray).length - 1;
        selectors.push(`[data-coordinates="${collectionIndex}+${groupIndex - 1}+${lastRowPrevGroupIndex}"]`);
      }
      if (collectionIndex > 0 && groupIndex === 0 && isNullOrUndefined(rowIndex)) {
        const prevCollection = collections[collectionIndex - 1];
        const lastGroupPrevCollectionIndex = prevCollection.length - 1;
        const lastRowPrevGroupIndex =
          (prevCollection.at(lastGroupPrevCollectionIndex).get('items') as FormArray).length - 1;
        selectors.push(
          `[data-coordinates="${collectionIndex - 1}+${lastGroupPrevCollectionIndex}+${lastRowPrevGroupIndex}"]`,
        );
      }
    }
    if (key === 'ArrowDown') {
      selectors = [
        `[data-coordinates="${collectionIndex}+${groupIndex}+${rowIndex + 1}+${columnIndex}"]`,
        `[data-coordinates="${collectionIndex}+${groupIndex}+${rowIndex + 1}"]`,
        isLastRow
          ? `[data-coordinates="${collectionIndex}+${groupIndex + 1}"]`
          : `[data-coordinates="${collectionIndex}+${groupIndex}+0"]`,
      ];
      if (isLastGroup && isLastRow) {
        selectors.push(`[data-coordinates="${collectionIndex + 1}+0"]`);
      }
    }
    if (key === 'ArrowLeft') {
      selectors = [
        `[data-coordinates="${collectionIndex}+${groupIndex}+${rowIndex}+${columnIndex - 1}"]`,
        `[data-coordinates="${collectionIndex}+${groupIndex}+${rowIndex}"]`,
      ];
    }
    if (key === 'ArrowRight') {
      selectors = [`[data-coordinates="${collectionIndex}+${groupIndex}+${rowIndex}+${columnIndex + 1}"]`];
      if (isNullOrUndefined(columnIndex)) {
        selectors.push(`[data-coordinates="${collectionIndex}+${groupIndex}+${rowIndex}+0"]`);
      }
    }
    if (selectors?.length) {
      focusableElements = queryElement(selectors);
    }
    if (focusableElements && focusableElements.querySelector('input')) {
      focusableElements.querySelector('input').focus();
    }
  }

  private calculateTotals(budget: Budget): void {
    const { subTotals: subTotalsIncomes, totals: totalsIncomes } = calculateTotalsCategories(budget.incomes);
    this.$subTotalsIncomes.set(subTotalsIncomes);
    this.$totalsIncomes.set(totalsIncomes);

    const { subTotals: subTotalsExpenses, totals: totalsExpenses } = calculateTotalsCategories(budget.expenses);
    this.$subTotalsExpenses.set(subTotalsExpenses);
    this.$totalsExpenses.set(totalsExpenses);

    const profitLoss = Array.from(
      { length: this._numberOfMonths },
      (_, index) => totalsIncomes[index] - totalsExpenses[index],
    );
    this.$profitLoss.set(profitLoss);
    this.calculateBalances();
  }

  private calculateProfitLoss(columnIndex: number): void {
    const profitLoss = this.$profitLoss();
    profitLoss[columnIndex] = this.$totalsIncomes()[columnIndex] - this.$totalsExpenses()[columnIndex];
    this.$profitLoss.set(profitLoss);
    this.calculateBalances();
  }

  private calculateBalances(): void {
    const profitLoss = this.$profitLoss();
    const openingBalances = this.$openingBalances();
    const closingBalances = this.$closingBalances();
    const { fromMonth, toMonth } = this.periodFC.value as PeriodPicker;
    for (let index = fromMonth; index <= toMonth; index++) {
      openingBalances[index] = index === fromMonth ? 0 : closingBalances[index - 1] || 0;
      closingBalances[index] = openingBalances[index] + profitLoss[index];
    }
    this.$openingBalances.set(openingBalances);
    this.$closingBalances.set(closingBalances);
  }
}
