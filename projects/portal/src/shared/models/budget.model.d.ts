import type { PeriodPicker } from 'osd-ui';

import type { CategoryGroup } from './category-group.model';

export interface Budget {
  label: string;
  period: PeriodPicker;
  incomes: CategoryGroup[];
  expenses: CategoryGroup[];
}
