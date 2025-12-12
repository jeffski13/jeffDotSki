
import { useEffect, useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { getBrowserLanguage, getContentByLanguage, type MultiLangContent } from '../../langSupport';
import { v4 as uuidv4 } from 'uuid';
import ROUTES from '../../consts/ROUTES';
import '../../infra/mobile-support.css';
import '../navigation.css';
import '../secondaryPage.css';
import './infopage.css';
import { locationProviderImpl, type PortfolioProps } from '~/aboutMeSection/PortfolioProps';
import AnchorLink, { navigateToAnchor } from '~/infra/anchor/AnchorLink';

export default function InfoPageContainer() {
  return (<InfoPage locationProvider={locationProviderImpl} battleRoute={ROUTES.pokePeru.battle} />);
}

export interface InfoPageProps extends PortfolioProps {
  battleRoute: string;
}

interface TitleLinks {
  aboutProjectTitleLink: string;
  pokemonCreationLink: string;
  battleLink: string;
  gymLeaderCreationLink: string;
  diyLink: string;
  diyNontechnicalTitleLink: string;
  diyTechnicalTitleLink: string;
}

export function InfoPage({ locationProvider, battleRoute }: InfoPageProps) {
  const titleLinks: TitleLinks = {
    aboutProjectTitleLink: 'About-the-Project',
    pokemonCreationLink: 'Monster-Creation',
    battleLink: 'Monster-Battle',
    gymLeaderCreationLink: 'Gym-Leader-Creation',
    diyLink: 'diy',
    diyNontechnicalTitleLink: 'DIY-Easy-Way',
    diyTechnicalTitleLink: 'DIY-Technical-Method',
  }

  // Jumping to anchors by id will work
    const location = locationProvider.useLocation();
    useEffect(() => {
      navigateToAnchor(location?.hash)
    }, [location?.hash])
  

  const blankDataPokemon = `{
 id: '${uuidv4()}',
 name: '',
 trainerId: '',
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
  id: '${uuidv4()}',
  name: "",
  image: "/images/gymleaders/",
  environmentImage: "/images/landscape/",
  biome: "",
}`;
  const pokePeruLink = `http://localhost:5173${ROUTES.pokePeru.battle}`;
  const es: ContentPerLanguage = {
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
    diyDescPreLink: '¡Por supuesto! Este juego está hecho con node v22.20.0. Puedes descargar el contenido (descarga la versión simplificada directamente ',
    diyDescDownloadLink: 'aqui',
    diyDescPostLink: ') y ejecutar los siguientes comandos:',
    browser: 'En el navegador, ve a',
    modify: 'Los archivos siguientes pueden modificarse con los datos respectivos.',
    conjunction: 'y',
    images: 'Las imágenes de monstruos y líderes pueden agregarse en ',
    environments: 'Nuevos entornos pueden agregarse en: ',
  };

  const defaultContent: ContentPerLanguage = {
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
    diyDescPreLink: 'This game is built with node v22.20.0. The contents can be downloaded (simplified direct download ',
    diyDescDownloadLink: 'here',
    diyDescPostLink: ') and then run the following commands inside of the unzipped folder:',
    browser: 'In the browser, go to',
    modify: 'The following files can be modified with the respective monster and gym leader data:',
    conjunction: 'and',
    images: 'Images with the monsters and gym leader data can be placed here: ',
    environments: 'New environments can be added inside of /public/images/landscape',
  };

  const multiLangContent: MultiLangContent = {
    es,
    default: defaultContent
  };
  const content: ContentPerLanguage = getInfoContentByLanguage(multiLangContent, getBrowserLanguage());
  const posterUrl = "https://s3.us-east-2.amazonaws.com/jeff.ski/pokeperu/PokePeruPromoPoster.png";

  return (
    <div className="PokePeruSecondaryPage">
      <div className="secondary-page-header">
        <a href={battleRoute} className="navigation-icon-button">
          <img src="/images/battle-icon.png" alt="Navigate to battle" className="battle-icon clickable-link-icon" />
        </a>
        <Container>
          <Row>
            <Col xs={2} />
            <Col xs={8} className="info-p d-grid gap-2" >
              <div className="secondary-page-header-text-container gap-2">
                <h1 className="title">{content.about}</h1>
                <img src="/images/info-icon.png" alt="Information Icon" className="secondary-page-icon info-icon desktop-view" />
              </div>
            </Col>
            <Col xs={2} />
          </Row>
        </Container>
      </div>
      <div className="project-info">
        <h2 className="toc-title">Table of Contents</h2>
         <ul>
            <li><a href={`#${titleLinks.aboutProjectTitleLink}`} onClick={(e) => { e.preventDefault(); navigateToAnchor(`#${titleLinks.aboutProjectTitleLink}`); }}>{content.aboutProjectTitle}</a></li>
            <li><a href={`#${titleLinks.pokemonCreationLink}`} onClick={(e) => { e.preventDefault(); navigateToAnchor(`#${titleLinks.pokemonCreationLink}`); }}>{content.pokemonCreation}</a></li>
            <li><a href={`#${titleLinks.gymLeaderCreationLink}`} onClick={(e) => { e.preventDefault(); navigateToAnchor(`#${titleLinks.gymLeaderCreationLink}`); }}>{content.gymLeaderCreation}</a></li>
            <li><a href={`#${titleLinks.battleLink}`} onClick={(e) => { e.preventDefault(); navigateToAnchor(`#${titleLinks.battleLink}`); }}>{content.battle}</a></li>
            <li><a href={`#${titleLinks.diyLink}`} onClick={(e) => { e.preventDefault(); navigateToAnchor(`#${titleLinks.diyLink}`); }}>{content.diy}</a></li>
            <ul>
              <li><a href={`#${titleLinks.diyNontechnicalTitleLink}`} onClick={(e) => { e.preventDefault(); navigateToAnchor(`#${titleLinks.diyNontechnicalTitleLink}`); }}>{content.diyNontechnicalTitle}</a></li>
              <li><a href={`#${titleLinks.diyTechnicalTitleLink}`} onClick={(e) => { e.preventDefault(); navigateToAnchor(`#${titleLinks.diyTechnicalTitleLink}`); }}>{content.diyTechnicalTitle}</a></li>
            </ul>
          </ul>
        <h2 id={titleLinks.aboutProjectTitleLink}>{content.aboutProjectTitle}<AnchorLink targetId={titleLinks.aboutProjectTitleLink} /></h2>
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
          <h3 id={titleLinks.pokemonCreationLink}>{content.pokemonCreation}<AnchorLink targetId={titleLinks.pokemonCreationLink} /></h3>
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
          <h3 id={titleLinks.gymLeaderCreationLink}>{content.gymLeaderCreation}<AnchorLink targetId={titleLinks.gymLeaderCreationLink} /></h3>
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
          <p>{content.gymLeaderEnvironmentsModInstructions}<strong>/public/images/landscape</strong></p>
        </div>
        <div className="infoSection" id="sectionBattle">
          <h3 id={titleLinks.battleLink}>{content.battle}<AnchorLink targetId={titleLinks.battleLink} /></h3>
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
          <h3 id={titleLinks.diyLink}>{content.diy}<AnchorLink targetId={titleLinks.diyLink} /></h3>
          <h4 id={titleLinks.diyNontechnicalTitleLink}>{content.diyNontechnicalTitle}<AnchorLink targetId={titleLinks.diyNontechnicalTitleLink} /></h4>
          <p>{content.diyNontechnical}</p>
          <Container>
            <Row className="info-images-container">
              <Col sm={11} md={5}>
                <h5>{content.diyNontechnicalMonsterCreationWorksheetTitle}</h5>
                <img src="/images/info/info_monster_creation_printable.png" alt="Back" className="info-image" />
              </Col>
              <Col sm={11} md={5}>
                <h5>{content.diyNontechnicalGymleaderCreationWorksheetTitle}</h5>
                <img src="/images/info/info_gymleader_creation_printable.png" alt="Back" className="info-image" />
              </Col>
            </Row>
          </Container>
          <h4 id={titleLinks.diyTechnicalTitleLink}>{content.diyTechnicalTitle}<AnchorLink targetId={titleLinks.diyTechnicalTitleLink} /></h4>
          <p>{content.diyDescPreLink}<a href="https://s3.us-east-2.amazonaws.com/jeff.ski/pokeperu/pokeperuproject.zip">{content.diyDescDownloadLink}</a>{content.diyDescPostLink}</p>
          <p><strong>npm install</strong></p>
          <p><strong>npm start</strong></p>
          <p>{content.browser} <a href={pokePeruLink}>{pokePeruLink}</a></p>
          <p>{content.modify}</p>
          <p><strong>monsters.tsx</strong> {content.conjunction} <strong>gymleaders.tsx</strong></p>
          <p>{content.images}: <strong>/public/images/monsters</strong> {content.conjunction} <strong>/public/images/gymleaders</strong></p>
          <p>{content.environments} <strong>/public/images/landscape</strong></p>
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
    <div className="copyable-field">
      <div className="copyable-field-inner">
        <textarea
          readOnly
          value={blankData}
          className="copyable-field-textarea"
        />
        <Button
          onClick={handleCopy}
          className="copyable-field-button"
        >
          {copied ? 'Copied!' : 'Copy'}
        </Button>
      </div>
    </div>
  );
}

export interface ContentPerLanguage {
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

const getInfoContentByLanguage = (content: MultiLangContent, lang: string): ContentPerLanguage => {
  return getContentByLanguage(content, lang)
}