import React, { Component } from 'react';
import WriteBlog from './WriteBlog';
import ViewBlogs from './ViewBlogs';
import { Tabs, Tab } from 'react-bootstrap';

class App extends Component {
  render() {
    return (
      <Tabs className="container" defaultActiveKey={2} id="uncontrolled-tab-example">
        <Tab eventKey={1} title="Write Blog">
         <WriteBlog />
        </Tab>
        <Tab eventKey={2} title="View Blog">
          <ViewBlogs />
        </Tab>
      </Tabs>
    );
  }
}

export default App;
