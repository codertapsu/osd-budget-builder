import type { CategoryItem } from './category-item.model';

export interface CategoryGroup {
  label: string;
  items: CategoryItem[];
}
