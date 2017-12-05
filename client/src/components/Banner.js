import React from 'react';
import Navbar from 'react-bootstrap/lib/Navbar'
import NavItem from 'react-bootstrap/lib/NavItem'
import MenuItem from 'react-bootstrap/lib/MenuItem'
import NavDropdown from 'react-bootstrap/lib/NavDropdown'
import Nav from 'react-bootstrap/lib/Nav'
import {Link} from 'react-router-dom';

const Banner =()=>{
  return (
    <div>
      <Navbar className='bannerNavBar' inverse collapseOnSelect fixedTop >
        <Navbar.Header>
          <Navbar.Brand>
            <a href="/">jeff.ski</a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <NavDropdown eventKey={3} title="Travel Blogs" id="basic-nav-dropdown">
              <MenuItem eventKey={3.1}>Japan</MenuItem>
              <MenuItem eventKey={3.2}><Link to="/blog/chile">Chile</Link></MenuItem>
              <MenuItem eventKey={3.3}>Disney World</MenuItem>
              <MenuItem divider />
              <MenuItem eventKey={3.3}>The Chase for Chocolate</MenuItem>
              <MenuItem divider />
              <MenuItem eventKey={3.3}>Shot Glass Collection</MenuItem>
            </NavDropdown>
          </Nav>
          <Nav>
            <NavDropdown eventKey={3} title="Software Engineering" id="basic-nav-dropdown">
              <MenuItem eventKey={3.1}>Resume</MenuItem>
              <MenuItem eventKey={3.2}>Education Background</MenuItem>
            </NavDropdown>
            <NavDropdown eventKey={3} title="Community Involvement" id="basic-nav-dropdown">
              <MenuItem eventKey={3.1}>Robotics</MenuItem>
              <MenuItem eventKey={3.2}>Hour of Code</MenuItem>
            </NavDropdown>
          </Nav>
          <Nav pullRight>
            <NavItem eventKey={1} href="#">Bio</NavItem>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
}

export default Banner;