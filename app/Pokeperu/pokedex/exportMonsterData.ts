import type { Monster } from "../monsters";
import { ElementType } from "../ElementType";

const balancedDefaultAttack = {
    name: "Tackle",
    type: "Normal",
    isPhysical: true,
    damage: 40,
    powerPoints: 4,
    accuracy: 0.75,
};

// Transform types to ElementType
const toElementTypeString = (val): string | null => {
    console.log(`in: ${val}`);
    if (val == null) {
        console.log(`returning null`);
        return null;
    };
    if (Object.values(ElementType).includes(val)) {
        console.log(`returning val as ElementType`);
        return `ElementType.${val as ElementType}`
    }
    // fallback: try to match string
    const found = Object.values(ElementType).find(e => e.toLowerCase() === String(val).toLowerCase());
    if(found) {
        return `ElementType.${found}`
    }
    return null;
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
                type: toElementTypeString(type),
                secondType: toElementTypeString(secondType),
                image,
                description,
                inspiration,
                hp, attack, defense, specialAttack, specialDefense, speed,
                attack1: {
                    ...attack1,
                    type: toElementTypeString(attack1.type)
                },
                attack2: {
                    ...attack2,
                    type: toElementTypeString(attack2.type)
                }
            }
            console.log('finalMonsterExportData: ', finalMonsterExportData)
            return finalMonsterExportData;
        }).filter(Boolean);
        resolve(allMonsters);
    });
}