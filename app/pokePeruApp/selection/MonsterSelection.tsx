import { useEffect } from 'react';
import ROUTES from '../../consts/ROUTES';
import type { Monster } from '../monsters';
import './monsterselection.css';
import '../secondaryPage.css';
import '../infolink.css';
import { Col, Container, Row } from 'react-bootstrap';
import type { GymLeader } from '../gymleaders';

interface MonsterSelectionProps {
  monsters: Monster[];
  gymLeaders: GymLeader[];
  selectedMonstersIds: string[];
  currentPlayer: number;
  handleMonsterSelect: (monster: Monster) => void;
  dexRoute: string;
  gymLeaderRoute: string;
}

export default function MonsterSelection({
  monsters,
  gymLeaders,
  selectedMonstersIds,
  currentPlayer,
  handleMonsterSelect,
  dexRoute,
  gymLeaderRoute
}: MonsterSelectionProps) {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const key = parseInt(event.key, 10);
      if (!isNaN(key) && key > 0 && key <= monsters.length) {
        const monster = monsters[key - 1];
        if (!selectedMonstersIds.includes(monster.id)) {
          handleMonsterSelect(monster);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [monsters, selectedMonstersIds, handleMonsterSelect]);

  return (
    <div className="PokePeruStart">
      <div className="secondary-page-header">
        {/* Gym button in upper left */}
        <a href={gymLeaderRoute} className="gym-link">
          <img
            src="/images/gym-icon.png"
            alt="Gym Leaders"
            className="gym-link-icon clickable-link-icon"
          />
        </a>
        <Container>
          <Row>
            <Col xs={2} />
            <Col xs={8} >
              <h1 className="title">Monster Selection</h1>
            </Col>
            <Col xs={2} />
          </Row>
        </Container>
        <a href={dexRoute} className="pokedex-link">
          <img
            src="/images/pokedex-icon.png"
            alt="Pokedex"
            className="pokedex-link-icon clickable-link-icon"
          />
        </a>
      </div>
      <h2>Player {currentPlayer}, choose your monster:</h2>
      <div className="monster-grid">
        {monsters.map((monster, index) => {

          //get the trainer information
          const trainer = gymLeaders.find(e => e.id.toLowerCase() === monster.trainerId.toLowerCase());
          return (
            <button
              key={monster.name}
              onClick={() => handleMonsterSelect(monster)}
              disabled={selectedMonstersIds.includes(monster.id)}
              className="monster-button"
            >
              <div><strong>{monster.name}</strong></div>
              <div>{trainer?.name}</div>
              <img src={monster.image} alt={monster.name} className="monster-image-selection" />
              {(index+1 < 10) ? <div className="shortcut-label">Press {index + 1}</div> : null}
            </button>
          )
        }
        )}
      </div>

      <a href={ROUTES.pokePeru.info} className="info-link-fixed-location">
        <img
          src="/images/info-icon.png"
          alt="Information Link"
          className="info-link-icon clickable-link-icon"
        />
      </a>
    </div>
  );
}