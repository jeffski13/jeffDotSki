import { getTypeColor } from '../typeColors';
import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Dropdown, Form } from 'react-bootstrap';
import { monsters, type Monster } from '../monsters';
import { ElementType } from '../ElementType';
import ROUTES from '../../consts/ROUTES';
import KEYS from '~/consts/KEYS';
import './pokedex.css';
import '../navigation.css';
import '../secondaryPage.css';
import '../infolink.css';
import '../../Inf/mobile-support.css';
import { getMonsterData } from './exportMonsterData';

interface PokedexProps {
  selectedMonsters: Monster[];
  battleRoute: string;
  storageKey: string;
}

export default function PokedexContainer() {
  return (<Pokedex
    selectedMonsters={monsters}
    battleRoute={ROUTES.pokePeru.battle}
    storageKey={KEYS.pokePeru.monsterEditsKey}
  />);
}

export function Pokedex({ selectedMonsters, battleRoute, storageKey }: PokedexProps) {
  // Load edits from localStorage
  const [editData, setEditData] = useState<{ [editID: string]: Monster }>({});
  const [editMode, setEditMode] = useState<{ [editID: string]: boolean }>({});

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      setEditData(JSON.parse(stored));
    }
  }, []);

  const handleEditChange = (editID: string, field: string, value: any) => {
    setEditData(prev => {
      const updated = { ...prev, [editID]: { ...prev[editID], [field]: value } };
      localStorage.setItem(storageKey, JSON.stringify(updated));
      return updated;
    });
  };

  const handleAttackChange = (editID: string, attackKey: 'attack1' | 'attack2', field: string, value: any) => {
    setEditData(prev => {
      const prevAttack = prev[editID]?.[attackKey] || {};
      const updated = {
        ...prev,
        [editID]: {
          ...prev[editID],
          [attackKey]: { ...prevAttack, [field]: value }
        }
      };
      localStorage.setItem(storageKey, JSON.stringify(updated));
      return updated;
    });
  };

  const getMonsterWithEdits = (monster: Monster) => {
    const edit = editData[monster.name];
    if (!edit) return monster;
    // Merge edits into monster
    return {
      ...monster,
      ...edit,
      attack1: { ...monster.attack1, ...(edit.attack1 || {}) },
      attack2: { ...monster.attack2, ...(edit.attack2 || {}) },
    };
  };

  const elementTypeOptions = Object.values(ElementType);
  const attackPhysicalOptions = [
    { label: 'Physical', value: true },
    { label: 'Special', value: false },
  ];
  const attackStyleOptions = [
    {
      label: 'Low Pow, High Acc',
      value: {
        damage: 25,
        powerPoints: 10,
        accuracy: 1,
      }
    },
    {
      label: 'Balanced',
      value: {
        damage: 40,
        powerPoints: 4,
        accuracy: 0.75,
      }
    },
    {
      label: 'High Pow, Low Acc',
      value: {
        damage: 60,
        powerPoints: 2,
        accuracy: 0.5,
      }
    },
  ];

  return (
    <div className="PokePeruSecondaryPage">
      <div className="secondary-page-header">
        <a href={battleRoute} className="back-button">
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
          const monstersWithEditsList = getMonsterWithEdits(monster);
          const statsList = [
            { name: 'Hit Points', nameShort: 'HP', value: monstersWithEditsList.hp, color: '#FF5959', key: 'hp' },
            { name: 'Attack', nameShort: 'ATK', value: monstersWithEditsList.attack, color: '#F5AC78', key: 'attack' },
            { name: 'Defense', nameShort: 'DEF', value: monstersWithEditsList.defense, color: '#FAE078', key: 'defense' },
            { name: 'Special Attack', nameShort: 'SP ATK', value: monstersWithEditsList.specialAttack, color: '#9DB7F5', key: 'specialAttack' },
            { name: 'Special Defense', nameShort: 'SP DEF', value: monstersWithEditsList.specialDefense, color: '#A7DB8D', key: 'specialDefense' },
            { name: 'Speed', nameShort: 'SPD', value: monstersWithEditsList.speed, color: '#FA92B2', key: 'speed' },
          ];
          const totalStats = monstersWithEditsList.hp + monstersWithEditsList.attack + monstersWithEditsList.defense + monstersWithEditsList.specialAttack + monstersWithEditsList.specialDefense + monstersWithEditsList.speed;
          const attackList = [monstersWithEditsList.attack1, monstersWithEditsList.attack2];
          const description = `The ${monstersWithEditsList.inspiration} Pokemon: ${monstersWithEditsList.description}`;
          const isEditing = !!editMode[monstersWithEditsList.name];
          return (
            <li key={monstersWithEditsList.name} className="monster-item" style={{ position: 'relative' }}>
              <Button
                variant={isEditing ? 'success' : 'outline-secondary'}
                size="sm"
                style={{ position: 'absolute', top: 10, right: 10, zIndex: 2 }}
                onClick={() => setEditMode(prev => ({ ...prev, [monstersWithEditsList.name]: !isEditing }))}
              >
                {isEditing ? 'Save' : 'Edit'}
              </Button>
              {isEditing && (
                <Button
                  variant="danger"
                  size="sm"
                  style={{ position: 'absolute', top: 10, right: 70, zIndex: 2 }}
                  onClick={() => {
                    setEditData(prev => {
                      const updated = { ...prev };
                      delete updated[monstersWithEditsList.name];
                      localStorage.setItem(storageKey, JSON.stringify(updated));
                      return updated;
                    });
                  }}
                >
                  Restore
                </Button>
              )}
              <div className="monster-details">
                <div className='monster-details-top'>
                  <img className="monster-details-top-image"
                    src={monstersWithEditsList.image}
                    alt={monstersWithEditsList.name}
                  />
                  <div className="monster-details-top-textinfo" >
                    {/* mobile header */}
                    <Container className="monster-name-types mobile-view">
                      <Row>
                        <Col xs={12}>
                          <h2 className="monster-name-types">
                            {monstersWithEditsList.name}
                          </h2>
                        </Col>
                        <Col xs={12}>
                          <h2 className="monster-name-types" id="primary-type">
                            <span className="monster-types">
                              {isEditing ? (
                                <Dropdown onSelect={val => handleEditChange(monstersWithEditsList.name, 'type', val)}>
                                  <Dropdown.Toggle id="dropdown-type" variant='secondary'>
                                    {monstersWithEditsList.type}
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    {elementTypeOptions.map(type => (
                                      <Dropdown.Item eventKey={type} key={type}>{type}</Dropdown.Item>
                                    ))}
                                  </Dropdown.Menu>
                                </Dropdown>
                              ) : (
                                <span className="type-badge" style={{ backgroundColor: getTypeColor(monstersWithEditsList.type) }}>{monstersWithEditsList.type}</span>
                              )}
                            </span>
                          </h2>
                        </Col>
                        <Col xs={12}>
                          <h2 className="monster-name-types" id="secondary-type">
                            <span className="monster-types">
                              {isEditing ? (
                                <Dropdown onSelect={val => handleEditChange(monstersWithEditsList.name, 'secondType', val === 'None' ? null : val)}>
                                  <Dropdown.Toggle id="dropdown-second-type" variant='secondary'>
                                    {monstersWithEditsList.secondType || 'None'}
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    <Dropdown.Item eventKey="None" key="none">None</Dropdown.Item>
                                    {elementTypeOptions.map(type => (
                                      <Dropdown.Item eventKey={type} key={type}>{type}</Dropdown.Item>
                                    ))}
                                  </Dropdown.Menu>
                                </Dropdown>
                              ) : monstersWithEditsList.secondType && (
                                <span className="type-badge" style={{ backgroundColor: getTypeColor(monstersWithEditsList.secondType) }}>{monstersWithEditsList.secondType}</span>
                              )}
                            </span>
                          </h2>
                        </Col>
                      </Row>
                    </Container>
                    {/* desktop header (name, types) */}
                    <h2 className="monster-name-types desktop-view">
                      {monstersWithEditsList.name}
                      <span className="monster-types">
                        {isEditing ? (
                          <Dropdown onSelect={val => handleEditChange(monstersWithEditsList.name, 'type', val)}>
                            <Dropdown.Toggle variant="secondary" id="dropdown-type-desktop">
                              {monstersWithEditsList.type}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              {elementTypeOptions.map(type => (
                                <Dropdown.Item eventKey={type} key={type}>{type}</Dropdown.Item>
                              ))}
                            </Dropdown.Menu>
                          </Dropdown>
                        ) : (
                          <span className="type-badge" id="primary-type" style={{ backgroundColor: getTypeColor(monstersWithEditsList.type) }}>{monstersWithEditsList.type}</span>
                        )}
                        {isEditing ? (
                          <Dropdown onSelect={val => handleEditChange(monstersWithEditsList.name, 'secondType', val === 'None' ? null : val)}>
                            <Dropdown.Toggle variant="secondary" id="dropdown-second-type-desktop">
                              {monstersWithEditsList.secondType || 'None'}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item eventKey="None" key="none">None</Dropdown.Item>
                              {elementTypeOptions.map(type => (
                                <Dropdown.Item eventKey={type} key={type}>{type}</Dropdown.Item>
                              ))}
                            </Dropdown.Menu>
                          </Dropdown>
                        ) : monstersWithEditsList.secondType && (
                          <span className="type-badge" id="secondary-type" style={{ backgroundColor: getTypeColor(monstersWithEditsList.secondType) }}>{monstersWithEditsList.secondType}</span>
                        )}
                      </span>
                    </h2>
                    {/* inspiration */}
                    <div className="monster-inspiration">
                      {isEditing ? (
                        <Form.Control
                          type="text"
                          value={monstersWithEditsList.inspiration}
                          onChange={e => handleEditChange(monstersWithEditsList.name, 'inspiration', e.target.value)}
                          as="textarea"
                          rows={1}
                          style={{ marginBottom: 4 }}
                        />
                      ) : (<></>)}
                    </div>
                    {/* desktop description */}
                    <div className="desktop-view">
                      {isEditing ? (
                        <Form.Control
                          type="text"
                          value={monstersWithEditsList.description || ''}
                          onChange={e => handleEditChange(monstersWithEditsList.name, 'description', e.target.value)}
                          as="textarea"
                          rows={3}
                        />
                      ) : (
                        <p className="monster-description">
                          {description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                {/* mobile description */}
                <div className='mobile-view'>
                  {isEditing ? (
                    <Form.Control
                      type="text"
                      value={monstersWithEditsList.description || ''}
                      onChange={e => handleEditChange(monstersWithEditsList.name, 'description', e.target.value)}
                      as="textarea"
                      rows={3}
                    />
                  ) : (
                    <div className='monster-details-top'>
                      {description}
                    </div>
                  )}
                </div>
              </div>
              {/* stats */}
              <div className="monster-stats-section monster-details">
                <Container>
                  {statsList.map((stat) => (
                    <Row key={stat.name}>
                      <Col xs={2} sm={3} className="stats-container">
                        <div className="stats-label-container">
                          <span className="stats-label desktop-view">{stat.name}:</span>
                          <span className="stats-label mobile-view">{stat.nameShort}:</span>
                        </div>
                      </Col>
                      <Col xs={10} sm={9}>
                        {isEditing ? (
                          <Form.Control
                            type="number"
                            value={monstersWithEditsList[stat.key]}
                            onChange={e => handleEditChange(monstersWithEditsList.name, stat.key, Number(e.target.value))}
                            style={{ maxWidth: 100 }}
                          />
                        ) : (
                          <div className="stat-bar" title={`${stat.name}: ${stat.value}`}>
                            <div
                              className="bar"
                              style={{
                                width: `${stat.value}%`,
                                backgroundColor: stat.color,
                              }}
                            ></div>
                          </div>
                        )}
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
                      {isEditing ? (
                        <>
                          <Col xs={12} sm={6} className="attack-container">
                            <Dropdown id={`attack-${index}-edit-isPhysical`} onSelect={val => handleAttackChange(monstersWithEditsList.name, `attack${index + 1}` as 'attack1' | 'attack2', 'isPhysical', val === 'true')}>
                              <Dropdown.Toggle variant="secondary" id={`dropdown-physical-${index}`} size="sm">
                                {attack.isPhysical ? 'Physical' : 'Special'}
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                {attackPhysicalOptions.map(opt => (
                                  <Dropdown.Item eventKey={String(opt.value)} key={opt.label}>{opt.label}</Dropdown.Item>
                                ))}
                              </Dropdown.Menu>
                            </Dropdown>
                            <Form.Control
                              id={`attack-${index}-edit-name`}
                              type="text"
                              value={attack.name}
                              onChange={e => handleAttackChange(monstersWithEditsList.name, `attack${index + 1}` as 'attack1' | 'attack2', 'name', e.target.value)}
                              className="attack-name-edit"
                            />
                          </Col>
                          <Col xs={6} sm={3} className="attack-details-container">
                            <Dropdown
                              id={`attack-${index}-edit-attack-power-accuracy`}
                              onSelect={val => {
                                const selected = attackStyleOptions.find(opt => opt.label === val);
                                if (selected) {
                                  const attackId = `attack${index + 1}` as 'attack1' | 'attack2';
                                  //save damage
                                  handleAttackChange(monstersWithEditsList.name, attackId, 'damage', selected.value.damage);
                                  //save powerpoints
                                  handleAttackChange(monstersWithEditsList.name, attackId, 'powerPoints', selected.value.powerPoints);
                                  //save accuracy
                                  handleAttackChange(monstersWithEditsList.name, attackId, 'accuracy', selected.value.accuracy);
                                }
                              }}
                            >
                              <Dropdown.Toggle
                                variant="secondary"
                                id={`dropdown-attack-style-${index}`}
                                size="sm"
                              >
                                {(() => {
                                  const found = attackStyleOptions.find(opt =>
                                    attack.damage === opt.value.damage &&
                                    attack.powerPoints === opt.value.powerPoints &&
                                    attack.accuracy === opt.value.accuracy
                                  );
                                  return found ? found.label : 'Custom';
                                })()}
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                {attackStyleOptions.map(opt => (
                                  <Dropdown.Item eventKey={opt.label} key={opt.label}>{opt.label}</Dropdown.Item>
                                ))}
                              </Dropdown.Menu>
                            </Dropdown>
                          </Col>
                          <Col xs={6} sm={3}>
                            <Dropdown onSelect={val => handleAttackChange(monstersWithEditsList.name, `attack${index + 1}` as 'attack1' | 'attack2', 'type', val)}>
                              <Dropdown.Toggle variant="secondary" id={`dropdown-attack-type-${index}`} size="sm">
                                {attack.type}
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                {elementTypeOptions.map(type => (
                                  <Dropdown.Item eventKey={type} key={type}>{type}</Dropdown.Item>
                                ))}
                              </Dropdown.Menu>
                            </Dropdown>
                          </Col>
                        </>
                      ) : (
                        <>
                          <Col xs={12} sm={4} md={4} className="attack-container">
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
                        </>
                      )}
                    </Row>
                  ))}
                </Container>
              </div>
            </li>
          );
        })}
      </ul>
      <div style={{ textAlign: 'center', margin: '32px 0' }}>
        <Button
          variant="primary"
          size="lg"
          onClick={async () => {
            // Collect all edited monsters
            const editedMonsters = await getMonsterData(editData, selectedMonsters);
            // Export as JSON file
            const blob = new Blob([JSON.stringify(editedMonsters, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'edited-monsters.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }}
        >
          Export Monster Data
        </Button>
      </div>
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