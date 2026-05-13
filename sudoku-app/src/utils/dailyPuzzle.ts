export const getDailyPuzzleSeed = (): string => {
  const date = new Date();
  return `daily-${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};
