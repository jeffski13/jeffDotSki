import ROUTES from '../../consts/ROUTES';
import { gymLeaders, type GymLeader } from '../gymleaders';
import './gymleaderlist.css';
import '../navigation.css';
import '../secondaryPage.css';
import '../infolink.css';
import { Col, Container, Row } from 'react-bootstrap';

interface GymLeaderListProps {
  gymLeaders: GymLeader[];
}

export default function GymLeaderListContainer() {
  return (<GymLeaderList gymLeaders={gymLeaders} />);
}

function GymLeaderList({ gymLeaders }: GymLeaderListProps) {
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
              <h1 className="title">Gym Leaders</h1>
            </Col>
            <Col xs={2} />
          </Row>
        </Container>
        <img src="/images/gym-icon.png" alt="Pokedex" className="secondary-page-icon" />
      </div>
      <ul className="gymleader-list">
        {gymLeaders.map((leader) => (
          <li key={leader.name} className="gymleader-item">
            <div
              className="gymleader-details"
              style={{
                backgroundImage: `url(${leader.environmentImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '16px',
                minHeight: '180px',
              }}
            >
              <div className='gymleader-details-top'>
                <img src={leader.image} alt={leader.name} className="gymleader-image" />
                <div>
                  <h2 className="gymleader-name">
                    {leader.name}
                  </h2>
                </div>
              </div>
              <div className='gymleader-details-bottom'>
                <div>
                  <h2 className="gymleader-biome">
                    {leader.biome}
                  </h2>
                </div>
              </div>
            </div>
          </li>
        ))}
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