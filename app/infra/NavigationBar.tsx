import { Navbar, NavDropdown, Nav, Button } from 'react-bootstrap';
import ROUTES from '../consts/ROUTES';
import './styles.css';
import { getContentByLanguage, getBrowserLanguage, type MultiLangContent } from '../langSupport';
import { THEME, type ThemeManager } from './darkTheme';
import { useEffect, useState } from 'react';

interface NavigationBarProps {
    themeManager: ThemeManager;
}

export interface ContentPerLanguage {
    teaching: string;
    teachingShort: string;
    teachingPortfolio: string;
    teachingResume: string;
    teachingPokePeru: string;
    softwareEngineering: string;
    softwareEngineeringShort: string;
    softwareEngineeringPortfolio: string;
    softwareEngineerResume: string;
    japanese: string;
    japaneseShort: string;
    japaneseCurrentSong: string;
    japaneseBible: string;
    japaneseMusicCovers: string;
    japaneseParenthesesToFurigana: string;
    aboutMe: string;
    aboutMeShort: string;
    aboutBio: string;
    aboutTvShows: string;
    aboutDrawing: string;
    aboutTravel: string;
    more: string;
    allLinks: string;
    themeDark: string;
    themeLight: string;
}

export const es: ContentPerLanguage = {
    teaching: 'Profesor de Inglés',
    teachingShort: 'Profesor',
    teachingPortfolio: 'Portafolio de Profesor de Inglés',
    teachingResume: 'Currículum de Profesor de Inglés',
    teachingPokePeru: 'Pokemon En Perú',
    softwareEngineering: 'Ingeniería de Software',
    softwareEngineeringShort: 'Software',
    softwareEngineeringPortfolio: 'Portafolio de Ingeniería de Software',
    softwareEngineerResume: 'Currículum de Ingeniero de Software',
    japanese: 'Estudios de Japonés',
    japaneseShort: 'Japonés',
    japaneseCurrentSong: 'Letras para Estudiar',
    japaneseBible: 'Biblia en Japonés',
    japaneseMusicCovers: 'Música Japonesa',
    japaneseParenthesesToFurigana: 'Transformación de Parenthese a Furigana',
    aboutMe: 'Sobre Mí',
    aboutMeShort: 'Sobre',
    aboutBio: 'Biografía',
    aboutTvShows: 'Programas de Televisión',
    aboutDrawing: 'Dibujos',
    aboutTravel: 'Viajes',
    more: 'Más',
    allLinks: 'Todos los enlaces',
    themeDark: 'Modo Oscuro',
    themeLight: 'Modo Claro',
};
export const defaultText: ContentPerLanguage = {
    teaching: 'English Teacher',
    teachingShort: 'Teaching',
    teachingPortfolio: 'English Teacher Portfolio',
    teachingResume: 'English Teacher Resume',
    teachingPokePeru: 'Pokémon In Peru',
    softwareEngineering: 'Software Engineering',
    softwareEngineeringShort: 'Software',
    softwareEngineeringPortfolio: 'Software Engineering Portfolio',
    softwareEngineerResume: 'Software Engineer Resume',
    japanese: 'Japanese Studies',
    japaneseShort: 'Japanese',
    japaneseCurrentSong: 'Lyrics For Studying',
    japaneseBible: 'Bible In Japanese',
    japaneseMusicCovers: 'Japanese Music Covers',
    japaneseParenthesesToFurigana: 'Parenthese To Furigana Transformation',
    aboutMe: 'About Me',
    aboutMeShort: 'About',
    aboutBio: 'Bio',
    aboutTvShows: 'TV Shows',
    aboutDrawing: 'Drawings',
    aboutTravel: 'Travel',
    more: 'More',
    allLinks: 'All Links',
    themeDark: 'Dark Mode',
    themeLight: 'Light Mode',
};

