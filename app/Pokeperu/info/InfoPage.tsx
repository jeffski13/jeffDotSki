
import { useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import ROUTES from '../../consts/ROUTES';
import '../../Inf/mobile-support.css';
import { getBrowserLanguage, getContentByLanguage, type MultiLangContent } from '../../langSupport';
import '../navigation.css';
import '../secondaryPage.css';
import './infopage.css';
import { v4 as uuidv4 } from 'uuid';

interface InfoPageProps { }

export default function InfoPageContainer() {
  return (<InfoPage />);
}

function InfoPage({ }: InfoPageProps) {
  const blankDataPokemon = `{
 id: '${uuidv4()}',
 name: '',
 trainer: '/images/monsters/',
 trainerImage: '/images/gymleaders/',
 hp: 10,
 attack: 10,
 defense: 10,
 specialAttack: 10,
 specialDefense: 10,
 speed: 10,
 image: '', 
 description: '',
 inspiration: '',
 type: ElementType.Normal,
 secondType: ElementType.Normal,
 attack1: {
  name: '',
  type: ElementType.Normal,
  damage: 40,
  powerPoints: 4,
  accuracy: 0.75,
  isPhysical: true
 },
 attack2: {
  name: '',
  type: ElementType.Normal,
  damage: 40,
  powerPoints: 4,
  accuracy: 0.75,
  isPhysical: true
 }
}`;
  const blankDataGymLeader = `{
  name: "",
  image: "/images/gymleaders/",
  environmentImage: "/images/perulandscape/",
  biome: "",
}`;
  const pokePeruLink = `http://localhost:5173${ROUTES.pokePeru.battle}`;
  const esContent: InfoTextContentPerLanguage = {
    about: 'Pokémon en Perú',
    aboutProjectTitle: 'Sobre el Proyecto',
    goToExperience: '¡Puebalo ',
    goToExperienceLink: 'aqui',
    projectDesc: 'Pokémon en Perú fue un proyecto educativo diseñado para expandir el vocabulario descriptivo de los estudiantes en las siguientes categorías:',
    elements: 'Elementos',
    animals: 'Nombres de Animales',
    personalities: 'Tipos de Personalidad',
    videoNotCompatable: 'Su buscador no funciona con este video.',
    videoMobile: 'https://s3.us-east-2.amazonaws.com/jeff.ski/pokeperu/PokePeruMobileShortLQ_es.mp4',
    videoDesktop: 'https://s3.us-east-2.amazonaws.com/jeff.ski/pokeperu/PokePeruShortLQ_es.mp4',
    required: 'Los estudiantes debían crear pokémon (inspirados en animales) y un líder de gimnasio (con rasgos de personalidad). El proyecto tenía un componente de batalla opcional con premios para mantener el interés.',
    region: 'A cada grupo se le asignó una región de Perú (desierto, montañas, costa, etc). Esto les dio inspiración para los tipos de monstruos y líderes de gimnasio que podían crear. También se les evaluó en los nombres en inglés de las regiones/biomas.',
    pokemonCreation: 'Creación de Pokémon',
    pokemonDesc: 'Los estudiantes debían crear lo siguiente para cada monstruo:',
    name: 'Nombre',
    desc: 'Dos oraciones formales que describe la personalidad del monstruo.',
    type1: 'Tipo de Elemento 1',
    type2: 'Tipo de Elemento 2 (Opcional)',
    stats: 'Estadísticas: Puntos de Salud, Ataque, Defensa, Ataque Especial, Defensa Especial, Velocidad',
    attack1: 'Ataque 1 (Nombre, Poder, Puntos de Poder, Precisión)',
    attack2: 'Ataque 2 (Nombre, Poder, Puntos de Poder, Precisión)',
    art: 'Arte Original',
    descNote: 'La "descripción" era una oportunidad para que los estudiantes usaran inglés más formal y científico.',
    monsterDataInstructions: 'Esta información se puede encontrar y estar modificada en este archivo: ',
    artDataInstructions: 'El arte de los estudiantes se puede poner en la carpeta: ',
    gymLeaderCreation: 'Creación de Líder de Gimnasio',
    gymLeaderDesc: 'Los estudiantes debían crear lo siguiente:',
    gymLeaderName: 'Nombre',
    gymLeaderPersonality: 'Carácter/personalidad',
    gymLeaderArt: 'Arte Original',
    gymLeaderNote: 'La "personalidad" era una oportunidad para usar vocabulario sobre comportamiento y modales.',
    gymLeaderDataModInstructions: 'Los datos de los líderes de gymnasio se pueden encontrar y modificar en el siguiente archivo: ',
    gymLeaderImagesModInstructions: 'El art de los estudiantes se pueden estar puestas en la siguiente carpeta: ',
    gymLeaderEnvironmentsModInstructions: 'Los ambientes se pueden estar puestos en la siguiente carpeta: ',
    battle: 'Batalla de Monstruos',
    battleDesc: 'Como celebración del final del proyecto, los estudiantes pudieron batallar entre sí. También pudieron experimentar y simular batallas para ver si su monstruo funcionaba bien.',
    attacks: 'Los estudiantes podían elegir entre los siguientes 3 tipos de ataques:',
    attackA: 'Poder: 25, Precisión: 100%, Puntos de Poder: 10',
    attackB: 'Poder: 40, Precisión: 75%, Puntos de Poder: 4',
    attackC: 'Poder: 60, Precisión: 50%, Puntos de Poder: 2',
    statsNote: 'Todas las estadísticas debían sumar 300 para mantener el equilibrio.',
    diy: '¿Puedo hacer esto con mis estudiantes?',
    diyNontechnicalTitle: 'Manera Facil',
    diyNontechnical: 'Puedes imprimir la siguiente ficha para la creación de los monstruos. Te recomiendo que les des a tus estudiantes una región de tu país como inspriración.',
    diyNontechnicalMonsterCreationWorksheetTitle: 'Ficha de Creación de Monstruos',
    diyNontechnicalGymleaderCreationWorksheetTitle: 'Ficha de Creación de Líderes de Gimnasio',
    diyTechnicalTitle: 'Manera Técnica',
    diyDescPreLink: '¡Por supuesto! Este juego está hecho con node v20.9.0. Puedes descargar el contenido desde mi github en https://github.com/jeffski13/jeffDotSki(descargalo directamente ',
    diyDescDownloadLink: 'aqui',
    diyDescPostLink: ') y ejecutar los siguientes comandos:',
    browser: 'En el navegador, ve a',
    modify: 'Los archivos siguientes pueden modificarse con los datos respectivos.',
    conjunction: 'y',
    images: 'Las imágenes de monstruos y líderes pueden agregarse en ',
    environments: 'Nuevos entornos pueden agregarse en: ',
  };

  const defaultContent: InfoTextContentPerLanguage = {
    about: 'Pocket Monsters in Peru',
    aboutProjectTitle: 'About the Project',
    goToExperience: 'Try it out ',
    goToExperienceLink: 'here',
    projectDesc: 'Pocket Monsters in Peru was an educational project designed to expand students descriptive vocabulary in the following categories:',
    elements: 'Elements',
    animals: 'Names of Animals',
    personalities: 'Personality Types',
    videoNotCompatable: 'Your browser does not support the video tag.',
    videoMobile: 'https://s3.us-east-2.amazonaws.com/jeff.ski/pokeperu/PokePeruMobileShortLQ.mp4',
    videoDesktop: 'https://s3.us-east-2.amazonaws.com/jeff.ski/pokeperu/PokePeruShortLQ.mp4',
    required: 'The students were required to create pokemon (inspired by animals) and a gym leader (with personality traits). The project had an optional battle component with prizes to keep the students invested in the project.',
    region: 'Each group was assigned a region of Peru (desert, moutains, coast, etc). This gave students an inspirational starting point for what types of monsters and gym leaders could be created. They were also tested on the english names of the regions/biomes.',
    pokemonCreation: 'Monster Creation',
    pokemonDesc: 'The students were required to create the following for each monster:',
    name: 'Name',
    desc: 'Two formal sentences describing the pokemon\'s character/personality.',
    type1: 'Element Type 1',
    type2: 'Element Type 2 (Optional)',
    stats: 'Stats: HP, Attack, Defense, Special Attack, Special Defense, Speed',
    attack1: 'Attack 1 (Name, Power, Power Points, Accuracy)',
    attack2: 'Attack 2 (Name, Power, Power Points, Accuracy)',
    art: 'Original Artwork',
    descNote: 'The "description" was an opportunity for the students to utilize more scientific, formal english.',
    monsterDataInstructions: 'This data can be found and modified inside of the file: ',
    artDataInstructions: 'The art from the students can be placed inside of the folder: ',
    gymLeaderCreation: 'Gym Leader Creation',
    gymLeaderDesc: 'The students were required to create the following:',
    gymLeaderName: 'Name',
    gymLeaderPersonality: 'Character/personality',
    gymLeaderArt: 'Original Artwork',
    gymLeaderNote: 'The "personality" was an opportunity for the students to utilize vocabulary related to mannerisms and behavior.',
    gymLeaderDataModInstructions: 'This data can be found and modified inside of the following file: ',
    gymLeaderImagesModInstructions: 'The art from the students can be placed inside of the following folder: ',
    gymLeaderEnvironmentsModInstructions: 'The environments can be placed inside of the following folder: ',
    battle: 'Monster Battle',
    battleDesc: 'As a celebration of the end of the project, the students were able to battle one another. Students were also given an opportunity to experiment beforehand and run battle simulations to see if their monster would perform well in the heat of battle.',
    attacks: 'The students could choose from the following 3 types of attacks:',
    attackA: 'Power: 25, Accuracy: 100%, Power Points: 10',
    attackB: 'Power: 40, Accuracy: 75%, Power Points: 4',
    attackC: 'Power: 60, Accuracy: 50%, Power Points: 2',
    statsNote: 'All stats (attack, defense, etc) had to add up to 300 to keep the battles fun and balanced.',
    diy: 'Can I Do This With My Students?',
    diyNontechnicalTitle: 'Easy Way',
    diyNontechnical: 'You can print the following sheets for monster and gym leader creation. I recommend that you give your students a country region as an inspirational starting point.',
    diyNontechnicalMonsterCreationWorksheetTitle: 'Monster Creation Worksheet',
    diyNontechnicalGymleaderCreationWorksheetTitle: 'Gym Leader Creation Worksheet',
    diyTechnicalTitle: 'Technical Method (with Battle Simulation and Pokedex)',
    diyDescPreLink: 'This game is built with node v20.9.0. The contents can be downloaded from my github repo at https://github.com/jeffski13/jeffDotSki (direct download ',
    diyDescDownloadLink: 'here',
    diyDescPostLink: ') and then run the following commands inside of the unzipped folder:',
    browser: 'In the browser, go to',
    modify: 'The following files can be modified with the respective monster and gym leader data:',
    conjunction: 'and',
    images: 'Images with the monsters and gym leader data can be placed here: ',
    environments: 'New environments can be added inside of /public/images/perulandscape',
  };

  const multiLangContent: MultiLangContent = {
    es: esContent,
    default: defaultContent
  };
  const content: InfoTextContentPerLanguage = getInfoContentByLanguage(multiLangContent, getBrowserLanguage());
  const posterUrl = "https://s3.us-east-2.amazonaws.com/jeff.ski/pokeperu/PokePeruPromoPoster.png";

  return (
    <div className="PokePeruSecondaryPage">
      <div className="secondary-page-header">
        <button
          type="button"
          className="back-button"
          onClick={() => window.history.back()}
          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
          aria-label="Go back"
        >
          <img src="/images/arrow-left.png" alt="Back" className="back-arrow clickable-link-icon" />
        </button>
        <Container>
          <Row>
            <Col xs={2} />
            <Col xs={8} >
              <h1 className="title">{content.about}</h1>
            </Col>
            <Col xs={2} />
          </Row>
        </Container>
        <img src="/images/info-icon.png" alt="Information Icon" className="secondary-page-icon info-icon desktop-view" />
      </div>
      <div className="project-info">
        <h2>{content.aboutProjectTitle}</h2>
        <p>{content.goToExperience} <a href={ROUTES.pokePeru.battle}>{content.goToExperienceLink}</a>!</p>
        <p>{content.projectDesc}</p>
        <ul>
          <li>{content.elements}</li>
          <li>{content.animals}</li>
          <li>{content.personalities}</li>
        </ul>
        <p>
          <div style={{ textAlign: 'center' }}>
            <video
              className="promo-video desktop-view"
              width="50%"
              controls
              muted={true}
              poster={posterUrl}
            >
              <source src={content.videoDesktop} type="video/mp4" />
              {content.videoNotCompatable}
            </video>
            <video
              className="promo-video mobile-view"
              width="100%"
              controls
              muted={true}
              poster={posterUrl}
            >
              <source src={content.videoMobile} type="video/mp4" />
              {content.videoNotCompatable}
            </video>
          </div>
        </p>
        <p>{content.required}</p>
        <p>{content.region}</p>
        {/* Video demonstration at the bottom of project-info */}
        <div className="infoSection" id="sectionPokemonCreation">
          <h3>{content.pokemonCreation}</h3>
          <p>{content.pokemonDesc}</p>
          <ul>
            <li>{content.name}</li>
            <li>{content.desc}</li>
            <li>{content.type1}</li>
            <li>{content.type2}</li>
            <li>{content.stats}</li>
            <li>{content.attack1}</li>
            <li>{content.attack2}</li>
            <li>{content.art}</li>
          </ul>
          <p>{content.descNote}</p>
          <Container>
            <Row className="info-images-container">
              <Col sm={11} md={5}>
                <img src="/images/info/info_pokemon_creation_a.png" alt="Back" className="info-image" />
              </Col>
              <Col sm={1} className="info-arrow-separator" >
                <span>➡️</span>
              </Col>
              <Col sm={11} md={5}>
                <img src="/images/info/info_pokemon_creation_b.png" alt="Back" className="info-image" />
              </Col>
            </Row>
          </Container>
          <p>{content.monsterDataInstructions}<strong>monsters.tsx</strong></p>
          <p>{content.artDataInstructions}<strong>/public/images/monsters</strong></p>
        </div>
        <div className="infoSection" id="sectionGymLeaderCreation">
          <h3>{content.gymLeaderCreation}</h3>
          <p>{content.gymLeaderDesc}</p>
          <ul>
            <li>{content.gymLeaderName}</li>
            <li>{content.gymLeaderPersonality}</li>
            <li>{content.gymLeaderArt}</li>
          </ul>
          <p>{content.gymLeaderNote}</p>
          <Container>
            <Row className="info-images-container">
              <Col sm={11} md={5}>
                <img src="/images/info/info_gymleader_creation_a.png" alt="Back" className="info-image" />
              </Col>
              <Col sm={1} className="info-arrow-separator" >
                <span>➡️</span>
              </Col>
              <Col sm={11} md={5}>
                <img src="/images/info/info_gymleader_creation_b.png" alt="Back" className="info-image" />
              </Col>
            </Row>
          </Container>
          <p>{content.gymLeaderDataModInstructions}<strong>gymleaders.tsx</strong></p>
          <p>{content.gymLeaderImagesModInstructions}<strong>/public/images/gymleaders</strong></p>
          <p>{content.gymLeaderEnvironmentsModInstructions}<strong>/public/images/perulandscape</strong></p>
        </div>
        <div className="infoSection" id="sectionBattle">
          <h3>{content.battle}</h3>
          <p>{content.battleDesc}</p>
          <Container>
            <Row className="info-images-container">
              <Col sm={11} md={5}>
                <img src="/images/info/info_battle_a.png" alt="Back" className="info-image" />
              </Col>
              <Col sm={1} className="info-arrow-separator" >
                <span>💥</span>
              </Col>
              <Col sm={11} md={5}>
                <img src="/images/info/info_battle_b.png" alt="Back" className="info-image" />
              </Col>
            </Row>
          </Container>
          <p>{content.attacks}</p>
          <ul>
            <li>{content.attackA}</li>
            <li>{content.attackB}</li>
            <li>{content.attackC}</li>
          </ul>
          <p>{content.statsNote}</p>
        </div>
        <div className="infoSection" id="sectionDIY">
          <h3>{content.diy}</h3>
          <h4>{content.diyNontechnicalTitle}</h4>
          <p>{content.diyNontechnical}</p>
          <Container>
            <Row className="info-images-container">
              <Col sm={11} md={5}>
                <h4>{content.diyNontechnicalMonsterCreationWorksheetTitle}</h4>
                <img src="/images/info/info_monster_creation_printable.png" alt="Back" className="info-image" />
              </Col>
              <Col sm={11} md={5}>
                <h4>{content.diyNontechnicalGymleaderCreationWorksheetTitle}</h4>
                <img src="/images/info/info_gymleader_creation_printable.png" alt="Back" className="info-image" />
              </Col>
            </Row>
          </Container>
          <h4>{content.diyTechnicalTitle}</h4>
          <p>{content.diyDescPreLink}<a href="https://github.com/jeffski13/jeffDotSki/archive/refs/heads/master.zip">{content.diyDescDownloadLink}</a>{content.diyDescPostLink}</p>
          <p><strong>npm install</strong></p>
          <p><strong>npm start</strong></p>
          <p>{content.browser} <a href={pokePeruLink}>{pokePeruLink}</a></p>
          <p>{content.modify}</p>
          <p><strong>monsters.tsx</strong> {content.conjunction} <strong>gymleaders.tsx</strong></p>
          <p>{content.images}: <strong>/public/images/monsters</strong> {content.conjunction} <strong>/public/images/gymleaders</strong></p>
          <p>{content.environments} <strong>/public/images/perulandscape</strong></p>
          <Container>
            <Row className="info-images-container">
              <Col sm={11} md={5}>
                <img src="/images/info/info_pokemon_creation_dataentry_a.png" alt="Back" className="info-image" />
              </Col>
              <Col sm={1} className="info-arrow-separator" >
                <span>➡️</span>
              </Col>
              <Col sm={11} md={5}>
                <img src="/images/info/info_pokemon_creation_dataentry_b.png" alt="Back" className="info-image" />
              </Col>
            </Row>
            <Row className="info-blank-pokemon-data">
              <Col sm={12}>
                <CopyableField blankData={blankDataPokemon} />
              </Col>
            </Row>
          </Container>
          <br />
          <Container>
            <Row className="info-images-container">
              <Col sm={11} md={5}>
                <img src="/images/info/info_gymleader_creation_dataentry_a.png" alt="Back" className="info-image" />
              </Col>
              <Col sm={1} className="info-arrow-separator" >
                <span>➡️</span>
              </Col>
              <Col sm={11} md={5}>
                <img src="/images/info/info_gymleader_creation_dataentry_b.png" alt="Back" className="info-image" />
              </Col>
            </Row>
            <Row className="info-blank-pokemon-data">
              <Col sm={12}>
                <CopyableField blankData={blankDataGymLeader} />
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </div>
  );
}

// copyable data field
interface CopyableFieldProps {
  blankData: string;
}

function CopyableField({ blankData }: CopyableFieldProps) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(blankData);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (e) {
      setCopied(false);
    }
  };

  return (
    <div style={{ margin: '1.5em 0', textAlign: 'center' }}>
      <div style={{ position: 'relative', maxWidth: 600, margin: '0 auto' }}>
        <textarea
          readOnly
          value={blankData}
          style={{ width: '100%', minHeight: 220, fontFamily: 'monospace', fontSize: 14, borderRadius: 8, border: '1px solid #bbb', padding: 12, resize: 'vertical', background: '#f9f9f9' }}
        />
        <Button
          onClick={handleCopy}
          style={{ position: 'absolute', top: 10, right: 10, padding: '0.3em 1em', borderRadius: 6 }}
        >
          {copied ? 'Copied!' : 'Copy'}
        </Button>
      </div>
    </div>
  );
}

