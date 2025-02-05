export function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function toISTYYYYMMDD(date: Date) {
  const istDate = new Date(
    date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );

  const year = istDate.getFullYear();
  const month = String(istDate.getMonth() + 1).padStart(2, "0");
  const day = String(istDate.getDate()).padStart(2, "0");

  return `${year}${month}${day}`;
}

export function formatDateText(date: Date) {
  return new Date(date).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatAvailabilityDateText(yyyymmdd: string) {
  const year = yyyymmdd.slice(0, 4); // Extracts "2025"
  const month = parseInt(yyyymmdd.slice(4, 6), 10); // Extracts "01" and converts to 1
  const day = parseInt(yyyymmdd.slice(6, 8), 10); // Extracts "08" and converts to 8

  return `${day}-${month}-${year}`;
}
