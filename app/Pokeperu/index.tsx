import { useState } from 'react';
import BattleContainer from './battle/BattleParent';
import MonsterSelection from './selection/MonsterSelection';
import { monsters, type Monster } from './monsters';
import './pokeperu.css';
export default function PokePeru() {
  return (
    <div className="TitlePage" >
      <div className="pokeperu-img-container">
        <img src="/images/pokemoninperu.png" alt="PokePeru" className="pokeperu-logo" />
      </div>
      <PokePeruContent />
    </div>
  );
}

function PokePeruContent() {
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
        />
      ) : (
        <BattleContainer selectedMonsters={selectedMonsters} />
      )}
    </>
  );
}