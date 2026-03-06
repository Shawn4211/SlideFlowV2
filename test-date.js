const d1 = new Date('2026-03-04T08:00');
console.log("Local parsed:", d1.toISOString());

const d2 = new Date('2026-03-03T20:29');
console.log("Current time parsed:", d2.toISOString());

console.log("Current actual ISO:", new Date().toISOString());
