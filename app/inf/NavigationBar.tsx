
import { Navbar, NavDropdown, Nav } from 'react-bootstrap';
import ROUTES from '../consts/ROUTES';
import './styles.css';
import { getContentByLanguage, getBrowserLanguage, type MultiLangContent } from '../langSupport';

export default function NavigationBar() {
    const multiLangContent: MultiLangContent = {
        es: {
            resume: 'Currículum',
            englishTeacher: 'Profesor de Inglés',
            englishTeacherResume: 'Profesor de Inglés (Español)',
            softwareEngineer: 'Ingeniero Informático',
            softwareEngineerResume: 'Ingeniero Informático (Español)',
            pokePeru: 'Poke Perú',
            hobbies: 'Bio y Pasatiempos',
            drawing: 'Dibujos',
            tvShows: 'Series',
            bio: 'Biografía',
        },
        default: {
            resume: 'Resume',
            englishTeacher: 'English Teacher',
            englishTeacherResume: 'English Teacher (Spanish)',
            softwareEngineer: 'Software Engineering',
            softwareEngineerResume: 'Software Engineering (Spanish)',
            pokePeru: 'Poké Peru',
            hobbies: 'Hobbies and Bio',
            drawing: 'Drawing',
            tvShows: 'TV Shows',
            bio: 'Bio',
        }
    };
    const content = getContentByLanguage(multiLangContent, getBrowserLanguage());
    return (
        <>
            <Navbar bg="dark" variant="dark" fixed="top" collapseOnSelect expand="sm">
                <Nav.Link href="/">
                    <Navbar.Brand className="brand">jeff.ski</Navbar.Brand>
                </Nav.Link>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse>
                    <Nav className="mr-auto">
                        <NavDropdown title={content.resume} id="navigationbar-resume">
                            <NavDropdown.Item href={ROUTES.external.resume.teacherEnglish} >{content.englishTeacher}</NavDropdown.Item>
                            <NavDropdown.Item href={ROUTES.external.resume.profeIngles} >{content.englishTeacherResume}</NavDropdown.Item>
                            <NavDropdown.Item href={ROUTES.external.resume.softwareEngineer} >{content.softwareEngineer}</NavDropdown.Item>
                            <NavDropdown.Item href={ROUTES.external.resume.ingenieroDeSoftware} >{content.softwareEngineerResume}</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Nav >
                        <Nav.Link href={ROUTES.pokePeru.battle}>{content.pokePeru}</Nav.Link>
                        <NavDropdown title={content.hobbies} id="navigationbar-resume">
                            <NavDropdown.Item href={ROUTES.aboutMe.drawing} >{content.drawing}</NavDropdown.Item>
                            <NavDropdown.Item href={ROUTES.aboutMe.tvShows} >{content.tvShows}</NavDropdown.Item>
                            <NavDropdown.Item href={ROUTES.aboutMe.bio}>{content.bio}</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </>
    );
}