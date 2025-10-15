
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import TvShow from './TvShow';
import { getContentByLanguage, getBrowserLanguage } from '../../../langSupport';
import { tvshows, tvshowsFinished, type TvShowInfo } from './tvshows';
import '../hobbiesStyles.css';

interface TvShowsProps {
  tvShowsList: TvShowInfo[];
  tvShowsFinishedList: TvShowInfo[];
}

export default function TvShowsPage() {
  return (
    <TvShows tvShowsList={tvshows} tvShowsFinishedList={tvshowsFinished} />
  );
}

export function TvShows({ tvShowsList, tvShowsFinishedList }: TvShowsProps) {
  const multiLangContent = {
    es: {
      title: 'Series',
      intro: 'A lo largo de los años he descubierto que conecto con los medios y el arte digital a nivel emocional y espiritual. Veo un episodio cada noche antes de dormir. Estas series han sido una constante en mi vida. Estas son las que estoy viendo hoy en día.',
      past: 'Series Pasadas:',
      pastDesc: 'Y aquí están las series que ya terminé (posiblemente más de una vez). A mi me encantaba cada una de ellas.',
      disclaimer: 'Yo no soy el dueño de este contenido. Por favor, apoya los productos oficiales.'
    },
    default: {
      title: 'Tv Shows',
      intro: 'Over the years I have found that I connect with media and digital art on an emotional and spritual level. I watch one episode every night before I go to bed. I have found these shows over the years to be a constant comfort no matter what stage of life. Here are some things I am currently watching.',
      past: 'Past Shows:',
      pastDesc: 'And here are the shows I have finished (Possibly more than once). I enojoyed the heck out of every one of these.',
      disclaimer: "I don't own any of these images. Please support the official releases."
    }
  };
  const content = getContentByLanguage(multiLangContent, getBrowserLanguage());

  const renderTvShows = (tvshowItem: TvShowInfo, index: number) => {
    return (
      <Col xs={12} sm={6} md={4} key={index}>
        <li>
          <TvShow
            title={tvshowItem.title}
            season={tvshowItem.season}
            thumb={tvshowItem.thumb}
          />
        </li>
      </Col>
    );
  };

  return (
    <div className="aboutmeWrapper">
      <div className="hobbiesSection" >
        <Container className="hobbiesSection">
          <Row>
            <Col sm={12}>
              <h1 className="aboutMeTitle" >{content.title}</h1>
            </Col>
          </Row>
          <Row>
            <Col sm={12} className="hobbiesSectionText">
              <div>{content.intro}</div>
            </Col>
          </Row>
          <ul className="hobbiesContentList" >
            <Row>
              {tvShowsList.map(renderTvShows)}
            </Row>
          </ul>
        </Container>

        <Container className="hobbiesSection">
          <Row className="show-grid">
            <Col sm={12}>
              <div className="hobbiesSectionTitle">{content.past}</div>
            </Col>
          </Row>
          <Row>
            <Col sm={12} className="hobbiesSectionText">
              <div>{content.pastDesc}</div>
            </Col>
          </Row>
          <ul className="hobbiesContentList" >
            <Row>
              {tvShowsFinishedList.map(renderTvShows)}
            </Row>
          </ul>
          <Row className="show-grid BioHobbiesImg">
            <Col sm={8} smOffset={1} className="bioHobbieDisclaimer" >
              <p>*{content.disclaimer}</p>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}