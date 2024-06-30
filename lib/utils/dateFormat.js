import { formatInTimeZone } from "date-fns-tz";
import { parseISO, isValid } from "date-fns";

export const dateFormat = (date, format = "dd MMM yyyy", region = "America/New_York") => {
  if (!date) return ""; // Return empty string if date is undefined or null

  const parsedDate = typeof date === 'string' ? parseISO(date) : date; // Parse the date string to Date object if it's a string

  if (!isValid(parsedDate)) return ""; // Check if the parsed date is valid, return empty string if not

  return formatInTimeZone(
    parsedDate, // Ensure the date is a Date object
    region,
    format
  );
};
