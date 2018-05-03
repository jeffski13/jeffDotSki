import React, { Component } from 'react';
import WriteBlog from './WriteBlog';
import ViewBlogs from './ViewBlogs';
import { Tabs, Tab } from 'react-bootstrap';
import UploadImage from './UploadImage';

class App extends Component {
  render() {
    return (
      <Tabs className="container" defaultActiveKey={3} id="uncontrolled-tab-example">
        <Tab eventKey={1} title="Write Blog">
          <WriteBlog />
        </Tab>
        <Tab eventKey={2} title="View Blog">
          <ViewBlogs />
        </Tab>
        <Tab eventKey={3} title="Upload Image">
          <UploadImage />
        </Tab>
      </Tabs>
    );
  }
}

export default App;