export interface InfoTextContentPerLanguage {
  about: string;
  aboutProjectTitle: string;
  goToExperience: string;
  goToExperienceLink: string;
  projectDesc: string;
  elements: string;
  animals: string;
  personalities: string;
  videoNotCompatable: string;
  videoMobile: string;
  videoDesktop: string;
  required: string;
  region: string;
  pokemonCreation: string;
  pokemonDesc: string;
  name: string;
  desc: string;
  type1: string;
  type2: string;
  stats: string;
  attack1: string;
  attack2: string;
  art: string;
  descNote: string;
  monsterDataInstructions: string;
  artDataInstructions: string;
  gymLeaderCreation: string;
  gymLeaderDesc: string;
  gymLeaderName: string;
  gymLeaderPersonality: string;
  gymLeaderArt: string;
  gymLeaderNote: string;
  gymLeaderDataModInstructions: string;
  gymLeaderImagesModInstructions: string;
  gymLeaderEnvironmentsModInstructions: string;
  battle: string;
  battleDesc: string;
  attacks: string;
  attackA: string;
  attackB: string;
  attackC: string;
  statsNote: string;
  diy: string;
  diyNontechnicalTitle: string;
  diyNontechnical: string;
  diyNontechnicalMonsterCreationWorksheetTitle: string;
  diyNontechnicalGymleaderCreationWorksheetTitle: string;
  diyTechnicalTitle: string;
  diyDescPreLink: string;
  diyDescDownloadLink: string;
  diyDescPostLink: string;
  browser: string;
  modify: string;
  conjunction: string;
  images: string;
  environments: string;
}

const getInfoContentByLanguage = (content: MultiLangContent, lang: string): InfoTextContentPerLanguage => {
  return getContentByLanguage(content, lang)
}