export function isAllDay(start: Date | string, end?: Date | string) {
  if (typeof start === 'string') {
    start = new Date(start);
  }
  if (end && typeof end === 'string') {
    end = new Date(end);
  }
  return (
    (!end || start.toISOString() === end.toString()) &&
    start.getHours() === 23 &&
    start.getMinutes() === 59
  );
}
