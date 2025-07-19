export function sortByKey(array, key, direction = "asc") {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    if (aVal == null || bVal == null) return 0;

    const isNumber = !isNaN(Number(aVal)) && !isNaN(Number(bVal));
    const valA = isNumber ? Number(aVal) : String(aVal).toLowerCase();
    const valB = isNumber ? Number(bVal) : String(bVal).toLowerCase();

    if (valA < valB) return direction === "asc" ? -1 : 1;
    if (valA > valB) return direction === "asc" ? 1 : -1;
    return 0;
  });
}
