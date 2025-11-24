import { render, screen, fireEvent, within } from '@testing-library/react';
import Battle from './Battle';
import { ElementType } from '../ElementType';
import type { Monster } from '../monsters';
import { calculateAdjustedDamage } from './battleAttack';
import mockSelectedMonsters, { mockTrainers } from '../mockMonsters';

const mocksWithMonster1VeryWeak = [{ ...mockSelectedMonsters[0] }, { ...mockSelectedMonsters[1] }];
mocksWithMonster1VeryWeak[0].hp = 60;
mocksWithMonster1VeryWeak[0].defense = 100;
mocksWithMonster1VeryWeak[0].attack = 100;
mocksWithMonster1VeryWeak[0].attack1 = {
  name: 'Quick Attack',
  damage: 10,
  type: ElementType.Normal,
  isPhysical: true,
  powerPoints: 10,
  accuracy: 0,
}
mocksWithMonster1VeryWeak[1].hp = 100;
mocksWithMonster1VeryWeak[1].defense = 100;
mocksWithMonster1VeryWeak[1].attack = 100;
mocksWithMonster1VeryWeak[1].attack1 = {
  name: 'Scratch',
  damage: 100,
  type: ElementType.Normal,
  isPhysical: true,
  powerPoints: 10,
  accuracy: 1,
}

const testMonster1Hp = (hpExpected: Number) => {
  const hpValueMonster1 = document.querySelector('.hp-value-monster1');
  const monster1Hp = parseInt(hpValueMonster1?.innerHTML ?? '0');
  expect(monster1Hp).toBe(hpExpected);
}
const testMonster2Hp = (hpExpected: Number) => {
  const hpValueMonster2 = document.querySelector('.hp-value-monster2');
  const monster2Hp = parseInt(hpValueMonster2?.innerHTML ?? '0');
  expect(monster2Hp).toBe(hpExpected);
}

