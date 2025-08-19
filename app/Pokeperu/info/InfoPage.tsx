
import React, { useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import ROUTES from '../../consts/ROUTES';
import './infopage.css';
import '../navigation.css';
import '../secondaryPage.css';
import '../mobile-support.css';
import { getContentByLanguage, getBrowserLanguage } from '../../langSupport';

interface InfoPageProps { }

export default function InfoPageContainer() {
  return (<InfoPage />);
}

function InfoPage({ }: InfoPageProps) {
  const blankDataPokemon = `{
 name: '',
 trainer: '/images/monsters/',
 trainerImage: '/images/gymleaders/',
 hp: 0,
 attack: 0,
 defense: 0,
 specialAttack: 0,
 specialDefense: 0,
 speed: 0,
 image: '', 
 description: '',
 inspiration: '',
 type: ElementType.Normal,
 secondType: ElementType.Normal,
 attack1: {
  name: '',
  type: ElementType.Normal,
  damage: 0,
  powerPoints: 0,
  accuracy: 1,
  isPhysical: true
 },
 attack2: {
  name: '',
  type: ElementType.Normal,
  damage: 0,
  powerPoints: 0,
  accuracy: 1,
  isPhysical: false
 }
}`;
  const blankDataGymLeader = `{
  name: "",
  image: "/images/gymleaders/",
  environmentImage: "/images/perulandscape/",
  biome: "",
}`;
  const pokePeruLink = `http://localhost:5173${ROUTES.pokePeru.battle}`;
  const multiLangContent = {
    es: {
      about: 'Sobre Pokémon en Perú',
      aboutProject: 'Sobre el Proyecto',
      projectDesc: 'Pokémon en Perú fue un proyecto educativo diseñado para expandir el vocabulario descriptivo de los estudiantes en las siguientes categorías:',
      elements: 'Elementos',
      animals: 'Nombres de Animales',
      personalities: 'Tipos de Personalidad',
      required: 'Los estudiantes debían crear pokémon (inspirados en animales) y un líder de gimnasio (con rasgos de personalidad). El proyecto tenía un componente de batalla opcional con premios para mantener el interés.',
      region: 'A cada grupo se le asignó una región de Perú (desierto, montañas, costa, etc). Esto les dio inspiración para los tipos de monstruos y líderes de gimnasio que podían crear. También se les evaluó en los nombres en inglés de las regiones/biomas.',
      pokemonCreation: 'Creación de Pokémon',
      pokemonDesc: 'Los estudiantes debían crear lo siguiente para cada monstruo:',
      name: 'Nombre',
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
      diyDesc: '¡Por supuesto! Este juego está hecho con node v20.9.0. Puedes descargar el contenido desde mi github (https://github.com/jeffski13/jeffDotSki) y ejecutar los siguientes comandos:',
      npmInstall: 'npm install',
      npmStart: 'npm start',
      browser: 'En el navegador, ve a',
      modify: 'Los archivos siguientes pueden modificarse con los datos respectivos.',
      conjunction: 'y',
      images: 'Las imágenes de monstruos y líderes pueden agregarse en ',
      environments: 'Nuevos entornos pueden agregarse en: ',
    },
    default: {
      about: 'About Pokemon in Peru',
      aboutProject: 'About the Project',
      projectDesc: 'Pokemon in Peru was an educational project designed to expand students descriptive vocabulary in the following categories:',
      elements: 'Elements',
      animals: 'Names of Animals',
      personalities: 'Personality Types',
      required: 'The students were required to create pokemon (inspired by animals) and a gym leader (with personality traits). The project had an optional battle component with prizes to keep the students invested in the project.',
      region: 'Each group was assigned a region of Peru (desert, moutains, coast, etc). This gave students an inspirational starting point for what types of monsters and gym leaders could be created. They were also tested on the english names of the regions/biomes.',
      pokemonCreation: 'Pokemon Creation',
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
      diyDesc: 'Absolutely! This game is built with node v20.9.0. The contents can be downloaded from my github repo (https://github.com/jeffski13/jeffDotSki) and then run the following commands inside of the unzipped folder:',
      npmInstall: 'npm install',
      npmStart: 'npm start',
      browser: 'In the browser, go to',
      modify: 'The following files can be modified with the respective monster and gym leader data:',
      conjunction: 'and',
      images: 'Images with the monsters and gym leader data can be placed here: ',
      environments: 'New environments can be added inside of /public/images/perulandscape',
    }
  };
  const content = getContentByLanguage(multiLangContent, getBrowserLanguage());
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
              <h1 className="title">{content.about}</h1>
            </Col>
            <Col xs={2} />
          </Row>
        </Container>
        <img src="/images/info-icon.png" alt="Information Icon" className="secondary-page-icon info-icon desktop-view" />
      </div>
      <div className="project-info">
        <h2>{content.aboutProject}</h2>
        <p>{content.projectDesc}</p>
        <ul>
          <li>{content.elements}</li>
          <li>{content.animals}</li>
          <li>{content.personalities}</li>
        </ul>
        <p>{content.required}</p>
        <p>{content.region}</p>
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
          <p>{content.diyDesc}</p>
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
          style={{ position: 'absolute', top: 10, right: 10, padding: '0.3em 1em', borderRadius: 6}}
        >
          {copied ? 'Copied!' : 'Copy'}
        </Button>
      </div>
    </div>
  );
}