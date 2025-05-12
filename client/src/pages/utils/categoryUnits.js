// src/utils/categoryUnits.js

export const categoryUnits = [
  { category: "steel sheets", unit: "feet" },
  { category: "steel rod", unit: "bars" },
  { category: "door latches & lock", unit: "Ltches" },
  { category: "cement sheet", unit: "sheets" },
  { category: "diamond fence", unit: "feet" },
  { category: "regular fence", unit: "feet" },
];

// Reusable function
export function getUnit(category) {
  const found = categoryUnits.find(item => item.category.toLowerCase() === category.toLowerCase());
  return found ? found.unit : "kg";
}