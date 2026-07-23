export function formatDateArrayToRanges(dates: string[]): string[] {
  if (!dates || dates.length === 0) return [];

  const sortedDates = dates
    .map(d => new Date(d))
    .filter(d => !isNaN(d.getTime()))
    .sort((a, b) => a.getTime() - b.getTime());

  if (sortedDates.length === 0) return dates;

  const format = (date: Date) => date.toISOString().split("T")[0];
  const ranges: string[] = [];
  
  let start = sortedDates[0];
  let end = sortedDates[0];

  for (let i = 1; i < sortedDates.length; i++) {
    const current = sortedDates[i];
    const diffDays = Math.round((current.getTime() - end.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      end = current;
    } else {
      if (start.getTime() === end.getTime()) {
        ranges.push(format(start));
      } else {
        ranges.push(`${format(start)} to ${format(end)}`);
      }
      start = current;
      end = current;
    }
  }

  if (start.getTime() === end.getTime()) {
    ranges.push(format(start));
  } else {
    ranges.push(`${format(start)} to ${format(end)}`);
  }

  return ranges;
}
