/**
 * Makes a date string from the year, month, and date in YYYY-MM-DD format.
 * @param parts the year, month, and date (assumed to be padded correctly)
 * @returns the formatted date string
 */
export function constructDateString(parts: Array<string>): string {
  return parts.join('-')
}

/**
 * Splits a date string into its year, month, and day parts.
 * @param dateString a string in YYYY-MM-DD format
 * @returns an array of the year, month, and date as strings
 */
export function deconstructDateString(dateString: string): Array<string> {
  return dateString.split('-')
}

/**
 * Pads the provided part of the date with 0s until it is 2 characters long.
 * @param datePart the date part, not necessarily padded
 * @returns the padded version of the provided date part
 */
export function padDatePart(datePart: string | number): string {
  return String(datePart).padStart(2, '0')
}

/**
 * Gets the path of a date, offset by the provided number of days from the given string.
 * @param currentDateString the current date as a date string (YYYY-MM-DD)
 * @param offset the number of days forward or backwards to move the date
 * @returns the path version (YYYY/MM/DD) of the date plus or minus the offset
 */
export function getDatePathOffset(currentDateString: string, offset: number): string {
  const current = new Date(currentDateString)
  current.setUTCDate(current.getUTCDate() + offset)
  return `/${current.toLocaleDateString('en-ZA', { timeZone: 'UTC' })}`
}

/**
 * Gets the path of a month, offset by the provided number of months from the given path.
 * @param currentMonthString the current month as a date string (YYYY-MM)
 * @param offset the number of months forwards or backwards to move the month
 * @returns the path version (YYYY/MM) of the month plus or minus the offset
 */
export function getMonthPathOffset(currentMonthString: string, offset: number): string {
  const parts = deconstructDateString(currentMonthString).map(Number)
  const current = new Date(parts[0], parts[1] - 1); // month is zero-based
  current.setMonth(current.getMonth() + offset);
  const nextYear = current.getFullYear();
  const nextMonth = padDatePart(current.getMonth() + 1);
  return `/${nextYear}/${nextMonth}`;
}
