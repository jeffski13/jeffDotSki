import React, { Component } from 'react';
import { Navbar, NavItem, NavDropdown, Nav } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap';

import './styles.css';

class NavigationBar extends Component {
    goToBio() {
    }

    render() {
        return (
            <Navbar bg="dark" variant="dark" fixed="top" collapseOnSelect expand="sm">
                <Navbar.Brand href="/" className="brand">jeff.ski</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse>
                    <Nav className="mr-auto">
                        <NavDropdown title="Travel" id="navigationbar-travel">
                            <NavDropdown.Item href="/blog/chile">Chile</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="/aboutme/shotglass">Shotglass Collection</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Software Engineering" id="navigationbar-softwareengineering">
                            <NavDropdown.Item href="https://s3.us-east-2.amazonaws.com/jeff.ski/resume/JeffSzcinski_Resume2018_3_9_SoftwareEng.pdf">Resume</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Nav pullRight >
                        <Nav.Link href="/aboutme/bio">Bio</Nav.Link>
                        <Nav.Link href="/aboutme/hobbies">Hobbies</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }

}

export default NavigationBar;