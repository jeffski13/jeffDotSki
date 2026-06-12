import { Container, Row, Col } from "react-bootstrap";
import './styles.css';

interface Song {
  titleJp: string;
  titleEn: string;
  artist: string;
  youtubeId: string;
}

const songs: Song[] = [
  {
    titleJp: '栄光の架橋',
    titleEn: 'Eikō no Kakehashi',
    artist: 'ゆず (Yuzu)',
    youtubeId: 'o5LMGsN_SUw',
  },
  {
    titleJp: 'リーズン',
    titleEn: 'Reason',
    artist: 'ゆず (Yuzu)',
    youtubeId: 'eG-HhsOa7wA',
  },
];

export default function JapaneseMusicPage() {
  return (
    <div className="japaneseMusicCovers">
      <Container fluid className="japaneseMusic_content">
        <h1 className="japaneseMusic_title">
          <span className="japaneseMusic_title-jp">日本語の音楽</span>
          <span className="japaneseMusic_title-en">Japanese Music Covers</span>
        </h1>
        <p className="japaneseMusic_subtitle">My Covers of Japanese Songs</p>
        <Row className="japaneseMusic_videos">
          {songs.map((song) => (
            <Col key={song.youtubeId} xs={12} md={6} className="japaneseMusic_video-col">
              <div className="japaneseMusic_video-card">
                <div className="japaneseMusic_embed-wrapper">
                  <iframe
                    src={`https://www.youtube.com/embed/${song.youtubeId}`}
                    title={song.titleEn}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="japaneseMusic_song-info">
                  <p className="japaneseMusic_song-title-jp">{song.titleJp}</p>
                  <p className="japaneseMusic_song-title-en">{song.titleEn}</p>
                  <p className="japaneseMusic_song-artist">Artist: {song.artist}</p>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}