describe('Battle Component', () => {
  test('verify initial HP', () => {
    render(<Battle selectedMonsters={mockSelectedMonsters} trainer1={mockTrainers[0]} trainer2={mockTrainers[1]} attackMissedPercentage={0} isAttackRandomDamage={false} isAnimationInstant={true} />);
    // Verify initial HP values
    testMonster1Hp(35);
    testMonster2Hp(47);
  });

  test('verify initial title message', () => {
    render(<Battle selectedMonsters={mockSelectedMonsters} trainer1={mockTrainers[0]} trainer2={mockTrainers[1]} attackMissedPercentage={0} isAttackRandomDamage={false} isAnimationInstant={true} />);

    expect(screen.getByText(/Ash vs Brock/i)).toBeInTheDocument();
  });

  test('when monster1 attacks, monster2Hp is reduced', () => {
    render(<Battle selectedMonsters={mockSelectedMonsters} trainer1={mockTrainers[0]} trainer2={mockTrainers[1]} attackMissedPercentage={0} isAttackRandomDamage={false} isAnimationInstant={true} />);

    // Find and click the attack button for monster1 (Pikachu)
    const attackButton = screen.getByText(/Quick Attack/i);
    fireEvent.click(attackButton);

    const damage = calculateAdjustedDamage(mockSelectedMonsters[0], mockSelectedMonsters[1], mockSelectedMonsters[0].attack1.damage, mockSelectedMonsters[0].attack1.type, mockSelectedMonsters[0].attack1.isPhysical, false);
    const expectedHp = mockSelectedMonsters[1].hp - damage;
    // Verify that monster2's HP is reduced
    testMonster2Hp(expectedHp);
  });

  test('when monster1 attacks, the results of the attack are displayed', async () => {
    render(<Battle selectedMonsters={mockSelectedMonsters} trainer1={mockTrainers[0]} trainer2={mockTrainers[1]} attackMissedPercentage={0} isAttackRandomDamage={false} isAnimationInstant={true} />);

    // Find and click the attack button for monster1 (Pikachu)
    const attackButton = screen.getByText(/Quick Attack/i);
    fireEvent.click(attackButton);

    // Verify that monster2's HP is reduced
    const battleResultMessages = screen.findAllByText(/Pikachu used Quick Attack. It did /i);
    expect((await battleResultMessages).length).toBe(2);
    const battleResultMessagesSuffix = screen.findAllByText(/damage./i);
    expect((await battleResultMessagesSuffix).length).toBe(2);
  });

  test('monster2 attack buttons are disabled and monster1 attack buttons are enabled when the UI appears', () => {
    render(<Battle selectedMonsters={mockSelectedMonsters} trainer1={mockTrainers[0]} trainer2={mockTrainers[1]} attackMissedPercentage={0} isAttackRandomDamage={false} isAnimationInstant={true} />);

    // Verify monster1's attack buttons are enabled
    const monster1Attack1Button = screen.getByText(/Quick Attack/i);
    const monster1Attack2Button = screen.getByText(/Thunderbolt/i);
    expect(monster1Attack1Button).toBeEnabled();
    expect(monster1Attack2Button).toBeEnabled();

    // Verify monster2's attack buttons are disabled
    const monster2Attack1Button = screen.getByText(/Scratch/i).parentElement?.parentElement;
    const monster2Attack2Button = screen.getByText(/Flamethrower/i).parentElement?.parentElement;
    expect(monster2Attack1Button).toBeDisabled();
    expect(monster2Attack2Button).toBeDisabled();
  });

  test('monster with the highest speed attacks first', async () => {
    const mockSelectedMonstersSpeedMod = [{ ...mockSelectedMonsters[0] }, { ...mockSelectedMonsters[1] }];
    mockSelectedMonstersSpeedMod[0].speed = 50; // Pikachu's speed
    mockSelectedMonstersSpeedMod[1].speed = 60; // Charmander's speed

    render(<Battle
      selectedMonsters={mockSelectedMonstersSpeedMod}
      trainer1={mockTrainers[0]}
      trainer2={mockTrainers[1]}
      attackMissedPercentage={0}
      isAttackRandomDamage={false}
      isAnimationInstant={true} />);

    // Verify that the initial message indicates that the monster with the highest speed attacks first
    const effectivenessResultMessages = screen.findAllByText(/Charmander attacks first./i);
    expect((await effectivenessResultMessages).length).toBe(2);

    // Verify that the monster with the highest speed (Pikachu) attacks first
    const monster2Attack1Button = screen.getByText(/Scratch/i);
    const monster2Attack2Button = screen.getByText(/Flamethrower/i);

    // Monster1's attack buttons should be enabled
    expect(monster2Attack1Button).toBeEnabled();

    // Monster2's attack buttons should be disabled
    expect(monster2Attack2Button).toBeEnabled();
  });

  test('attack buttons are disabled once a monster has won', async () => {
    render(<Battle selectedMonsters={mocksWithMonster1VeryWeak} trainer1={mockTrainers[0]} trainer2={mockTrainers[1]} attackMissedPercentage={0} isAttackRandomDamage={false} isAnimationInstant={true} />);

    // Simulate Monster 1 attacking Monster 2 until Monster 2's HP reaches 0
    const attackButtonMonster1 = screen.getByText(/Quick Attack/i);
    const attackButtonMonster2 = screen.getByText(/Scratch/i);
    for (let i = 0; i < 30; i++) {
      fireEvent.click(attackButtonMonster1);
      fireEvent.click(attackButtonMonster2);
    }

    testMonster1Hp(0);

    const monster1Attack1Button = screen.getByText(/Quick Attack/i).parentElement?.parentElement;
    const monster1Attack2Button = screen.getByText(/Thunderbolt/i).parentElement?.parentElement;
    //get
    const monster2Attack1ButtonRef = screen.findAllByText(/Scratch/i);
    const monster2Attack1Button = (await monster2Attack1ButtonRef)[0].parentElement?.parentElement;
    const monster2Attack2Button = screen.getByText(/Flamethrower/i).parentElement?.parentElement;

    expect(monster1Attack1Button).toBeDisabled();
    expect(monster1Attack2Button).toBeDisabled();
    expect(monster2Attack1Button).toBeDisabled();
    expect(monster2Attack2Button).toBeDisabled();
  });

  test('correct messages when monster has won', () => {
    const veryWeakPokemon = {
      name: 'Charmander', trainerId: 'trainer2id', description: '', inspiration: '',
      hp: 1, attack: 1, defense: 1, specialAttack: 1, specialDefense: 1, speed: 1,
      type: ElementType.Fire,
      secondType: null,
      image: '/images/monsters/charmander.jpg',
      attack1: { name: 'Scratch', damage: 0, type: ElementType.Normal, isPhysical: true, powerPoints: 20, accuracy: 0 },
      attack2: { name: 'Flamethrower', damage: 0, type: ElementType.Fire, isPhysical: false, powerPoints: 20, accuracy: 0 },
    };

    const oneSidedBattleMonsters = [mockSelectedMonsters[0], veryWeakPokemon];

    render(<Battle selectedMonsters={oneSidedBattleMonsters} trainer1={mockTrainers[0]} trainer2={mockTrainers[1]} attackMissedPercentage={0} isAttackRandomDamage={false} isAnimationInstant={true} />);

    // Simulate Monster 1 attacking Monster 2 until Monster 2's HP reaches 0
    const attackButtonMonster1 = screen.getByText(/Quick Attack/i);
    for (let i = 0; i < 30; i++) {
      fireEvent.click(attackButtonMonster1);
    }

    expect(screen.getByText(/Ash Wins!/i)).toBeInTheDocument();
  });

  it('should deal no damage when an Electric type attack is used against a Ground type monster', async () => {
    const selectedMonsters = [
      { ...mockSelectedMonsters[0] },
      { ...mockSelectedMonsters[1] },
    ];
    selectedMonsters[1].type = ElementType.Ground;
    selectedMonsters[1].hp = 100;

    render(<Battle
      selectedMonsters={selectedMonsters}
      trainer1={mockTrainers[0]}
      trainer2={mockTrainers[1]}
      attackMissedPercentage={0}
      isAttackRandomDamage={false}
      isAnimationInstant={true} />);

    // Monster 1 (Pikachu) uses Thunderbolt on Monster 2 (Diglett)
    const thunderboltButton = screen.getByText('Thunderbolt', { exact: false });
    fireEvent.click(thunderboltButton);

    // Assert that Diglett's HP remains unchanged
    testMonster2Hp(100);
    const effectivenessResultMessages = screen.findAllByText(/It doesn't affect/i);
    expect((await effectivenessResultMessages).length).toBe(2);
  });

  it('should deal no damage when an Electric type attack is used against a Ghost type monster with secondary type Ground', async () => {
    const gengar: Monster = {
      name: 'Nidoking',
      trainer: 'Giovanni',
      trainerImage: '',
      hp: 100,
      attack: 65,
      defense: 60,
      specialAttack: 130,
      specialDefense: 75,
      speed: 10,
      type: ElementType.Poison,
      secondType: ElementType.Ground,
      image: '/images/monsters/gengar.jpg',
      attack1: {
        name: 'Horn Drill',
        damage: 50,
        type: ElementType.Ghost,
        isPhysical: false,
        powerPoints: 10,
        accuracy: 1,
      },
      attack2: {
        name: 'Earthquake',
        damage: 50,
        type: ElementType.Ground,
        isPhysical: false,
        powerPoints: 10,
        accuracy: 1,
      },
      description: null,
      inspiration: '',
    };
    const selectedMonsters = [
      { ...mockSelectedMonsters[0] },
      gengar,
    ];

    render(<Battle selectedMonsters={selectedMonsters} trainer1={mockTrainers[0]} trainer2={mockTrainers[1]} attackMissedPercentage={0} isAttackRandomDamage={false} isAnimationInstant={true} />);

    // Monster 1 (Pikachu) uses Thunderbolt on Monster 2 (Gengar)
    const thunderboltButton = screen.getByText('Thunderbolt', { exact: false });
    fireEvent.click(thunderboltButton);

    // Assert that Gengar's HP remains unchanged
    testMonster2Hp(100);
    const effectivenessResultMessages = screen.findAllByText(/It doesn't affect/i);
    expect((await effectivenessResultMessages).length).toBe(2);
  });

  it('displays "attack missed!" when the attack misses', async () => {
    // Render the Battle component with attackMissedPercentage set to 1 (guaranteed miss)
    render(<Battle selectedMonsters={mockSelectedMonsters} trainer1={mockTrainers[0]} trainer2={mockTrainers[1]} attackMissedPercentage={1} isAttackRandomDamage={false} isAnimationInstant={true} />);

    // Simulate an attack by clicking the first monster's first attack button
    const attackButton = screen.getByText('Quick Attack', { exact: false });
    fireEvent.click(attackButton);

    // Assert that the "attack missed!" message is displayed
    const effectivenessResultMessages = screen.findAllByText(/attack missed!/i);
    expect((await effectivenessResultMessages).length).toBe(2);
  });

  it('displays "attack missed!" when the attack misses due to accuracy', async () => {
    const mockSelectedMonstersAccuracyMod = [{ ...mockSelectedMonsters[0] }, { ...mockSelectedMonsters[1] }];
    mockSelectedMonstersAccuracyMod[0].attack1 = {
      name: 'Quick Attack',
      damage: 10,
      type: ElementType.Normal,
      isPhysical: true,
      powerPoints: 1,
      accuracy: 0,
    }

    render(<Battle selectedMonsters={mockSelectedMonstersAccuracyMod} trainer1={mockTrainers[0]} trainer2={mockTrainers[1]} attackMissedPercentage={0} isAttackRandomDamage={false} isAnimationInstant={true} />);

    // Simulate an attack by clicking the first monster's first attack button
    const attackButton = screen.getByText('Quick Attack', { exact: false });
    fireEvent.click(attackButton);

    // Assert that the "attack missed!" message is displayed
    const effectivenessResultMessages = screen.findAllByText(/attack missed!/i);
    expect((await effectivenessResultMessages).length).toBe(2);
  });

  test('attack buttons are disabled once an attack has 0 power points', () => {
    const mockSelectedMonstersPowerPointsMod = [{ ...mockSelectedMonsters[0] }, { ...mockSelectedMonsters[1] }];
    mockSelectedMonstersPowerPointsMod[0].attack1 = {
      name: 'Quick Attack',
      damage: 10,
      type: ElementType.Normal,
      isPhysical: true,
      powerPoints: 1,
      accuracy: 1,
    }

    render(<Battle selectedMonsters={mockSelectedMonstersPowerPointsMod} trainer1={mockTrainers[0]} trainer2={mockTrainers[1]} attackMissedPercentage={0} isAttackRandomDamage={false} isAnimationInstant={true} />);

    // Simulate Monster 1 attacking Monster 2 until Monster 2's HP reaches 0
    const attackButtonMonster1 = screen.getByText(/Quick Attack/i);
    fireEvent.click(attackButtonMonster1);
    const attackButtonMonster2 = screen.getByText(/Scratch/i);
    fireEvent.click(attackButtonMonster2);

    // Verify that attack 1's power points is 0
    expect(screen.getByText(/PP: 0\/1/i)).toBeInTheDocument();

    // Verify attack 1 button is disabled and attack 2 is enabled
    const monster1Attack1Button = screen.getByText(/Quick Attack/i).parentElement?.parentElement;
    expect(monster1Attack1Button).toBeDisabled();
    const monster1Attack2Button = screen.getByText(/Thunderbolt/i).parentElement?.parentElement;
    expect(monster1Attack2Button).toBeEnabled();
  });

  test('attack buttons are disabled once an attack has 0 power points', async () => {
    render(<Battle selectedMonsters={mockSelectedMonsters} trainer1={mockTrainers[0]} trainer2={mockTrainers[1]} attackMissedPercentage={0} isAttackRandomDamage={false} isAllAttackCriticalHit={true} isAnimationInstant={true} />);

    // Simulate Monster 1 attacking Monster 2 until Monster 2's HP reaches 0
    const attackButtonMonster1 = screen.getByText(/Quick Attack/i);
    fireEvent.click(attackButtonMonster1);

    // Verify that attack critical hit occured
    const effectivenessResultMessages = screen.findAllByText(/Critical Hit!/);
    expect((await effectivenessResultMessages).length).toBe(2);
  });

  test('pokemon struggles once both attacks have 0 power points', async () => {
    const mockSelectedMonstersPowerPointsMod = [{ ...mockSelectedMonsters[0] }, { ...mockSelectedMonsters[1] }];
    mockSelectedMonstersPowerPointsMod[0].attack1 = {
      name: 'Quick Attack',
      damage: 10,
      type: ElementType.Normal,
      isPhysical: true,
      powerPoints: 1,
      accuracy: 1,
    }
    mockSelectedMonstersPowerPointsMod[0].attack2 = {
      name: 'Tackle',
      damage: 10,
      type: ElementType.Normal,
      isPhysical: true,
      powerPoints: 1,
      accuracy: 1,
    }
    mockSelectedMonstersPowerPointsMod[1].attack1 = {
      name: 'Scratch',
      damage: 10,
      type: ElementType.Normal,
      isPhysical: true,
      powerPoints: 1,
      accuracy: 1,
    }
    mockSelectedMonstersPowerPointsMod[1].attack2 = {
      name: 'Bite',
      damage: 10,
      type: ElementType.Normal,
      isPhysical: true,
      powerPoints: 2,
      accuracy: 1,
    }

    render(<Battle selectedMonsters={mockSelectedMonstersPowerPointsMod}
      attackMissedPercentage={0} isAttackRandomDamage={false}
      isAnimationInstant={true} isInstantStruggleEnabled={true} />);

    // Simulate Monster 1 attacking Monster 2 until Monster 2's HP reaches 0
    const attackButtonMonster1Attack1 = screen.getByText(/Quick Attack/i);
    fireEvent.click(attackButtonMonster1Attack1);
    const attackButtonMonster2Attack1 = screen.getByText(/Scratch/i);
    fireEvent.click(attackButtonMonster2Attack1);
    const attackButtonMonster1Attack2 = screen.getByText(/Tackle/i);
    fireEvent.click(attackButtonMonster1Attack2);
    const attackButtonMonster2Attack2 = screen.getByText(/Bite/i);
    fireEvent.click(attackButtonMonster2Attack2);

    // Verify that struggle is used
    const attackResultMessages = screen.findAllByText(/Pikachu used Struggle!/);
    expect((await attackResultMessages).length).toBe(2);
    const effectivenessResultMessages = screen.findAllByText(/Pikachu is hurt by recoil!/);
    expect((await effectivenessResultMessages).length).toBe(2);
  });

  test('attack types appear inside attack buttons', () => {
    render(<Battle selectedMonsters={mockSelectedMonsters} trainer1={mockTrainers[0]} trainer2={mockTrainers[1]} attackMissedPercentage={0} isAttackRandomDamage={false} isAnimationInstant={true} />);

    // For each monster, ensure both attack buttons contain the attack type text
    const attack1Button = screen.getByText(/Quick Attack/i).closest('button') as HTMLElement;
    const attack2Button = screen.getByText(/Thunderbolt/i).closest('button') as HTMLElement;
    const attack3Button = screen.getByText(/Scratch/i).closest('button') as HTMLElement;
    const attack4Button = screen.getByText(/Flamethrower/i).closest('button') as HTMLElement;

    expect(within(attack1Button).getByText(String(mockSelectedMonsters[0].attack1.type))).toBeInTheDocument();
    expect(within(attack2Button).getByText(String(mockSelectedMonsters[0].attack2.type))).toBeInTheDocument();
    expect(within(attack3Button).getByText(String(mockSelectedMonsters[1].attack1.type))).toBeInTheDocument();
    expect(within(attack4Button).getByText(String(mockSelectedMonsters[1].attack2.type))).toBeInTheDocument();
  });

  test('pokemon struggle loop once all attacks have 0 power points', () => {
    const mockSelectedMonstersPowerPointsMod = [{ ...mockSelectedMonsters[0] }, { ...mockSelectedMonsters[1] }];
    mockSelectedMonstersPowerPointsMod[0].hp = 500
    mockSelectedMonstersPowerPointsMod[0].defense = 100
    mockSelectedMonstersPowerPointsMod[0].attack1 = {
      name: 'Quick Attack',
      damage: 10,
      type: ElementType.Normal,
      isPhysical: true,
      powerPoints: 1,
      accuracy: 1,
    }
    mockSelectedMonstersPowerPointsMod[0].attack2 = {
      name: 'Tackle',
      damage: 10,
      type: ElementType.Normal,
      isPhysical: true,
      powerPoints: 1,
      accuracy: 1,
    }
    mockSelectedMonstersPowerPointsMod[1].attack1 = {
      name: 'Scratch',
      damage: 10,
      type: ElementType.Normal,
      isPhysical: true,
      powerPoints: 1,
      accuracy: 1,
    }
    mockSelectedMonstersPowerPointsMod[1].attack2 = {
      name: 'Bite',
      damage: 10,
      type: ElementType.Normal,
      isPhysical: true,
      powerPoints: 1,
      accuracy: 1,
    }

    console.error(mockTrainers[0])
    render(<Battle selectedMonsters={mockSelectedMonstersPowerPointsMod}
      trainer1={mockTrainers[0]} trainer2={mockTrainers[1]}
      attackMissedPercentage={0} isAttackRandomDamage={false}
      isAnimationInstant={true} isInstantStruggleEnabled={true} />);

    // Simulate Monster 1 attacking Monster 2 until Monster 2's HP reaches 0
    const attackButtonMonster1Attack1 = screen.getByText(/Quick Attack/i);
    fireEvent.click(attackButtonMonster1Attack1);
    const attackButtonMonster2Attack1 = screen.getByText(/Scratch/i);
    fireEvent.click(attackButtonMonster2Attack1);
    const attackButtonMonster1Attack2 = screen.getByText(/Tackle/i);
    fireEvent.click(attackButtonMonster1Attack2);
    const attackButtonMonster2Attack2 = screen.getByText(/Bite/i);
    fireEvent.click(attackButtonMonster2Attack2);

    // Verify that pokemon won
    expect(screen.getByText(/Ash wins!/i)).toBeInTheDocument();
  });

  test('shows "Are you sure?" popup with Yes and No buttons when back button is clicked', () => {
    render(
      <Battle
        selectedMonsters={mockSelectedMonsters}
        trainer1={mockTrainers[0]}
        trainer2={mockTrainers[1]}
        attackMissedPercentage={0}
        isAttackRandomDamage={false}
        isAnimationInstant={true}
      />
    );

    // Click the back button (find by alt text of the image or by role)
    const backButton = screen.getByRole('button', { name: /back/i });
    fireEvent.click(backButton);

    // Assert that the confirmation popup appears
    expect(screen.getByText(/Are you sure you want to return/i)).toBeInTheDocument();
    expect(screen.getByText(/to the selection screen\?/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Yes' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'No' })).toBeInTheDocument();
  });

  test('hp bar has "low" class when monster hp is below 50%', () => {

    // Render with Pikachu at 40 HP (less than 50% of 100)
    render(
      <Battle
        selectedMonsters={mocksWithMonster1VeryWeak}
        attackMissedPercentage={0}
        isAttackRandomDamage={false}
        isAnimationInstant={true}
      />
    );

    // Simulate reducing Pikachu's HP to less than 50%
    const attackButtonMonster1Attack1 = screen.getByText(/Quick Attack/i);
    const attackButtonMonster2Attack1 = screen.getByText(/Scratch/i);
    const hpValueMonster1 = document.querySelector('.hp-value-monster1');

    let monster1Hp = 50000; //set too  a high initial value to enter the loop
    while (monster1Hp > (0.5 * mocksWithMonster1VeryWeak[0].hp)) {
      fireEvent.click(attackButtonMonster1Attack1);
      fireEvent.click(attackButtonMonster2Attack1);
      monster1Hp = parseInt(hpValueMonster1?.innerHTML ?? '0');
    }

    expect(monster1Hp < (mocksWithMonster1VeryWeak[0].hp / 2)).toBe(true);
    const hpBar = document.querySelector('#hp-bar-ui-monster1');

    expect(hpBar?.className).toMatch(/hp-bar-fill/);
    expect(hpBar?.className).toMatch(/low/);
  });
});