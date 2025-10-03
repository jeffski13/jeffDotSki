export const getDuplicateIdNames = (monsters: Monster[]) => {
  // Check for duplicate ids
  const idCounts: Record<string, number> = {};
  for (const m of monsters) {
    idCounts[m.id] = (idCounts[m.id] || 0) + 1;
  }
  console.log(idCounts)
  const dups = Object.entries(idCounts).filter(([id, count]) => count > 1);
  console.log('dups arr')
  console.log(dups)
  if (dups.length > 0) {
    let duplicateNames = [];
    for (let duplicateId = 0; duplicateId < dups.length; duplicateId++) {
      const element = dups[duplicateId]['0'];
      console.log('duplicateId')
      console.log(element)
      for (const monsterEntry of monsters) {
        console.log(monsterEntry.id)
        if (monsterEntry.id == element) {
          console.log(monsterEntry.name)
          duplicateNames.push(monsterEntry.name);
        }
      }
    }
    return duplicateNames;
  } else {
    return [];
  }
}