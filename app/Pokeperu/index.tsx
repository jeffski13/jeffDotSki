import { useState, useEffect } from 'react';
import BattleContainer from './battle/BattleParent';
import MonsterSelection from './selection/MonsterSelection';
import { monsters, type Monster } from './monsters';
import ROUTES from '~/consts/ROUTES';
import './pokeperu.css';

export default function PokePeru() {
  // Load edits from localStorage and merge with monsters
  const [editedMonsters, setEditedMonsters] = useState<Monster[]>(monsters);

  useEffect(() => {
    const stored = localStorage.getItem('pokedexEdits');
    if (stored) {
      const editData = JSON.parse(stored);
      const getMonsterWithEdits = (monster: Monster) => {
        const edit = editData[monster.name];
        if (!edit) return monster;
        return {
          ...monster,
          ...edit,
          attack1: { ...monster.attack1, ...(edit.attack1 || {}) },
          attack2: { ...monster.attack2, ...(edit.attack2 || {}) },
        };
      };
      setEditedMonsters(monsters.map(getMonsterWithEdits));
    } else {
      setEditedMonsters(monsters);
    }
  }, []);

  return (
    <div className="TitlePage" >
      <div className="pokeperu-img-container">
        <img src="/images/pokemoninperu.png" alt="PokePeru" className="pokeperu-logo" />
      </div>
      <PokePeruContent monsters={editedMonsters}
        dexRoute={ROUTES.pokePeru.pokedex}
        battleRoute={ROUTES.pokePeru.battle}
        gymRoute={ROUTES.pokePeru.gymleaders}
      />
    </div>
  );
}

interface PokePeruContentProps {
  monsters: Monster[];
  dexRoute: string;
  battleRoute: string;
  gymRoute: string;
}

export function PokePeruContent({
  monsters,
  dexRoute,
  battleRoute,
  gymRoute
}: PokePeruContentProps) {
  const [selectedMonstersNames, setSelectedMonstersNames] = useState<string[]>([]);
  const [selectedMonsters, setSelectedMonsters] = useState<Monster[]>([]);
  const [currentUser, setCurrentUser] = useState(1);

  const handleMonsterSelect = (monster: Monster) => {
    if (selectedMonstersNames.includes(monster.name)) return; // Prevent duplicate selection

    setSelectedMonstersNames([...selectedMonstersNames, monster.name]);
    setSelectedMonsters([...selectedMonsters, monster]);
    setCurrentUser(currentUser === 1 ? 2 : 1); // Switch user
  };

  return (
    <>
      {selectedMonstersNames.length < 2 ? (
        <MonsterSelection
          monsters={monsters}
          selectedMonstersNames={selectedMonstersNames}
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