import { useEffect, useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import BackNavigationConfirmModal from '../BackNavigationConfirmModal';
import './selectionResults.css';
import '../navigationOverride.css';
import '../navigation.css';
import type { Monster } from '../monsters';
import { getTypeColor } from '../typeColors';

interface MonsterSelectionResultsProps {
  monster1: Monster;
  monster2: Monster;
  setBattleClicked: () => void;
}

export default function SelectionResultsScreen({
  monster1,
  monster2,
  setBattleClicked,
}: MonsterSelectionResultsProps) {
  const [showBackConfirm, setShowBackConfirm] = useState(false);

  // Get color for monster1's second type, fallback to a neutral color if null
  const monster1SecondTypeColor = monster1.secondType
    ? getTypeColor(monster1.secondType)
    : getTypeColor(monster1.type);
  // Get color for monster1's second type, fallback to a neutral color if null
  const monster2SecondTypeColor = monster2.secondType
    ? getTypeColor(monster2.secondType)
    : getTypeColor(monster2.type);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === '1') {
        setBattleClicked();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [setBattleClicked]);

  return (
    <div
    className='selection-results-screen'
      style={{
        position: 'relative',
        minHeight: '75vh',
        '--monster1-gradient-color': getTypeColor(monster1.type),
        '--monster1-second-gradient-color': monster1SecondTypeColor,
        '--monster2-gradient-color': getTypeColor(monster2.type),
        '--monster2-second-gradient-color': monster2SecondTypeColor,
      } as React.CSSProperties}
    >
      {/* Top left fade for monster1.type */}
      <div className="selection-results-types-fades"></div>
      <button
        type="button"
        className="back-button"
        onClick={() => setShowBackConfirm(true)}
        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
      >
        <img src="/images/arrow-left.png" alt="Back" className="back-arrow clickable-link-icon" />
      </button>
      <Container>
        <Row>
          <h1 className='selection-results-ui-element'>Selection Results</h1>
        </Row>
        <Row>
          <Col sm={5}>
            {/* User 1 */}
            <div className="monster-trainer-container" style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className='selection-results-ui-element' style={{ marginBottom: 8, fontWeight: 'bold', textAlign: 'center' }}>
                  User 1 chose: {monster1.name}
                </div>
                <div style={{ position: 'relative', width: 220, height: 200 }}>
                  <img
                    src={monster1.trainerImage}
                    alt="Trainer 1"
                    className="trainer-image trainer1"
                  />
                  <img
                    src={monster1.image}
                    alt={monster1.name}
                    className="monster-selected monster1"
                  />
                </div>
              </div>
            </div>
          </Col>
          <Col sm={2}>
            <div className='results-vs' style={{ marginLeft: 'auto', alignSelf: 'flex-start' }}>
              <h2 className='selection-results-ui-element' >VS</h2>
            </div>
          </Col>
          <Col sm={5}>
            {/* User 2 */}
            <div className="monster-trainer-container" style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className='selection-results-ui-element' style={{ marginBottom: 8, fontWeight: 'bold', textAlign: 'center' }}>
                  User 2 chose: {monster2.name}
                </div>
                <div style={{ position: 'relative', width: 220, height: 200 }}>
                  <img
                    src={monster2.trainerImage}
                    alt="Trainer 2"
                    className="trainer-image trainer2"
                  />
                  <img
                    src={monster2.image}
                    alt={monster2.name}
                    className="monster-selected monster2"
                  />
                </div>
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col className="startButtonContainer selection-results-ui-element" xs={12}>
            <Button onClick={setBattleClicked}>Start Battle</Button>
          </Col>
        </Row>
      </Container>
      {showBackConfirm && (<BackNavigationConfirmModal onCancelNavigation={() => setShowBackConfirm(false)}></BackNavigationConfirmModal>)}
    </div>
  );
}