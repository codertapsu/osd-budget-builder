export const extractMonthNames = (locale: string): string[] => {
  const monthNames = [];
  for (let i = 0; i < 12; i++) {
    monthNames.push(new Date(0, i).toLocaleString(locale, { month: 'long' }));
  }
  return monthNames;
};
