import type { Monster } from "../monsters";

export const getMonsterData = (editData, selectedMonsters: Monster[]) => {
return new Promise((resolve, reject) => {

    const allData = Object.keys(editData).map(monsterName => {
        const monster = selectedMonsters.find(monster => monster.name === monsterName);
        if (!monster) return null;
        const edit = editData[monsterName];
        // Merge edits into monster
        const merged = {
            ...monster,
            ...edit,
            attack1: { ...monster.attack1, ...(edit.attack1 || {}) },
            attack2: { ...monster.attack2, ...(edit.attack2 || {}) },
        };
        // Only include specified properties
        const {
            name: mergedName,
            trainer,
            trainerImage,
            hp,
            attack,
            defense,
            specialAttack,
            specialDefense,
            speed,
            type,
            secondType,
            image,
            description,
            inspiration,
            attack1,
            attack2
        } = merged;
        resolve({
            name: mergedName,
            trainer,
            trainerImage,
            hp,
            attack,
            defense,
            specialAttack,
            specialDefense,
            speed,
            type,
            secondType,
            image,
            description,
            inspiration,
            attack1,
            attack2
        });
    }).filter(Boolean);
})
}