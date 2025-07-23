import dayjs from "dayjs";

export const generateTwoWeekSlots = (startDate, endDate) => {
  const slots = [];
  let current = dayjs(startDate).startOf("week");
  const end = dayjs(endDate);

  while (current.isBefore(end)) {
    const slotStart = current;
    const slotEnd = current.add(13, "day");

    slots.push({
      year: slotStart.year(),
      label: `${slotStart.format("DD/MM")} - ${slotEnd.format("DD/MM")}`,
      start: slotStart.format("YYYY-MM-DD"),
      end: slotEnd.format("YYYY-MM-DD"),
    });

    current = current.add(14, "day");
  }

  return slots.sort((a, b) => new Date(b.start) - new Date(a.start));
};
