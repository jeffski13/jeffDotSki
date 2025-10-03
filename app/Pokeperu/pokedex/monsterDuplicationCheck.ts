import type { Monster } from "../monsters";

export const getMissingIdNames = (monsters: Monster[]) => {
  return monsters.filter(m => !m.id).map(m => m.name);
}
export const getDuplicateIdNames = (monsters: Monster[]) => {
  // Check for duplicate ids
  const idCounts: Record<string, number> = {};
  for (const m of monsters) {
    idCounts[m.id] = (idCounts[m.id] || 0) + 1;
  }
  const dups = Object.entries(idCounts).filter(([id, count]) => count > 1);
  if (dups.length > 0) {
    let duplicateNames = [];
    for (let duplicateId = 0; duplicateId < dups.length; duplicateId++) {
      const element = dups[duplicateId]['0'];
      for (const monsterEntry of monsters) {
        if (monsterEntry.id == element) {
          duplicateNames.push(monsterEntry.name);
        }
      }
    }
    return duplicateNames;
  } else {
    return [];
  }
}