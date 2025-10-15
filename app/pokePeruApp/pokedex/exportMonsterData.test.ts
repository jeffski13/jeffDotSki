import { getMonsterData } from './exportMonsterData';
import { monsters } from '../monsters';
import { ElementType } from '../ElementType';

const getEditData: object = () => {
  const monster = monsters[0];
  const editData = {
    [monster.id]: {
      name: 'EditedName',
      hp: 123,
      attack1: {
        name: 'Edited Attack',
        type: ElementType.Fire,
        isPhysical: false,
        damage: 99,
        powerPoints: 1,
        accuracy: 0.5,
      },
    },
  };
  return editData;
}

describe('getMonsterData export function', () => {
  const monster = monsters[0];
  it('should reflect edits to a monster by id in the output array', async () => {
    // Pick a monster and create an edit for it
    const result = await getMonsterData(getEditData(), monsters);
    // Find the edited monster in the result
    const edited = result.find((m: any) => m.id === monster.id);
    expect(edited).toBeDefined();
    expect(edited.name).toBe('EditedName');
    expect(edited.hp).toBe(123);
    expect(edited.attack1.name).toBe('Edited Attack');
    expect(edited.attack1.type).toBe(ElementType.Fire);
    expect(edited.attack1.damage).toBe(99);
    expect(edited.attack1.powerPoints).toBe(1);
    expect(edited.attack1.accuracy).toBe(0.5);
    // Unedited monster should remain unchanged
    const unedited = result.find((m: any) => m.id !== monster.id);
    expect(unedited).toBeDefined();
    expect(unedited.name).not.toBe('EditedName');
  });

  it('output objects contain all keys present on Monster interface objects', async () => {
    const result = await getMonsterData(getEditData(), monsters);
    expect(result.length).toBeGreaterThan(0);

    const exported = result[0];
    const value = JSON.stringify(exported);

    // Use the first monster from the source as the reference shape
    const objectWithAllProperties = monsters[0];

    const expectedPatterns: Array<RegExp> = [];
    Object.keys(objectWithAllProperties).forEach(key => {
      // create a regex to match the key string inside the exported JSON
      const flags = 's';
      expectedPatterns.push(new RegExp(key, flags));
    });

    expectedPatterns.forEach((pattern) => {
      expect(value).toMatch(pattern);
    });
  });
});
