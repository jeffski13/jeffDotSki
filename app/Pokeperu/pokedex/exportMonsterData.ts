import type { Monster } from "../monsters";

const balancedDefaultAttack = {
    name: "Tackle",
    type: "Normal",
    isPhysical: true,
    damage: 40,
    powerPoints: 4,
    accuracy: 0.75,
};

/**
 * 
 * @param editData an array of monsters with the key as the monster name
 * @param selectedMonsters original monsters array
 * @returns 
 */
export const getMonsterData = (editData, selectedMonsters: Monster[]) => {
    return new Promise((resolve, reject) => {
        const allMonsters = Object.keys(editData).map(monsterName => {
            const monster = selectedMonsters.find(monster => monster.name === monsterName);
            if (!monster) {
                return null
            };
            const edit = editData[monsterName];
            // Merge edits into monster
            const merged = {
                ...monster,
                ...edit,
                attack1: { ...monster.attack1, ...(edit.attack1 || { ...balancedDefaultAttack }) },
                attack2: { ...monster.attack2, ...(edit.attack2 || { ...balancedDefaultAttack }) },
            };

            const {
                name: mergedName,
                trainer,
                trainerImage,
                type,
                secondType,
                image,
                description,
                inspiration,
                hp, attack, defense, specialAttack, specialDefense, speed,
                attack1, attack2
            } = merged;
            const finalMonsterExportData = {
                name: mergedName,
                trainer,
                trainerImage,
                type: type,
                secondType: secondType,
                image,
                description,
                inspiration,
                hp, attack, defense, specialAttack, specialDefense, speed,
                attack1: {
                    ...attack1,
                    type: attack1.type
                },
                attack2: {
                    ...attack2,
                    type: attack2.type
                }
            }
            console.log('finalMonsterExportData: ', finalMonsterExportData)
            return finalMonsterExportData;
        }).filter(Boolean);
        resolve(allMonsters);
    });
}