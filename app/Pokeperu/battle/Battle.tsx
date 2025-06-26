import { useState, useEffect } from 'react';
import { ElementType } from '../ElementType';
import type { Monster, MonsterAttack } from '../monsters';
import BackNavigationConfirmModal from '../BackNavigationConfirmModal';
import Typewriter from './Typewriter';
import '../navigation.css';
import './battle.css';
import './battleAttacks.css';
import '../navigationOverride.css';
import { calculateAdjustedDamage, typeEffectiveness } from './battleAttack';

interface BattleProps {
  selectedMonsters: Monster[];
  attackMissedPercentage?: number; // Optional property to dynamically control the miss chance
  isAttackRandomDamage?: boolean; // Optional property to dynamically control the attack random damage
  isTextRenderInstant?: boolean; // Optional property to dynamically control the attack random damage
  isInstantStruggleEnabled?: boolean; // Optional property to dynamically control the attack random damage
  isAllAttackCriticalHit?: boolean; // Optional property to dynamically control the attack random damage
}

const STRUGGLE_ATTACK: MonsterAttack = {
  name: 'Struggle',
  damage: 10,
  type: ElementType.Normal,
  isPhysical: true,
  powerPoints: 999, // Not used, just for compatibility
  accuracy: 1,
};

export default function Battle({
  selectedMonsters,
  attackMissedPercentage,
  isAttackRandomDamage = true,
  isTextRenderInstant = false,
  isInstantStruggleEnabled = false,
  isAllAttackCriticalHit = false,
}: BattleProps) {
  const isMonster1First = selectedMonsters[0].speed >= selectedMonsters[1].speed;
  const [monster1Hp, setMonster1Hp] = useState(selectedMonsters[0].hp);
  const [monster2Hp, setMonster2Hp] = useState(selectedMonsters[1].hp);
  const [isMonster1Turn, setIsMonster1Turn] = useState(isMonster1First);
  const [attackResult, setAttackResult] = useState<string | null>(`${isMonster1First ? selectedMonsters[0].name : selectedMonsters[1].name} attacks first.`);
  const [effectivenessResult, setEffectivenessResult] = useState<string | null>('');
  const [isMonster1Blinking, setIsMonster1Blinking] = useState(false);
  const [isMonster2Blinking, setIsMonster2Blinking] = useState(false);
  const [damageToMonster1Animation, setDamageToMonster1Animation] = useState<string | null>(null);
  const [damageToMonster2Animation, setDamageToMonster2Animation] = useState<string | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string>('');
  const [monster1Attack1PP, setMonster1Attack1PP] = useState(selectedMonsters[0].attack1.powerPoints);
  const [monster1Attack2PP, setMonster1Attack2PP] = useState(selectedMonsters[0].attack2.powerPoints);
  const [monster2Attack1PP, setMonster2Attack1PP] = useState(selectedMonsters[1].attack1.powerPoints);
  const [monster2Attack2PP, setMonster2Attack2PP] = useState(selectedMonsters[1].attack2.powerPoints);
  const [monster1AttackAnim, setMonster1AttackAnim] = useState(false);
  const [monster2AttackAnim, setMonster2AttackAnim] = useState(false);
  const [showBackConfirm, setShowBackConfirm] = useState(false);

  useEffect(() => {
    // Randomly select an image from the /perulandscape folder on mount
    const randomImageIndex = Math.floor(Math.random() * 8) + 1; // Random number between 1 and 8
    setBackgroundImage(`/images/perulandscape/peru-${randomImageIndex}.jpg`);
  }, []);

  const handleStruggle = (attacker: number) => {
    const attackerMonster = selectedMonsters[attacker - 1];
    const defenderMonster = selectedMonsters[attacker === 1 ? 1 : 0];
    const selfDamage = Math.round(0.1 * attackerMonster.hp);
    const adjustedDamage = calculateAdjustedDamage(
      attackerMonster,
      defenderMonster,
      STRUGGLE_ATTACK.damage,
      STRUGGLE_ATTACK.type,
      STRUGGLE_ATTACK.isPhysical,
      isAttackRandomDamage
    );

    // Show struggle attack animation
    if (attacker === 1) {
      setDamageToMonster2Animation(STRUGGLE_ATTACK.type);
      setMonster1AttackAnim(true);
      setTimeout(() => {
        setDamageToMonster2Animation(null);
        setMonster1AttackAnim(false);
      }, 500);
      setIsMonster1Turn(false);
      setMonster2Hp((prevHp) => Math.max(prevHp - adjustedDamage, 0));
      setMonster1Hp((prevHp) => Math.max(prevHp - selfDamage, 0));
    } else {
      setDamageToMonster1Animation(STRUGGLE_ATTACK.type);
      setMonster2AttackAnim(true);
      setTimeout(() => {
        setDamageToMonster1Animation(null);
        setMonster2AttackAnim(false);
      }, 500);
      setIsMonster1Turn(true);
      setMonster1Hp((prevHp) => Math.max(prevHp - adjustedDamage, 0));
      setMonster2Hp((prevHp) => Math.max(prevHp - selfDamage, 0));
    }
    setAttackResult(
      `${attackerMonster.name} used ${STRUGGLE_ATTACK.name}! It did ${Math.round(adjustedDamage)} damage to ${defenderMonster.name}.`
    );
    setEffectivenessResult(`${attackerMonster.name} is hurt by recoil!`);
  }

  const handleAttack = (
    attacker: number,
    attackIndex: number
  ) => {
    setAttackResult('');

    const attackerMonster = selectedMonsters[attacker - 1];
    const defenderMonster = selectedMonsters[attacker === 1 ? 1 : 0];

    let adjustedDamage = 0;
    let isCritical = false;

    const selectedAttack =
      attackIndex === 1
        ? attackerMonster.attack1
        : attackerMonster.attack2;

    const missChance = attackMissedPercentage ?? 0.1;
    const attackHitChance = selectedAttack.accuracy ?? 1; // Default to 1 if not provided
    const attackMissed = (Math.random() < missChance) || (attackHitChance < Math.random());

    if (attackMissed) {
      adjustedDamage = 0;
    } else {
      adjustedDamage = calculateAdjustedDamage(
        attackerMonster,
        defenderMonster,
        selectedAttack.damage,
        selectedAttack.type,
        selectedAttack.isPhysical,
        isAttackRandomDamage
      );
      
      if (isAllAttackCriticalHit || (isAttackRandomDamage && Math.random() < 0.1)) {
        adjustedDamage *= 2;
        isCritical = true;
      }

      if (attacker === 1) {
        setDamageToMonster2Animation(selectedAttack.type); // Set the attack animation based on the attackType
        setTimeout(() => setDamageToMonster2Animation(null), 500); // Clear the animation after 500ms
      } else {
        setDamageToMonster1Animation(selectedAttack.type); // Set the attack animation based on the attackType
        setTimeout(() => setDamageToMonster1Animation(null), 500); // Clear the animation after 500ms
      }
    }

    if (attacker === 1) {
      setMonster1AttackAnim(true);
      setTimeout(() => setMonster1AttackAnim(false), 400); // duration matches animation
      setIsMonster1Turn(false);
      setMonster2Hp((prevHp) => Math.max(prevHp - adjustedDamage, 0));
      if (!attackMissed) {
        setIsMonster2Blinking(true);
        setTimeout(() => setIsMonster2Blinking(false), 500);
      }

      // Reduce Power Points for Monster 1
      if (attackIndex === 1) {
        setMonster1Attack1PP((prevPP) => Math.max(prevPP - 1, 0));
      } else {
        setMonster1Attack2PP((prevPP) => Math.max(prevPP - 1, 0));
      }
    } else {
      setMonster2AttackAnim(true);
      setTimeout(() => setMonster2AttackAnim(false), 400); // duration matches animation
      setIsMonster1Turn(true);
      setMonster1Hp((prevHp) => Math.max(prevHp - adjustedDamage, 0));
      if (!attackMissed) {
        setIsMonster1Blinking(true);
        setTimeout(() => setIsMonster1Blinking(false), 500);
      }

      // Reduce Power Points for Monster 2
      if (attackIndex === 1) {
        setMonster2Attack1PP((prevPP) => Math.max(prevPP - 1, 0));
      } else {
        setMonster2Attack2PP((prevPP) => {
          return Math.max(prevPP - 1, 0)
        });
      }
    }

    setAttackResult(
      `${attackerMonster.name} did ${Math.round(
        adjustedDamage
      )} damage to ${defenderMonster.name}.`
    );
    if (attackMissed) {
      setEffectivenessResult(`${attackerMonster.name}'s attack missed!`);
    } else {
      const primaryEffectiveness = typeEffectiveness(selectedAttack.type, defenderMonster.type);
      const secondaryEffectiveness = typeEffectiveness(selectedAttack.type, defenderMonster.secondType);
      const effectivenessFactor = primaryEffectiveness * secondaryEffectiveness;
      if (effectivenessFactor === 0.5) {
        setEffectivenessResult(`It's not very effective.`);
      } else if (effectivenessFactor === 0) {
        setEffectivenessResult(`It doesn't affect ${defenderMonster.name}`);
      } else if (effectivenessFactor === 2 || effectivenessFactor === 4) {
        setEffectivenessResult(`It's super effective!`);
      } else if (isCritical) {
        setEffectivenessResult(`Critical Hit!`);
      } else {
        setEffectivenessResult(``);
      }
    }
  };

  /**
   * for rendering the HP bar
   * @param currentHp 
   * @param maxHp 
   * @returns 
   */
  const calculateHpPercentage = (currentHp: number, maxHp: number) => {
    return (currentHp / maxHp) * 100;
  };

  const isMonster1Winner = monster2Hp === 0;
  const isMonster2Winner = monster1Hp === 0;
  const isGameOver = isMonster1Winner || isMonster2Winner;

  const isMonster1Attack1Enabled = !isMonster1Turn || monster2Hp === 0 || isGameOver || monster1Attack1PP === 0;
  const isMonster1Attack2Enabled = !isMonster1Turn || monster2Hp === 0 || isGameOver || monster1Attack2PP === 0;
  const isMonster2Attack1Enabled = isMonster1Turn || monster1Hp === 0 || isGameOver || monster2Attack1PP === 0;
  const isMonster2Attack2Enabled = isMonster1Turn || monster1Hp === 0 || isGameOver || monster2Attack2PP === 0;

  // Add keyboard shortcuts for attacks
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (isGameOver) return;

      switch (event.key) {
        case '1': // Monster 1, Attack 1
          if (isMonster1Turn && !isMonster1Attack1Enabled) {
            handleAttack(1, 1);
          }
          break;
        case '2': // Monster 1, Attack 2
          if (isMonster1Turn && !isMonster1Attack2Enabled) {
            handleAttack(1, 2);
          }
          break;
        case '3': // Monster 2, Attack 1
          if (!isMonster1Turn && !isMonster2Attack1Enabled) {
            handleAttack(2, 1);
          }
          break;
        case '4': // Monster 2, Attack 2
          if (!isMonster1Turn && !isMonster2Attack2Enabled) {
            handleAttack(2, 2);
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [isMonster1Turn, isGameOver, selectedMonsters]);

  // Struggle mechanics
  useEffect(() => {
    const isMonster1StruggleEnabled = monster1Attack1PP === 0 && monster1Attack2PP === 0;
    const isMonster2StruggleEnabled = monster2Attack1PP === 0 && monster2Attack2PP === 0;
    const struggleDelay = 2000;

    if (!isGameOver) {
      if (isMonster1Turn && isMonster1StruggleEnabled) {
        if (isInstantStruggleEnabled) {
          handleStruggle(1);
        }
        else {
          setTimeout(() => {
            handleStruggle(1);
          }, struggleDelay);
        }
      }
      if (!isMonster1Turn && isMonster2StruggleEnabled) {
        if (isInstantStruggleEnabled) {
          handleStruggle(2);
        }
        else {
          setTimeout(() => {
            handleStruggle(2);
          }, struggleDelay);
        }
      }
    }

    return () => {
    };
  }, [isMonster1Turn, isGameOver, monster1Attack1PP, monster1Attack2PP, monster2Attack1PP, monster2Attack2PP]);

  let battleTitle = `${selectedMonsters[0].trainer} vs ${selectedMonsters[1].trainer}`;
  if (isMonster2Winner) {
    battleTitle = `${selectedMonsters[1].trainer} Wins!`
  }
  else if (isMonster1Winner) {
    battleTitle = `${selectedMonsters[0].trainer} Wins!`
  }

  return (
    <div className="Battle">
      <div className="battle-background"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}></div>
      <div className="battle-container">
        <button
          type="button"
          className="back-button battle-back-button"
          onClick={() => setShowBackConfirm(true)}
          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
        >
          <img src="/images/arrow-left.png" alt="Back" className="back-arrow clickable-link-icon" />
        </button>
        <div className="battle-text-with-backdrop">
          <h1 className="battle-title"><Typewriter text={battleTitle} isInstantTextRender={isTextRenderInstant} /></h1>
        </div>
      </div>
      <div
        className="battle-container"
      >
        <div className={`monster battle-text-with-backdrop ${isMonster1Winner ? 'monster-winner' : ''} ${isMonster2Winner ? 'monster-loser' : ''}`}>
          <div>
            <h2>{selectedMonsters[0].name}</h2>
            <img
              src={selectedMonsters[0].image}
              alt={selectedMonsters[0].name}
              className={`monster-battle-image ${isMonster1Blinking ? 'blinking' : ''} ${monster1AttackAnim ? 'monster1-attack-anim' : ''}`}
            />
            {damageToMonster1Animation && <div className={`attack-animation ${damageToMonster1Animation}`}></div>}
          </div>
          <p>HP: <span className='hp-value-monster1'>{monster1Hp}</span></p>
          <div className="hp-bar">
            <div id="hp-bar-ui-monster1"
              className={`hp-bar-fill${(monster1Hp / selectedMonsters[0].hp) < 0.5 ? ' low' : ''}`}
              style={{
                width: `${calculateHpPercentage(monster1Hp, selectedMonsters[0].hp)}%`,
              }}
            >
            </div>
          </div>
          <button
            onClick={() =>
              handleAttack(1, 1)
            }
            disabled={isMonster1Attack1Enabled}
            className={isMonster1Attack1Enabled ? 'attack-button disabled' : 'attack-button enabled'}
          >
            {selectedMonsters[0].attack1.name}<br />PP: {monster1Attack1PP}/{selectedMonsters[0].attack1.powerPoints}
          </button>
          <button
            onClick={() =>
              handleAttack(1, 2)
            }
            disabled={isMonster1Attack2Enabled}
            className={isMonster1Attack2Enabled ? 'attack-button disabled' : 'attack-button enabled'}
          >
            {selectedMonsters[0].attack2.name}<br />PP: {monster1Attack2PP}/{selectedMonsters[0].attack2.powerPoints}
          </button>
        </div>
        <div className={`monster battle-text-with-backdrop ${isMonster2Winner ? 'monster-winner' : ''} ${isMonster1Winner ? 'monster-loser' : ''}`}>
          <h2>{selectedMonsters[1].name}</h2>
          <img
            src={selectedMonsters[1].image}
            alt={selectedMonsters[1].name}
            className={`monster-battle-image ${isMonster2Blinking ? 'blinking' : ''} ${monster2AttackAnim ? 'monster2-attack-anim' : ''}`}
          />
          {damageToMonster2Animation && <div className={`attack-animation ${damageToMonster2Animation}`}></div>}
          <p>HP: <span className='hp-value-monster2'>{monster2Hp}</span></p>
          <div className="hp-bar">
            <div id="hp-bar-ui-monster1"
              className={`hp-bar-fill${monster2Hp / selectedMonsters[1].hp < 0.5 ? ' low' : ''}`}
              style={{
                width: `${calculateHpPercentage(monster2Hp, selectedMonsters[1].hp)}%`,
              }}
            ></div>
          </div>
          <button
            onClick={() =>
              handleAttack(2, 1)
            }
            disabled={isMonster2Attack1Enabled}
            className={isMonster2Attack1Enabled ? 'attack-button disabled' : 'attack-button enabled'}
          >
            {selectedMonsters[1].attack1.name}<br />PP: {monster2Attack1PP}/{selectedMonsters[1].attack1.powerPoints}
          </button>
          <button
            onClick={() =>
              handleAttack(2, 2)
            }
            disabled={isMonster2Attack2Enabled}
            className={isMonster2Attack2Enabled ? 'attack-button disabled' : 'attack-button enabled'}
          >
            {selectedMonsters[1].attack2.name}<br />PP: {monster2Attack2PP}/{selectedMonsters[1].attack2.powerPoints}
          </button>
        </div>
      </div>
      <div className="battle-container">
        <div className="battle-results battle-text-with-backdrop">
          <Typewriter text={attackResult} isInstantTextRender={isTextRenderInstant} />
          <br />
          <Typewriter text={effectivenessResult} isInstantTextRender={isTextRenderInstant} />
        </div>
      </div>
      {showBackConfirm && (<BackNavigationConfirmModal onCancelNavigation={() => setShowBackConfirm(false)}></BackNavigationConfirmModal>)}
    </div>
  );
}
