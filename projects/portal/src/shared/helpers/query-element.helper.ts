export const queryElement = (selectors: string[], parent: HTMLElement = document.body) => {
  for (const selector of selectors) {
    const element = parent.querySelector(selector) as HTMLElement;
    if (element) {
      return element;
    }
  }
  return null;
};
