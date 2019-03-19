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
                <LinkContainer to="/">
                    <Navbar.Brand className="brand">jeff.ski</Navbar.Brand>
                </LinkContainer>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse>
                    <Nav className="mr-auto">
                        <NavDropdown title="Travel" id="navigationbar-travel">
                            <LinkContainer to="/blog/chile">
                                <NavDropdown.Item>Chile</NavDropdown.Item>
                            </LinkContainer>
                            <NavDropdown.Divider />
                            <LinkContainer to="/aboutme/shotglass">
                                <NavDropdown.Item>Shotglass Collection</NavDropdown.Item>
                            </LinkContainer>
                        </NavDropdown>
                        <NavDropdown title="Software Engineering" id="navigationbar-softwareengineering">
                            <NavDropdown.Item href="https://s3.us-east-2.amazonaws.com/jeff.ski/resume/JeffSzcinski_Resume2018_3_9_SoftwareEng.pdf">Resume</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Nav >
                        <LinkContainer to="/aboutme/bio">
                            <Nav.Link>Bio</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/aboutme/hobbies">
                            <Nav.Link>Hobbies</Nav.Link>
                        </LinkContainer>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }

}

export default NavigationBar;