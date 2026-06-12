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
    softwareEngineering: string;
    japaneseStudies: string;
    aboutMe: string;
    more: string;
    englishTeacherResume: string;
    englishTeacherPortfolio: string;
    pokePeru: string;
    softwareEngineeringPortfolio: string;
    softwareEngineerResume: string;
    currentSong: string;
    bibleInJapanese: string;
    japaneseMusic: string;
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
        softwareEngineering: 'Ingeniería de Software',
        japaneseStudies: 'Estudios de Japonés',
        aboutMe: 'Sobre Mí',
        more: 'Más',
        englishTeacherResume: 'Currículum de Profesor de Inglés',
        englishTeacherPortfolio: 'Portafolio de Profesor de Inglés',
        pokePeru: 'Pokemon En Perú',
        softwareEngineeringPortfolio: 'Portafolio de Ingeniería de Software',
        softwareEngineerResume: 'Currículum de Ingeniero de Software',
        currentSong: 'Canción Actual',
        bibleInJapanese: 'Biblia en Japonés',
        japaneseMusic: 'Música Japonesa',
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
        softwareEngineering: 'Software Engineering',
        japaneseStudies: 'Japanese Studies',
        aboutMe: 'About Me',
        more: 'More',
        englishTeacherResume: 'English Teacher Resume',
        englishTeacherPortfolio: 'English Teacher Portfolio',
        pokePeru: 'Pokémon In Peru',
        softwareEngineeringPortfolio: 'Software Engineering Portfolio',
        softwareEngineerResume: 'Software Engineer Resume',
        currentSong: 'Learning With Songs',
        bibleInJapanese: 'Bible In Japanese',
        japaneseMusic: 'Japanese Music',
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
                        <NavDropdown title={content.teaching} id="navigationbar-teaching">
                            <NavDropdown.Item href={ROUTES.external.resume.teacherEnglish} target="_blank" rel="noopener noreferrer">{content.englishTeacherResume}</NavDropdown.Item>
                            <NavDropdown.Item href={ROUTES.aboutMe.teacherPortfolio}>{content.englishTeacherPortfolio}</NavDropdown.Item>
                            <NavDropdown.Item href={ROUTES.pokePeru.battle}>{content.pokePeru}</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title={content.softwareEngineering} id="navigationbar-software-engineering">
                            <NavDropdown.Item href={ROUTES.aboutMe.techPortfolio}>{content.softwareEngineeringPortfolio}</NavDropdown.Item>
                            <NavDropdown.Item href={ROUTES.external.resume.softwareEngineer} target="_blank" rel="noopener noreferrer">{content.softwareEngineerResume}</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title={content.japaneseStudies} id="navigationbar-japanese-studies">
                            <NavDropdown.Item href={ROUTES.practiceNihongo}>{content.currentSong}</NavDropdown.Item>
                            <NavDropdown.Item href={ROUTES.readingsNihonDe}>{content.bibleInJapanese}</NavDropdown.Item>
                            <NavDropdown.Item href={ROUTES.japaneseMusic}>{content.japaneseMusic}</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title={content.aboutMe} id="navigationbar-about-me">
                            <NavDropdown.Item href={ROUTES.aboutMe.bio}>{content.bio}</NavDropdown.Item>
                            <NavDropdown.Item href={ROUTES.aboutMe.tvShows}>{content.tvShows}</NavDropdown.Item>
                            <NavDropdown.Item href={ROUTES.aboutMe.drawing}>{content.drawing}</NavDropdown.Item>
                            <NavDropdown.Item href={ROUTES.external.instagram}>{content.travel}</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Nav>
                        <NavDropdown title={content.more} id="navigationbar-more">
                            <NavDropdown.Item href={ROUTES.sitemap}>{content.allLinks}</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <div className="d-grid gap-2">
                                <Button
                                    variant="outline-none"
                                    className="d-flex align-items-center gap-2 darkMode-button"
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
