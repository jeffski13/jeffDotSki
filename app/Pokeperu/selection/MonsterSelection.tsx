import { useEffect } from 'react';
import ROUTES from '../../consts/ROUTES';
import type { Monster } from '../monsters';
import './monsterselection.css';
import '../infolink.css';

interface MonsterSelectionProps {
  monsters: Monster[];
  selectedMonstersNames: string[];
  currentUser: number;
  handleMonsterSelect: (monster: Monster) => void;
}

export default function MonsterSelection({
  monsters,
  selectedMonstersNames,
  currentUser,
  handleMonsterSelect,
}: MonsterSelectionProps) {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const key = parseInt(event.key, 10);
      if (!isNaN(key) && key > 0 && key <= monsters.length) {
        const monster = monsters[key - 1];
        if (!selectedMonstersNames.includes(monster.name)) {
          handleMonsterSelect(monster);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [monsters, selectedMonstersNames, handleMonsterSelect]);

  return (
    <div className="PokePeruStart">
      <div className="secondary-page-header">
        {/* Gym button in upper left */}
        <a href={ROUTES.pokePeru.gymleaders} className="gym-link">
          <img
            src="/images/gym-icon.png"
            alt="Gym"
            className="gym-link-icon clickable-link-icon"
          />
        </a>
        <h1 className="title">Monster Selection</h1>
        <a href={ROUTES.pokePeru.pokedex} className="pokedex-link">
          <img
            src="/images/pokedex-icon.png"
            alt="Pokedex"
            className="pokedex-link-icon clickable-link-icon"
          />
        </a>
      </div>
      <h2>User {currentUser}, choose your monster:</h2>
      <div className="monster-grid">
        {monsters.map((monster, index) => (
          <button
            key={monster.name}
            onClick={() => handleMonsterSelect(monster)}
            disabled={selectedMonstersNames.includes(monster.name)}
            className="monster-button"
          >
            <div><strong>{monster.name}</strong></div>
            <div>({monster.trainer})</div>
            <img src={monster.image} alt={monster.name} className="monster-image-selection" />
            <div className="shortcut-label">Press {index + 1}</div>
          </button>
        ))}
      </div>

      <a href={ROUTES.pokePeru.info} className="info-link">
        <img
          src="/images/info-icon.png"
          alt="Information Link"
          className="info-link-icon clickable-link-icon"
        />
      </a>
    </div>
  );
}