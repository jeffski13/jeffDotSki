import { useState } from 'react';
import BattleContainer from './battle/BattleParent';
import MonsterSelection from './selection/MonsterSelection';
import { monsters, type Monster } from './monsters';
import ROUTES from '~/consts/ROUTES';
import KEYS from '~/consts/KEYS';
import './pokeperu.css';

export default function PokePeru() {
  return (
    <div className="TitlePage" >
      <div className="pokeperu-img-container">
        <img src="/images/pokemoninperu.png" alt="PokePeru" className="pokeperu-logo" />
      </div>
      <PokePeruContent 
        monsters={monsters}
        monstersEditKey={KEYS.pokePeru.monsterEditsKey}
        dexRoute={ROUTES.pokePeru.pokedex}
        battleRoute={ROUTES.pokePeru.battle}
        gymRoute={ROUTES.pokePeru.gymleaders}
      />
    </div>
  );
}

export const getEditedMonstersList = (monstersList: Monster[], storageKey: string) => {
  // Load edits from localStorage and merge with monsters
  let editedMonstersList = monstersList;
  const stored = localStorage.getItem(storageKey);
  if (stored) {
    const editData = JSON.parse(stored);
    const getMonsterWithEdits = (monster: Monster) => {
      const edit = editData[monster.id];
      if (!edit) return monster;
      return {
        ...monster,
        ...edit,
        attack1: { ...monster.attack1, ...(edit.attack1 || {}) },
        attack2: { ...monster.attack2, ...(edit.attack2 || {}) },
      };
    };
    editedMonstersList = monstersList.map(getMonsterWithEdits);
  }
  return editedMonstersList;
}

interface PokePeruContentProps {
  monsters: Monster[];
  dexRoute: string;
  battleRoute: string;
  gymRoute: string;
  monstersEditKey: string;
}

export function PokePeruContent({
  monsters,
  dexRoute,
  battleRoute,
  gymRoute,
  monstersEditKey
}: PokePeruContentProps) {
  const [selectedMonstersIds, setSelectedMonstersIds] = useState<string[]>([]);
  const [selectedMonsters, setSelectedMonsters] = useState<Monster[]>([]);
  const [currentUser, setCurrentUser] = useState(1);
  
  const editedMonsters = getEditedMonstersList(monsters, monstersEditKey)
  const handleMonsterSelect = (monster: Monster) => {
    if (selectedMonstersIds.includes(monster.id)) return; // Prevent duplicate selection

    setSelectedMonstersIds([...selectedMonstersIds, monster.id]);
    setSelectedMonsters([...selectedMonsters, monster]);
    setCurrentUser(currentUser === 1 ? 2 : 1); // Switch user
  };

  return (
    <>
      {selectedMonstersIds.length < 2 ? (
        <MonsterSelection
          monsters={editedMonsters}
          selectedMonstersIds={selectedMonstersIds}
          currentUser={currentUser}
          handleMonsterSelect={handleMonsterSelect}
          dexRoute={dexRoute}
          gymLeaderRoute={gymRoute}
        />
      ) : (
        <BattleContainer selectedMonsters={selectedMonsters} battleRoute={battleRoute} />
      )}
    </>
  );
}