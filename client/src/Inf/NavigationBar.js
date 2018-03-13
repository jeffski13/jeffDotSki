import React from 'react';
import Navbar from 'react-bootstrap/lib/Navbar'
import NavItem from 'react-bootstrap/lib/NavItem'
import MenuItem from 'react-bootstrap/lib/MenuItem'
import NavDropdown from 'react-bootstrap/lib/NavDropdown'
import Nav from 'react-bootstrap/lib/Nav'
import {Link} from 'react-router-dom';

import './styles.css';

const NavigationBar =()=>{
  return (
    <div>
      <Navbar className="bannerNavBar" inverse collapseOnSelect fixedTop >
        <Navbar.Header>
          <Navbar.Brand>
            <a href="/">jeff.ski</a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <NavDropdown eventKey={3} title="Travel Blogs" id="basic-nav-dropdown">
              <MenuItem eventKey={3.1}>
                <Link
                  className="navBarLink"
                  to="/blog/chile"
                >
                  Chile
                </Link>
              </MenuItem>
              <MenuItem divider />
              <MenuItem eventKey={3.2}>
                <Link
                  className="navBarLink"
                  to="/aboutme/shotglass"
                >
                  Shotglass Collection
                </Link>
              </MenuItem>
            </NavDropdown>
          </Nav>
          <Nav>
            <NavDropdown eventKey={3} title="Software Engineering" id="basic-nav-dropdown">
              <MenuItem eventKey={3.3} href="https://s3.us-east-2.amazonaws.com/jeff.ski/resume/JeffSzcinski_Resume2018_3_9_SoftwareEng.pdf">
                Resume
              </MenuItem>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
}

export default NavigationBar;