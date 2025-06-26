import { Col, Container, Row } from 'react-bootstrap';
import ROUTES from '../../consts/ROUTES';
import './infopage.css';
import '../navigation.css';
import '../secondaryPage.css';

interface InfoPageProps {}

export default function InfoPageContainer() {
  return (<InfoPage />);
}

function InfoPage({ }: InfoPageProps) {
  const pokePeruLink = `http://localhost:5173${ROUTES.pokePeru.battle}`;
  
  return (
    <div className="PokePeruSecondaryPage">
      <div className="secondary-page-header">
        <a href={ROUTES.pokePeru.battle} className="back-button">
          <img src="/images/arrow-left.png" alt="Back" className="back-arrow clickable-link-icon" />
        </a>
        <div className="secondary-page-title-container">
          <h1 className="secondary-page-title">About Pokemon in Peru</h1>
          <img src="/images/info-icon.png" alt="Information Icon" className="secondary-page-icon info-icon" />
        </div>
      </div>
      <div className="project-info">
        <h2>About the Project</h2>
        <p>Pokemon in Peru was an educational project designed to expand students descriptive vocabulary in the following categories:</p>
        <ul>
          <li>Elements</li>
          <li>Names of Animals</li>
          <li>Personality Types</li>
        </ul>
        <p>The students were required to create pokemon (inspired by animals) and a gym leader (with personality traits). The project had an optional battle component with prizes to keep the students invested in the project.</p>
        <div className="infoSection" id="sectionPokemonCreation">
          <h3>Pokemon Creation</h3>
          <p>The students were required to create the following for each monster:</p>
          <ul>
            <li>Name</li>
            <li>Two formal sentences describing the pokemon's character/personality.</li>
            <li>Element Type 1</li>
            <li>Element Type 2 (Optional)</li>
            <li>Stats: HP, Attack, Defense, Special Attack, Special Defense, Speed</li>
            <li>Attack 1 (Name, Power, Power Points, Accuracy)</li>
            <li>Attack 2 (Name, Power, Power Points, Accuracy)</li>
            <li>Original Artwork</li>
          </ul>
          <p>The "description" was an opportunity for the students to utilize more scientific, formal english.</p>
          <Container>
            <Row className="info-images-container">
              <Col sm={11} md={5}>
                <img src="/images/info/info_pokemon_creation_a.png" alt="Back" className="info-image" />
              </Col>
              <Col sm={1}  className="info-arrow-separator" >
                <span>➡️</span>
              </Col>
              <Col sm={11} md={5}>
                <img src="/images/info/info_pokemon_creation_b.png" alt="Back" className="info-image" />
              </Col>
            </Row>
          </Container>
          <p>This data can be found and modified inside of the <strong>monsters.tsx</strong> file.</p>
          <p>The art from the students can be placed inside of the <strong>/public/images/monsters</strong> folder.</p>
        </div>
        <div className="infoSection" id="sectionGymLeaderCreation">
          <h3>Gym Leader Creation</h3>
          <p>The students were required to create the following:</p>
          <ul>
            <li>Name</li>
            <li>Character/personality</li>
            <li>Original Artwork</li>
          </ul>
          <p>The "personality" was an opportunity for the students to utilize vocabulary related to mannerisms and behavior.</p>
          <Container>
            <Row className="info-images-container">
              <Col sm={11} md={5}>
                <img src="/images/info/info_gymleader_creation_a.png" alt="Back" className="info-image" />
              </Col>
              <Col sm={1}  className="info-arrow-separator" >
                <span>➡️</span>
              </Col>
              <Col sm={11} md={5}>
                <img src="/images/info/info_gymleader_creation_b.png" alt="Back" className="info-image" />
              </Col>
            </Row>
          </Container>
          <p>This data can be found and modified inside of the <strong>gymleaders.tsx</strong> file.</p>
          <p>The art from the students can be placed inside of the <strong>/public/images/gymleaders</strong> folder.</p>
          <p>The environments can be placed inside of the <strong>/public/images/perulandscape</strong> folder.</p>
        </div>
        <div className="infoSection" id="sectionBattle">
          <h3>Monster Battle</h3>
          <p>As a celebration of the end of the project, the students were able to battle one another. Students were also given an opportunity to experiment beforehand and run battle simulations to see if their monster would perform well in the heat of battle.</p>
          <Container>
            <Row className="info-images-container">
              <Col sm={11} md={5}>
                <img src="/images/info/info_battle_a.png" alt="Back" className="info-image" />
              </Col>
              <Col sm={1}  className="info-arrow-separator" >
                <span>💥</span>
              </Col>
              <Col sm={11} md={5}>
                <img src="/images/info/info_battle_b.png" alt="Back" className="info-image" />
              </Col>
            </Row>
          </Container>
          <p>The students could choose from the following 3 types of attacks:</p>
          <ul>
            <li>Power: 25, Accuracy: 100%, Power Points: 10</li>
            <li>Power: 40, Accuracy: 75%, Power Points: 4</li>
            <li>Power: 60, Accuracy: 50%, Power Points: 2</li>
          </ul>
          <p>All stats (attack, defense, etc) had to add up to 300 to keep the battles fun and balanced.</p>
        </div>
        <div className="infoSection" id="sectionDIY">
          <h3>Can I Do This With My Students?</h3>
          <p>Absolutely! This game is built with node v20.9.0. The contents can be downloaded from my github repo and then run the following commands inside of the unzipped folder:</p>
          <p>npm install</p>
          <p>npm start</p>
          <p>In the browser, go to <a href={pokePeruLink}>{pokePeruLink}</a></p>
          <p>The <strong>monsters.tsx</strong> and <strong>gymleaders.tsx</strong> files can be modified with the respective monster and gym leader data.</p>
          <p>Images can be added inside of the <strong>/public/images/monsters</strong> and <strong>/public/images/gymleaders</strong> folders with the respective monster and gym leader data.</p>
          <p>New environments can be added inside of <strong>/public/images/perulandscape</strong></p>
          <Container>
            <Row className="info-images-container">
              <Col sm={11} md={5}>
                <img src="/images/info/info_pokemon_creation_dataentry_a.png" alt="Back" className="info-image" />
              </Col>
              <Col sm={1}  className="info-arrow-separator" >
                <span>➡️</span>
              </Col>
              <Col sm={11} md={5}>
                <img src="/images/info/info_pokemon_creation_dataentry_b.png" alt="Back" className="info-image" />
              </Col>
            </Row>
          </Container>
          <br />
          <Container>
            <Row className="info-images-container">
              <Col sm={11} md={5}>
                <img src="/images/info/info_gymleader_creation_dataentry_a.png" alt="Back" className="info-image" />
              </Col>
              <Col sm={1}  className="info-arrow-separator" >
                <span>➡️</span>
              </Col>
              <Col sm={11} md={5}>
                <img src="/images/info/info_gymleader_creation_dataentry_b.png" alt="Back" className="info-image" />
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </div>
  );
}