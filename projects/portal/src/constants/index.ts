import { Budget } from '@shared/models/budget.model';

export const DEFAULT_BUDGET: Budget = {
  label: 'Start Period V End Period V',
  period: { year: new Date().getFullYear(), fromMonth: 0, toMonth: 11 },
  incomes: [
    {
      label: 'General Income',
      items: [
        {
          label: 'Sales',
          valuesByMonth: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
          label: 'Commissions',
          valuesByMonth: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
      ],
    },
    {
      label: 'Other Income',
      items: [
        {
          label: 'Training',
          valuesByMonth: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
          label: 'Consulting',
          valuesByMonth: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
      ],
    },
  ],
  expenses: [
    {
      label: 'Operational Expenses',
      items: [
        {
          label: 'Management Fees',
          valuesByMonth: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
          label: 'Cloud Hosting',
          valuesByMonth: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
      ],
    },
    {
      label: 'Salaries and Wages',
      items: [
        {
          label: 'Full Time Dev Salaries',
          valuesByMonth: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
          label: 'Part Time Dev Salaries',
          valuesByMonth: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
          label: 'Remote Salaries',
          valuesByMonth: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
      ],
    },
  ],
};