export default function NavigationBar({ themeManager }: NavigationBarProps) {
    const multiLangContent: MultiLangContent = {
        es,
        default: defaultText
    };
    const content: ContentPerLanguage = getContentByLanguage(multiLangContent, getBrowserLanguage());

    const [theme, setTheme] = useState<THEME>(themeManager.getCurrentTheme());
    useEffect(() => {
        themeManager.setupDarkMode();
    }, []);

    const darkModeButtonText = (theme === THEME.DARK) ? content.themeLight : content.themeDark;
    const darkModeButtonIcon = (theme === THEME.DARK) ? '/images/darkMode/dark-mode-light.png' : '/images/darkMode/dark-mode-dark.png';

    return (
        <>
            <Navbar className="jeffdotski-navbar" bg="dark" variant="dark" fixed="top" collapseOnSelect expand="sm">
                <Nav.Link href="/">
                    <Navbar.Brand className="brand">jeff.ski</Navbar.Brand>
                </Nav.Link>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse>
                    <Nav className="mr-auto">
                        <NavDropdown title={<><span className="nav-title-full">{content.teaching}</span><span className="nav-title-short">{content.teachingShort}</span></>} id="navigationbar-teaching">
                            <NavDropdown.Item href={ROUTES.aboutMe.teacherPortfolio}>{content.teachingPortfolio}</NavDropdown.Item>
                            <NavDropdown.Item href={ROUTES.external.resume.teacherEnglish} target="_blank" rel="noopener noreferrer">{content.teachingResume}</NavDropdown.Item>
                            <NavDropdown.Item href={ROUTES.pokePeru.battle}>{content.teachingPokePeru}</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title={<><span className="nav-title-full">{content.softwareEngineering}</span><span className="nav-title-short">{content.softwareEngineeringShort}</span></>} id="navigationbar-software-engineering">
                            <NavDropdown.Item href={ROUTES.aboutMe.techPortfolio}>{content.softwareEngineeringPortfolio}</NavDropdown.Item>
                            <NavDropdown.Item href={ROUTES.external.resume.softwareEngineer} target="_blank" rel="noopener noreferrer">{content.softwareEngineerResume}</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title={<><span className="nav-title-full">{content.japanese}</span><span className="nav-title-short">{content.japaneseShort}</span></>} id="navigationbar-japanese-studies">
                            <NavDropdown.Item href={ROUTES.japanese.japaneseMusicCovers}>{content.japaneseMusicCovers}</NavDropdown.Item>
                            <NavDropdown.Item href={ROUTES.japanese.japaneseReadings}>{content.japaneseBible}</NavDropdown.Item>
                            <NavDropdown.Item href={ROUTES.japanese.japanesePracticeLyrics}>{content.japaneseCurrentSong}</NavDropdown.Item>
                            <NavDropdown.Item href={ROUTES.japanese.japaneseParenthesesToFurigana}>{content.japaneseParenthesesToFurigana}</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title={<><span className="nav-title-full">{content.aboutMe}</span><span className="nav-title-short">{content.aboutMeShort}</span></>} id="navigationbar-japanese-studies">
                            <NavDropdown.Item href={ROUTES.aboutMe.bio}>{content.aboutBio}</NavDropdown.Item>
                            <NavDropdown.Item href={ROUTES.aboutMe.tvShows}>{content.aboutTvShows}</NavDropdown.Item>
                            <NavDropdown.Item href={ROUTES.aboutMe.drawing}>{content.aboutDrawing}</NavDropdown.Item>
                            <NavDropdown.Item href={ROUTES.external.instagram}>{content.aboutTravel}</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Nav className="nav-more">
                        <NavDropdown title={content.more} id="navigationbar-more">
                            <NavDropdown.Item href={ROUTES.sitemap}>{content.allLinks}</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <div className="more-dropdown-grid">
                                <Button
                                    variant="outline-none"
                                    className="darkMode-button"
                                    onClick={() => {
                                        themeManager.toggleTheme();
                                        setTheme(themeManager.getCurrentTheme());
                                    }}
                                >
                                    <img className="darkMode-icon" src={darkModeButtonIcon} alt={`${darkModeButtonText} mode`} />
                                    <span className="darkMode-button-text">{darkModeButtonText}</span>
                                </Button>
                            </div>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </>
    );
}
