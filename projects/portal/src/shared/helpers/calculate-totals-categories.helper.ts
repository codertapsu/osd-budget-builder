import { CategoryGroup } from '../models/category-group.model';

export const calculateTotalsCategories = (groups: CategoryGroup[]) => {
  const subTotals = Array.from({ length: groups.length }, () => Array.from({ length: 12 }, () => 0));
  const totals = Array.from({ length: 12 }, () => 0);

  for (let groupIndex = 0; groupIndex < groups.length; groupIndex++) {
    const group = groups[groupIndex];
    for (const item of group.items) {
      for (let columnIndex = 0; columnIndex < item.valuesByMonth.length; columnIndex++) {
        subTotals[groupIndex][columnIndex] += item.valuesByMonth[columnIndex];
        totals[columnIndex] += item.valuesByMonth[columnIndex];
      }
    }
  }
  return { subTotals, totals };
};
