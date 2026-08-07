import { useEffect, useRef, useState } from "react";
import { Container } from "react-bootstrap";
import '../../infra/mobile-support.css';
import './styles.css';

const MOBILE_QUERY = '(max-width: 600px)';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches
  );

  useEffect(() => {
    const mql = window.matchMedia(MOBILE_QUERY);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  return isMobile;
}

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
    artist: 'あけぼし (Akeboshi)',
    youtubeId: 't8WFmpqLIPQ',
    dateAdded: '2026-07-30',
  },
];

const sortedSongs = [...songs].sort(
  (a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
);

const CardInfo = ({ song }: { song: Song }) => (
  <div className="japaneseMusic_card-info">
    <p className="japaneseMusic_card-title-jp">{song.titleJp}<span className="japaneseMusic_card-title-en">({song.titleEn})</span></p>
    <p className="japaneseMusic_card-artist">{song.artist}</p>
  </div>
);

export default function JapaneseMusicPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(false);
  const activeSong = sortedSongs[activeIndex];
  const screenRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const selectChannel = (index: number) => {
    setActiveIndex(index);
    setAutoplay(true);
    if (!isMobile) {
      screenRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="japaneseMusicCovers">
      <Container fluid className="japaneseMusic_content">
        <h1 className="japaneseMusic_title">
          <span className="japaneseMusic_title-jp">日本語の音楽</span>
          <span className="japaneseMusic_title-en">Japanese Piano Covers</span>
        </h1>

        <h2 className="japaneseMusic_channels-label">Videos</h2>
        <div className="japaneseMusic_grid">
          {sortedSongs.map((song, index) => {
            const isInlinePlaying = isMobile && autoplay && index === activeIndex;

            if (isInlinePlaying) {
              return (
                <div key={song.youtubeId} className="japaneseMusic_card is-active">
                  <div className="japaneseMusic_thumb-wrapper">
                    <iframe
                      src={`https://www.youtube.com/embed/${song.youtubeId}?autoplay=1&rel=0`}
                      title={song.titleEn}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <CardInfo song={song} />
                </div>
              );
            }

            return (
              <button
                key={song.youtubeId}
                type="button"
                className={`japaneseMusic_card${index === activeIndex ? ' is-active' : ''}`}
                onClick={() => selectChannel(index)}
                aria-pressed={index === activeIndex}
              >
                <div className="japaneseMusic_thumb-wrapper">
                  <img
                    src={`https://img.youtube.com/vi/${song.youtubeId}/mqdefault.jpg`}
                    alt={song.titleEn}
                    loading="lazy"
                  />
                  <span className="japaneseMusic_play-icon" aria-hidden="true">▶</span>
                  {autoplay && index === activeIndex && (
                    <span className="japaneseMusic_playing-badge">Now Playing</span>
                  )}
                </div>
                <CardInfo song={song} />
              </button>
            );
          })}
        </div>
        <hr className="japaneseMusic_divider desktop-view" />
        <div className="japaneseMusic_screen desktop-view" ref={screenRef}>
          <div className="japaneseMusic_screen-frame">
            <div className="japaneseMusic_embed-wrapper">
              <iframe
                key={activeSong.youtubeId}
                src={`https://www.youtube.com/embed/${activeSong.youtubeId}?${autoplay && !isMobile ? 'autoplay=1&' : ''}rel=0`}
                title={activeSong.titleEn}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
          <div className="japaneseMusic_now-playing">
            <div className="japaneseMusic_now-playing-info">
              <p className="japaneseMusic_song-title-jp">{activeSong.titleJp} <span className="japaneseMusic_song-title-en">({activeSong.titleEn})</span></p>
              <p className="japaneseMusic_song-artist">Artist: {activeSong.artist}</p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
