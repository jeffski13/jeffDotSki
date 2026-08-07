import { Container, Row, Col } from "react-bootstrap";
import './styles.css';

interface Song {
  titleJp: string;
  titleEn: string;
  artist: string;
  youtubeId: string;
  dateAdded: string;
}

const songs: Song[] = [
  {
    titleJp: '栄光の架橋',
    titleEn: 'Eikō no Kakehashi',
    artist: 'ゆず (Yuzu)',
    youtubeId: 'o5LMGsN_SUw',
    dateAdded: '2026-03-12',
  },
  {
    titleJp: 'リーズン',
    titleEn: 'Reason',
    artist: 'ゆず (Yuzu)',
    youtubeId: 'eG-HhsOa7wA',
    dateAdded: '2026-06-12',
  },
  {
    titleJp: '廃墟のソファ',
    titleEn: 'Haikyo no Sofa',
    artist: 'Akeboshi (あけぼし)',
    youtubeId: 't8WFmpqLIPQ',
    dateAdded: '2026-07-30',
  },
];

const sortedSongs = [...songs].sort(
  (a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
);

export default function JapaneseMusicPage() {
  return (
    <div className="japaneseMusicCovers">
      <Container fluid className="japaneseMusic_content">
        <h1 className="japaneseMusic_title">
          <span className="japaneseMusic_title-jp">日本語の音楽</span>
          <span className="japaneseMusic_title-en">Japanese Piano Covers</span>
        </h1>
        <p className="japaneseMusic_subtitle"></p>
        <Row className="japaneseMusic_videos">
          {sortedSongs.map((song, index) => (
            <Col key={song.youtubeId} xs={11} className="japaneseMusic_video-col">
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
              {index !== (sortedSongs.length - 1) ? <hr />: <></>}
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}
