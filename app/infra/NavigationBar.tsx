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
    resume: string;
    englishTeacher: string;
    englishTeacherResume: string;
    softwareEngineer: string;
    softwareEngineerResume: string;
    pokePeru: string;
    more: string;
    techPortfolio: string;
    teacherPortfolio: string;
    drawing: string;
    tvShows: string;
    bio: string;
}

export default function NavigationBar({ themeManager }: NavigationBarProps) {
    const es: ContentPerLanguage = {
        resume: 'Currículum',
        englishTeacher: 'Profesor de Inglés',
        englishTeacherResume: 'Profesor de Inglés (Español)',
        softwareEngineer: 'Ingeniero Informático',
        softwareEngineerResume: 'Ingeniero Informático (Español)',
        pokePeru: 'Poke Perú',
        more: 'Más',
        techPortfolio: 'Portfolio Técnico',
        teacherPortfolio: 'Portfolio de Profe',
        drawing: 'Dibujos',
        tvShows: 'Series',
        bio: 'Biografía',
    };
    const defaultText: ContentPerLanguage = {
        resume: 'Resume',
        englishTeacher: 'English Teacher',
        englishTeacherResume: 'English Teacher (Spanish)',
        softwareEngineer: 'Software Engineering',
        softwareEngineerResume: 'Software Engineering (Spanish)',
        pokePeru: 'Poké Peru',
        more: 'More',
        techPortfolio: 'Tech Portfolio',
        teacherPortfolio: 'Teacher Portfolio',
        drawing: 'Drawing',
        tvShows: 'TV Shows',
        bio: 'Bio',
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

    const darkModeButtonText = (theme === THEME.DARK) ? 'Light Mode' : 'Dark Mode';
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
                        <NavDropdown title={content.resume} id="navigationbar-resume">
                            <NavDropdown.Item href={ROUTES.external.resume.softwareEngineer} >{content.softwareEngineer}</NavDropdown.Item>
                            <NavDropdown.Item href={ROUTES.external.resume.ingenieroDeSoftware} >{content.softwareEngineerResume}</NavDropdown.Item>
                            <NavDropdown.Item href={ROUTES.external.resume.teacherEnglish} >{content.englishTeacher}</NavDropdown.Item>
                            <NavDropdown.Item href={ROUTES.external.resume.profeIngles} >{content.englishTeacherResume}</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Nav >
                        <Nav.Link href={ROUTES.pokePeru.battle}>{content.pokePeru}</Nav.Link>
                        <NavDropdown title={content.more} id="navigationbar-resume">
                            <NavDropdown.Item href={ROUTES.aboutMe.techPortfolio} >{content.techPortfolio}</NavDropdown.Item>
                            <NavDropdown.Item href={ROUTES.aboutMe.teacherPortfolio} >{content.teacherPortfolio}</NavDropdown.Item>
                            <NavDropdown.Item href={ROUTES.aboutMe.drawing} >{content.drawing}</NavDropdown.Item>
                            <NavDropdown.Item href={ROUTES.aboutMe.tvShows} >{content.tvShows}</NavDropdown.Item>
                            <NavDropdown.Item href={ROUTES.aboutMe.bio}>{content.bio}</NavDropdown.Item>
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