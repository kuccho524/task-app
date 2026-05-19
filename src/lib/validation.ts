export function isValidDateRange(startDate: Date | null, deadline: Date | null) {
  if (!startDate || !deadline) return true;

  return startDate <= deadline;
}