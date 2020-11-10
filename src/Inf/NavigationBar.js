import React, { Component } from 'react';
import { Navbar, NavItem, NavDropdown, Nav } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap';
import {jeffskiRoutes} from '../app';
import './styles.css';

function Brandski(props)  {
    return  (
        <LinkContainer to="/">
            <strong><a className="brand">jeff.ski</a></strong>
        </LinkContainer>
    );
}

class NavigationBar extends Component {

    render() {
        return (
            <Navbar bg="dark" variant="dark" fixed="top" collapseOnSelect expand="sm">
                
                <Navbar.Brand 
                    as={Brandski}
                    />
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse>
                    <Nav className="mr-auto">
                        <NavDropdown title="Travel" id="navigationbar-travel">
                            <LinkContainer to="/traveltrails/1e06a9e0-f132-43d1-a79c-5846563abc1a/trips/uuid1234">
                                <NavDropdown.Item>Chile</NavDropdown.Item>
                            </LinkContainer>
                            <NavDropdown.Divider />
                            <LinkContainer to="/aboutme/shotglass">
                                <NavDropdown.Item>Shotglass Collection</NavDropdown.Item>
                            </LinkContainer>
                        </NavDropdown>
                        <NavDropdown title="Software Engineering" id="navigationbar-softwareengineering">
                            <NavDropdown.Item href="https://s3.us-east-2.amazonaws.com/jeff.ski/resume/JeffSzcinski_Resume2020_10_12_SoftwareEng.pdf" >Resume</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Nav >
                        <LinkContainer to="/aboutme/bio">
                            <Nav.Link>Bio</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/aboutme/hobbies">
                            <Nav.Link>Hobbies</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to={jeffskiRoutes.travelTrailsHome}>
                            <Nav.Link>Traveler's Trails</Nav.Link>
                        </LinkContainer>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }

}

export default NavigationBar;