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
    softwareEngineering: string;
    softwareEngineeringShort: string;
    japaneseStudies: string;
    japaneseStudiesShort: string;
    aboutMe: string;
    more: string;
    englishTeacherResume: string;
    englishTeacherPortfolio: string;
    pokePeru: string;
    softwareEngineeringPortfolio: string;
    softwareEngineerResume: string;
    currentSong: string;
    bibleInJapanese: string;
    japaneseMusicCovers: string;
    bio: string;
    tvShows: string;
    drawing: string;
    travel: string;
    allLinks: string;
    themeDark: string;
    themeLight: string;
}

export default function NavigationBar({ themeManager }: NavigationBarProps) {
    const es: ContentPerLanguage = {
        teaching: 'Profesor de Inglés',
        teachingShort: 'Profesor',
        softwareEngineering: 'Ingeniería de Software',
        softwareEngineeringShort: 'Software',
        japaneseStudies: 'Estudios de Japonés',
        japaneseStudiesShort: 'Japonés',
        aboutMe: 'Sobre Mí',
        more: 'Más',
        englishTeacherResume: 'Currículum de Profesor de Inglés',
        englishTeacherPortfolio: 'Portafolio de Profesor de Inglés',
        pokePeru: 'Pokemon En Perú',
        softwareEngineeringPortfolio: 'Portafolio de Ingeniería de Software',
        softwareEngineerResume: 'Currículum de Ingeniero de Software',
        currentSong: 'Letras para Estudiar',
        bibleInJapanese: 'Biblia en Japonés',
        japaneseMusicCovers: 'Música Japonesa',
        bio: 'Biografía',
        tvShows: 'Programas de Televisión',
        drawing: 'Dibujos',
        travel: 'Viajes',
        allLinks: 'Todos los enlaces',
        themeDark: 'Modo Oscuro',
        themeLight: 'Modo Claro',
    };
    const defaultText: ContentPerLanguage = {
        teaching: 'English Teacher',
        teachingShort: 'Teaching',
        softwareEngineering: 'Software Engineering',
        softwareEngineeringShort: 'Software',
        japaneseStudies: 'Japanese Studies',
        japaneseStudiesShort: 'Japanese',
        aboutMe: 'About Me',
        more: 'More',
        englishTeacherResume: 'English Teacher Resume',
        englishTeacherPortfolio: 'English Teacher Portfolio',
        pokePeru: 'Pokémon In Peru',
        softwareEngineeringPortfolio: 'Software Engineering Portfolio',
        softwareEngineerResume: 'Software Engineer Resume',
        currentSong: 'Lyrics For Studying',
        bibleInJapanese: 'Bible In Japanese',
        japaneseMusicCovers: 'Japanese Music Covers',
        bio: 'Bio',
        tvShows: 'TV Shows',
        drawing: 'Drawings',
        travel: 'Travel',
        allLinks: 'All Links',
        themeDark: 'Dark Mode',
        themeLight: 'Light Mode',
    };
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
                            <NavDropdown.Item href={ROUTES.external.resume.teacherEnglish} target="_blank" rel="noopener noreferrer">{content.englishTeacherResume}</NavDropdown.Item>
                            <NavDropdown.Item href={ROUTES.aboutMe.teacherPortfolio}>{content.englishTeacherPortfolio}</NavDropdown.Item>
                            <NavDropdown.Item href={ROUTES.pokePeru.battle}>{content.pokePeru}</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title={<><span className="nav-title-full">{content.softwareEngineering}</span><span className="nav-title-short">{content.softwareEngineeringShort}</span></>} id="navigationbar-software-engineering">
                            <NavDropdown.Item href={ROUTES.aboutMe.techPortfolio}>{content.softwareEngineeringPortfolio}</NavDropdown.Item>
                            <NavDropdown.Item href={ROUTES.external.resume.softwareEngineer} target="_blank" rel="noopener noreferrer">{content.softwareEngineerResume}</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title={<><span className="nav-title-full">{content.japaneseStudies}</span><span className="nav-title-short">{content.japaneseStudiesShort}</span></>} id="navigationbar-japanese-studies">
                            <NavDropdown.Item href={ROUTES.japaneseMusicCovers}>{content.japaneseMusicCovers}</NavDropdown.Item>
                            <NavDropdown.Item href={ROUTES.readingsNihonDe}>{content.bibleInJapanese}</NavDropdown.Item>
                            <NavDropdown.Item href={ROUTES.practiceNihongoLyrics}>{content.currentSong}</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Nav className="nav-more">
                        <NavDropdown title={content.more} id="navigationbar-more">
                            <NavDropdown.Header>{content.aboutMe}</NavDropdown.Header>
                            <NavDropdown.Item href={ROUTES.aboutMe.bio}>{content.bio}</NavDropdown.Item>
                            <NavDropdown.Item href={ROUTES.aboutMe.tvShows}>{content.tvShows}</NavDropdown.Item>
                            <NavDropdown.Item href={ROUTES.aboutMe.drawing}>{content.drawing}</NavDropdown.Item>
                            <NavDropdown.Item href={ROUTES.external.instagram}>{content.travel}</NavDropdown.Item>
                            <NavDropdown.Divider />
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
