import ROUTES from '../../consts/ROUTES';
import { getTypeColor } from '../typeColors';
import { Container, Row, Col } from 'react-bootstrap';
import { monsters, type Monster } from '../monsters';
import './pokedex.css';
import '../navigation.css';
import '../secondaryPage.css';
import '../infolink.css';
import '../mobile-support.css';

interface BattleProps {
  selectedMonsters: Monster[];
}

export default function PokedexContainer() {
  return (<Pokedex selectedMonsters={monsters} />);
}
export function Pokedex({
  selectedMonsters,
}: BattleProps) {
  return (
    <div className="PokePeruSecondaryPage">
      <div className="secondary-page-header">
        <a href={ROUTES.pokePeru.battle} className="back-button">
          <img src="/images/arrow-left.png" alt="Back" className="back-arrow clickable-link-icon" />
        </a>
        <Container>
          <Row>
            <Col xs={2} />
            <Col xs={8} >
              <h1 className="title">Pokedex</h1>
            </Col>
            <Col xs={2} />
          </Row>
        </Container>
        <img src="/images/pokedex-icon.png" alt="Pokedex" className="secondary-page-icon" />
      </div>
      <ul className="monster-list">
        {selectedMonsters.map((monster: Monster) => {
          const statsList = [
            {
              name: 'Hit Points',
              value: monster.hp,
              color: '#FF5959'
            },
            {
              name: 'Attack',
              value: monster.attack,
              color: '#F5AC78'
            },
            {
              name: 'Defense',
              value: monster.defense,
              color: '#FAE078'
            },
            {
              name: 'Special Attack',
              value: monster.specialAttack,
              color: '#9DB7F5'
            },
            {
              name: 'Special Defense',
              value: monster.specialDefense,
              color: '#A7DB8D'
            },
            {
              name: 'Speed',
              value: monster.speed,
              color: '#FA92B2'
            }
          ];
          const totalStats =
            monster.hp +
            monster.attack +
            monster.defense +
            monster.specialAttack +
            monster.specialDefense +
            monster.speed;

          const attackList = [
            monster.attack1,
            monster.attack2,
          ];

          const description = `The ${monster.inspiration} Pokemon: ${monster.description}`
          return (
            <li key={monster.name} className="monster-item">
              <div className="monster-details">
                <div className='monster-details-top'>
                  <img src={monster.image} alt={monster.name} className="monster-image-dex" />
                  <div>
                    {/* mobile only header */}
                    <Container className="monster-name-types mobile-view">
                      <Row>
                        <Col xs={12}>
                          <h2 className="monster-name-types">
                            {monster.name}
                          </h2>
                        </Col>
                        <Col xs={12}>
                          <h2 className="monster-name-types">
                            <span className="monster-types">
                              <span
                                className="type-badge"
                                style={{ backgroundColor: getTypeColor(monster.type) }}
                              >
                                {monster.type}
                              </span>
                            </span>
                          </h2>
                        </Col>
                        <Col xs={12}>
                          <h2 className="monster-name-types">
                            <span className="monster-types">
                              {monster.secondType && (
                                  <span
                                    className="type-badge"
                                    style={{ backgroundColor: getTypeColor(monster.secondType) }}
                                  >
                                    {monster.secondType}
                                  </span>
                                )}
                            </span>
                          </h2>
                        </Col>
                      </Row>
                    </Container>
                    {/* desktop header */}
                    <h2 className="monster-name-types desktop-view">
                      {monster.name}
                      <span className="monster-types">
                        <span
                          className="type-badge"
                          style={{ backgroundColor: getTypeColor(monster.type) }}
                        >
                          {monster.type}
                        </span>
                        {monster.secondType && (
                          <span
                            className="type-badge"
                            style={{ backgroundColor: getTypeColor(monster.secondType) }}
                          >
                            {monster.secondType}
                          </span>
                        )}
                      </span>
                    </h2>
                    <p className="monster-description desktop-view">{description}</p>
                  </div>
                </div>
                {/* mobile description */}
                <div className='monster-details-top mobile-view'>
                  <p className="monster-description">{description}</p>
                </div>
              </div>
              <div className="monster-stats-section monster-details">
                <Container>
                  {statsList.map((stat) => (
                    <Row key={stat.name}>
                      <Col xs={12} sm={4} md={3} className="stats-container">
                        <div className="stats-label-container">
                          <span className="stats-label">{stat.name}:</span>
                        </div>
                      </Col>
                      <Col xs={12} sm={8} md={9}>
                        <div className="stat-bar">
                          <div
                            className="bar"
                            style={{
                              width: `${stat.value}%`,
                              backgroundColor: stat.color,
                            }}
                          ></div>
                        </div>
                      </Col>
                    </Row>
                  ))}
                </Container>
              </div>
              <div className="total-statstotal-container monster-details">
                <div className="total-stats">Total Stats: {totalStats}</div>
              </div>
              {/* Attacks Section */}
              <div className="attacks-section monster-details">
                <Container className="attacks-list">
                  {attackList.map((attack, index) => (
                    <Row key={index} className="attack-item">
                      <Col xs={12} sm={4} md={4} className="attack-name-container">
                        <span>
                          {attack.isPhysical ?
                            <img className="attack-type-physical" src="/images/pokedex/attack_physical.png" /> :
                            <img className="attack-type-physical" src="/images/pokedex/attack_special.png" />}
                        </span>
                        <span className="attack-name">{attack.name}</span>
                      </Col>
                      <Col xs={8} sm={5} md={4} className="attack-name-container attack-stats">
                        <span className="attack-name"><strong>Pow:</strong> {attack.damage} <strong>PP:</strong> {attack.powerPoints} <strong>Acc:</strong> {(attack.accuracy * 100)}%</span>
                      </Col>
                      <Col xs={4} sm={3} md={4}>
                        <div
                          className="type-badge type-badge-attack"
                          style={{ backgroundColor: getTypeColor(attack.type) }}
                        >
                          {attack.type}
                        </div>
                      </Col>
                    </Row>
                  ))}
                </Container>
              </div>
            </li>
          );
        })}
      </ul>
      <a href={ROUTES.pokePeru.info}>
        <img
          src="/images/info-icon.png"
          alt="Information Link"
          className="info-link-icon clickable-link-icon"
        />
      </a>
    </div>
  );
}