import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

import type { CategoryGroup } from '../models/category-group.model';
import type { CategoryItem } from '../models/category-item.model';

export const createCategoryItem = (item?: CategoryItem) =>
  new FormGroup({
    label: new FormControl<string>(item?.label || '', [Validators.required]),
    valuesByMonth: new FormArray(
      Array.from({ length: 12 }, (_, i) => new FormControl<number>(item?.valuesByMonth?.[i] || 0)),
    ),
  });

export const createCategoryGroup = (group?: CategoryGroup) =>
  new FormGroup({
    label: new FormControl<string>(group?.label || '', [Validators.required]),
    items: new FormArray((group?.items || [{} as CategoryItem]).map(createCategoryItem)),
  });
