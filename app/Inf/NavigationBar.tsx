import React, { Component } from 'react';
import { Navbar, NavItem, NavDropdown, Nav } from 'react-bootstrap'
import ROUTES from '../consts/ROUTES';
import './styles.css';

class NavigationBar extends Component {
    render() {
        return (
            <>
                <Navbar bg="dark" variant="dark" fixed="top" collapseOnSelect expand="sm">
                    <Nav.Link href="/">
                        <Navbar.Brand className="brand">jeff.ski</Navbar.Brand>
                    </Nav.Link>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse>
                        <Nav className="mr-auto">
                            <NavDropdown title="Resume" id="navigationbar-resume">
                                <NavDropdown.Item href="https://s3.us-east-2.amazonaws.com/jeff.ski/resume/JeffSzcinski_Resume_2025_01_07_software.pdf" >Software Engineering</NavDropdown.Item>
                                <NavDropdown.Item href="https://s3.us-east-2.amazonaws.com/jeff.ski/resume/JeffSzcinski_CV_2025_01_07_Software.pdf" >Ingeníero Informático Español</NavDropdown.Item>
                                <NavDropdown.Item href="https://s3.us-east-2.amazonaws.com/jeff.ski/resume/JeffSzcinski_Resume_2025_01_26_TeacherEnglish.pdf" >English Teacher</NavDropdown.Item>
                                <NavDropdown.Item href="https://s3.us-east-2.amazonaws.com/jeff.ski/resume/JeffSzcinski_CV_2025_01_26_ProfeIngles.pdf" >Profesor de Inglés Español</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                        <Nav >
                            <Nav.Link href={ROUTES.pokePeru.battle}>Poke Peru</Nav.Link>
                            <Nav.Link href={ROUTES.aboutMe.bio}>Bio</Nav.Link>
                            <Nav.Link href={ROUTES.aboutMe.hobbies}>Hobbies</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </>
        );
    }

}

export default NavigationBar;