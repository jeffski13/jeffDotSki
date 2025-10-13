import { ElementType } from "../ElementType";
import type { Monster } from "../monsters";

// Moved the typeEffectiveness function to the top level of the file to ensure it is accessible
export const typeEffectiveness = (attackType: ElementType, defenderType: ElementType | null) => {
  if (!defenderType) return 1; // No second type

  const effectivenessChart: Record<ElementType, { x0: ElementType[]; x0_5: ElementType[]; x2: ElementType[] }> = {
    [ElementType.Normal]: { x0: [ElementType.Ghost], x0_5: [ElementType.Rock, ElementType.Steel], x2: [] },
    [ElementType.Fire]: { x0: [], x0_5: [ElementType.Fire, ElementType.Water, ElementType.Rock, ElementType.Dragon], x2: [ElementType.Grass, ElementType.Ice, ElementType.Bug, ElementType.Steel] },
    [ElementType.Water]: { x0: [], x0_5: [ElementType.Water, ElementType.Grass, ElementType.Dragon], x2: [ElementType.Fire, ElementType.Ground, ElementType.Rock] },
    [ElementType.Electric]: { x0: [ElementType.Ground], x0_5: [ElementType.Electric, ElementType.Grass, ElementType.Dragon], x2: [ElementType.Water, ElementType.Flying] },
    [ElementType.Grass]: { x0: [], x0_5: [ElementType.Fire, ElementType.Grass, ElementType.Poison, ElementType.Flying, ElementType.Bug, ElementType.Dragon, ElementType.Steel], x2: [ElementType.Water, ElementType.Ground, ElementType.Rock] },
    [ElementType.Ice]: { x0: [], x0_5: [ElementType.Fire, ElementType.Water, ElementType.Ice, ElementType.Steel], x2: [ElementType.Grass, ElementType.Ground, ElementType.Flying, ElementType.Dragon] },
    [ElementType.Fighting]: { x0: [ElementType.Ghost], x0_5: [ElementType.Poison, ElementType.Flying, ElementType.Psychic, ElementType.Bug, ElementType.Fairy], x2: [ElementType.Normal, ElementType.Ice, ElementType.Rock, ElementType.Dark, ElementType.Steel] },
    [ElementType.Poison]: { x0: [ElementType.Steel], x0_5: [ElementType.Poison, ElementType.Ground, ElementType.Rock, ElementType.Ghost], x2: [ElementType.Grass, ElementType.Fairy] },
    [ElementType.Ground]: { x0: [ElementType.Flying], x0_5: [ElementType.Grass, ElementType.Bug], x2: [ElementType.Fire, ElementType.Electric, ElementType.Poison, ElementType.Rock, ElementType.Steel] },
    [ElementType.Flying]: { x0: [], x0_5: [ElementType.Electric, ElementType.Rock, ElementType.Steel], x2: [ElementType.Grass, ElementType.Fighting, ElementType.Bug] },
    [ElementType.Psychic]: { x0: [ElementType.Dark], x0_5: [ElementType.Psychic, ElementType.Steel], x2: [ElementType.Fighting, ElementType.Poison] },
    [ElementType.Bug]: { x0: [], x0_5: [ElementType.Fire, ElementType.Fighting, ElementType.Poison, ElementType.Flying, ElementType.Ghost, ElementType.Steel, ElementType.Fairy], x2: [ElementType.Grass, ElementType.Psychic, ElementType.Dark] },
    [ElementType.Rock]: { x0: [], x0_5: [ElementType.Fighting, ElementType.Ground, ElementType.Steel], x2: [ElementType.Fire, ElementType.Ice, ElementType.Flying, ElementType.Bug] },
    [ElementType.Ghost]: { x0: [ElementType.Normal], x0_5: [ElementType.Dark], x2: [ElementType.Psychic, ElementType.Ghost] },
    [ElementType.Dragon]: { x0: [ElementType.Fairy], x0_5: [ElementType.Steel], x2: [ElementType.Dragon] },
    [ElementType.Dark]: { x0: [], x0_5: [ElementType.Fighting, ElementType.Dark, ElementType.Fairy], x2: [ElementType.Psychic, ElementType.Ghost] },
    [ElementType.Steel]: { x0: [], x0_5: [ElementType.Fire, ElementType.Water, ElementType.Electric, ElementType.Steel], x2: [ElementType.Ice, ElementType.Rock, ElementType.Fairy] },
    [ElementType.Fairy]: { x0: [], x0_5: [ElementType.Fire, ElementType.Poison, ElementType.Steel], x2: [ElementType.Fighting, ElementType.Dragon, ElementType.Dark] },
  };

  if (effectivenessChart[attackType].x0.includes(defenderType)) return 0;
  if (effectivenessChart[attackType].x0_5.includes(defenderType)) return 0.5;
  if (effectivenessChart[attackType].x2.includes(defenderType)) return 2;
  return 1;
};

export const calculateAdjustedDamage = (
  attackerMonster: Monster,
  defenderMonster: Monster,
  attackBaseDamage: number,
  attackType: ElementType,
  isPhysical: boolean,
  isAttackRandomDamage: boolean
): number => {

  // Calculate adjusted damage using the provided formula
  const A = isPhysical ? attackerMonster.attack : attackerMonster.specialAttack;
  const D = isPhysical ? defenderMonster.defense : defenderMonster.specialDefense;

  let level = 10;
  let criticalHitFactor = 1;
  let adjustedDamage = (((((2 * level * criticalHitFactor) / 5) + 2) * attackBaseDamage * (A / D)) / 50) + 2

  // Adjust damage based on type effectiveness
  const primaryEffectiveness = typeEffectiveness(attackType, defenderMonster.type);
  const secondaryEffectiveness = typeEffectiveness(attackType, defenderMonster.secondType);
  const effectivenessFactor = primaryEffectiveness * secondaryEffectiveness;
  adjustedDamage *= effectivenessFactor;
  
  // STAB (Same Type Attack Bonus)
  if (attackerMonster.type === attackType || attackerMonster.secondType === attackType) {
    adjustedDamage *= 2;
  }

  if (isAttackRandomDamage) {
    const Z = Math.random() * (255 - 217) + 217; // Random number between 217 and 255
    const randomFactor = Z / 255; // Normalize to 0-1 range
    adjustedDamage *= randomFactor; // Apply random factor
  }

  const finalComputedDamage = Math.round(adjustedDamage);

  //handle doesnt effect 
  if(effectivenessFactor !== 0 && finalComputedDamage < 1){
    return 1;
  }

  // Round the final adjusted damage to remove decimals
  return finalComputedDamage;
};