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

/**
 * 
 * @param editData an array of monsters with the key as the monster name
 * @param selectedMonsters original monsters array
 * @returns 
 */
export const getMonsterData = (
    editData: { [monsterId: string]: Partial<Monster> & { attack1?: Partial<Monster['attack1']>, attack2?: Partial<Monster['attack2']> } },
    selectedMonsters: Monster[]
): Promise<any[]> => {
    return new Promise((resolve) => {
        // Helper to transform type fields to ElementType
        const toElementType = (val: any) => {
            if (val == null) return null;
            if (Object.values(ElementType).includes(val)) return val as ElementType;
            const found = Object.values(ElementType).find(e => e.toLowerCase() === String(val).toLowerCase());
            return found || null;
        };

        // Edited monsters
        const editedMonsterNames = new Set(Object.keys(editData));
        const editedMonsters = Object.keys(editData).map(monsterId => {
            const monster = selectedMonsters.find(monster => monster.id === monsterId);
            if (!monster) {
                return null;
            }
            const edit = editData[monsterId];
            // Merge edits into monster
            const merged = {
                ...monster,
                ...edit,
                attack1: { ...monster.attack1, ...(edit.attack1 || { ...balancedDefaultAttack }) },
                attack2: { ...monster.attack2, ...(edit.attack2 || { ...balancedDefaultAttack }) },
            };
            const {
                name: mergedName,
                id,
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
            return {
                name: mergedName,
                id,
                trainer,
                trainerImage,
                type: toElementType(type),
                secondType: toElementType(secondType),
                image,
                description,
                inspiration,
                hp, attack, defense, specialAttack, specialDefense, speed,
                attack1: {
                    ...attack1,
                    type: toElementType(attack1.type)
                },
                attack2: {
                    ...attack2,
                    type: toElementType(attack2.type)
                }
            };
        }).filter(Boolean);

        // Unedited monsters
        const uneditedMonsters = selectedMonsters.filter(monster => !editedMonsterNames.has(monster.id)).map(monster => {
            const {
                id,
                name,
                trainer,
                trainerImage,
                type,
                secondType,
                image,
                description,
                inspiration,
                hp, attack, defense, specialAttack, specialDefense, speed,
                attack1, attack2
            } = monster;
            return {
                id,
                name,
                trainer,
                trainerImage,
                type: toElementType(type),
                secondType: toElementType(secondType),
                image,
                description,
                inspiration,
                hp, attack, defense, specialAttack, specialDefense, speed,
                attack1: {
                    ...attack1,
                    type: toElementType(attack1.type)
                },
                attack2: {
                    ...attack2,
                    type: toElementType(attack2.type)
                }
            };
        });

        const allMonsters = [...editedMonsters, ...uneditedMonsters];
        resolve(allMonsters);
    });
};