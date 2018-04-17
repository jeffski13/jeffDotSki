import React, { Component } from 'react';
import WriteBlog from './WriteBlog';
import ViewBlogs from './ViewBlogs';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

class App extends Component {
  render() {
    return (
      <Tabs>
        <TabList>
          <Tab>Write Blog</Tab>
          <Tab>View Blog</Tab>
        </TabList>

        <TabPanel>
          <WriteBlog />
        </TabPanel>
        <TabPanel>
          <ViewBlogs />
        </TabPanel>
      </Tabs>
    );
  }
}

export default App;
