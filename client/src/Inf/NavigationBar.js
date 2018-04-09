import React, {Component} from 'react';
import {Navbar, NavItem, MenuItem, NavDropdown, Nav} from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap';

import './styles.css';

class NavigationBar extends Component {
  goToBio(){
    console.log('jeffski in the bio');
  }

  render(){
    return (
      <Navbar inverse collapseOnSelect fixedTop >
        <Navbar.Header>
          <LinkContainer to="/">
				    <Navbar.Brand className="brand">
              jeff.ski
				    </Navbar.Brand>
	    	  </LinkContainer>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <NavDropdown eventKey={1} title="Travel Blogs" id="basic-nav-dropdown">
              <LinkContainer to="/blog/chile">
                <MenuItem eventKey={1.1}>
                    Chile
                </MenuItem>
              </LinkContainer>
              <MenuItem divider />
              <LinkContainer to="/aboutme/shotglass">
                <MenuItem eventKey={1.2}>
                  Shotglass Collection
                </MenuItem>
              </LinkContainer>
            </NavDropdown>
          </Nav>
          <Nav>
            <NavDropdown eventKey={2} title="Software Engineering" id="basic-nav-dropdown">
              <MenuItem eventKey={2.1} href="https://s3.us-east-2.amazonaws.com/jeff.ski/resume/JeffSzcinski_Resume2018_3_9_SoftwareEng.pdf">
                Resume
              </MenuItem>
            </NavDropdown>
          </Nav>
          <Nav pullRight >
            <LinkContainer to="/aboutme/bio">
              <NavItem eventKey={3} href="#">
                Bio
				      </NavItem>
			      </LinkContainer>
          </Nav>
          <Nav pullRight >
            <LinkContainer to="/aboutme/hobbies">
              <NavItem eventKey={3} href="#">
                Hobbies
				      </NavItem>
			      </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }

}

export default NavigationBar;