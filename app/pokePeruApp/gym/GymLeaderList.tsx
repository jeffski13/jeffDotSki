import ROUTES from '../../consts/ROUTES';
import { gymLeaders, type GymLeader } from '../gymleaders';
import { monsters, type Monster } from '../monsters';
import './gymleaderlist.css';
import '../navigation.css';
import '../secondaryPage.css';
import '../infolink.css';
import '../../infra/mobile-support.css';
import { Col, Container, Row } from 'react-bootstrap';

interface GymLeaderListProps {
  gymLeaders: GymLeader[];
  monsterList: Monster[];
  battleRoute: string;
}

export default function GymLeaderListContainer() {
  return (<GymLeaderList gymLeaders={gymLeaders} monsterList={monsters} battleRoute={ROUTES.pokePeru.battle} />);
}

export function GymLeaderList({ gymLeaders, monsterList, battleRoute }: GymLeaderListProps) {
  return (
    <div className="PokePeruSecondaryPage">
      <div className="secondary-page-header">
        <a href={battleRoute} className="navigation-icon-button">
          <img src="/images/battle-icon.png" alt="Back" className="battle-icon clickable-link-icon" />
        </a>
        <Container>
          <Row>
            <Col xs={2} />
            <Col xs={8} className="info-p d-grid gap-2" >
              <div className="secondary-page-header-text-container gap-2">
                <h1 className="title">Gym Leaders</h1>
                <img src="/images/gym-icon.png" alt="Gym Leader Icon" className="secondary-page-icon info-icon desktop-view" />
              </div>
            </Col>
            <Col xs={2} />
          </Row>
        </Container>
      </div>
      <ul className="gymleader-list">
        {gymLeaders.map((leader) => {
          const owned = monsterList.filter((m: Monster) => m.trainerId === leader.id);
          return (
            <li key={leader.name} className="gymleader-item">
              <div
                className="gymleader-details"
                style={{
                  backgroundImage: `url(${leader.environmentImage})`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <img src={leader.image} alt={leader.name} className="gymleader-image" />
                  <div style={{ flex: 1 }}>
                    <h2 className="gymleader-name">{leader.name}</h2>
                    <div className="gymleader-biome">{leader.biome}</div>
                  </div>

                  {/* Owned monsters column to the right of the leader image */}
                  {owned.length > 0 && (
                    // Overlapping horizontal stack of owned monster thumbnails positioned on lower-right
                    <div className="gymleader-mons-team-container">
                      {owned.map((mon, idx) => {
                        const computedHeight = 170 - (idx * 80);
                        const computedZIndex = 100 - idx;
                        const computedMarginLeft = idx * -36;
                        return (
                          <img
                            key={mon.id}
                            src={mon.image}
                            alt={mon.name}
                            title={mon.name}
                            style={{
                              height: computedHeight,
                              objectFit: 'cover',
                              marginLeft: computedMarginLeft,
                              zIndex: computedZIndex,
                            }}
                          />)
                      })}
                    </div>
                  )}
                </div>
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