import React, { Component } from 'react';
import { FormGroup, ControlLabel, FormControl, HelpBlock, ButtonToolbar, Button } from 'react-bootstrap';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import {awsApiKey} from './configski';
import BlogList from './BlogList';

class ViewBlogs extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleTripChange = this.handleTripChange.bind(this);
    this.onGetClicked = this.onGetClicked.bind(this);

    this.state = {
      trip: 'Chicago',
      blogData: []
    };
  }

  //validate string length of input
  getValidationState(str) {
    if (str.length > 0) {
      //fire state valid action
      return 'success';
    }
    else {
      //fire state invalid action
      return 'error';
    }
  }
  
  handleTripChange(e) {
    this.setState({ trip: e.target.value });
  }
  
  onGetClicked() {
    console.log('jeffski button clicked', this.state);
    axios({
      method: 'get',
      url: `https://ctbw9plo6d.execute-api.us-east-2.amazonaws.com/Prod/blogs?tripName=${this.state.trip}`,
      headers: { 'x-api-key': awsApiKey }
    })
    .then( (response) => {
      console.log(response.data);
      this.setState({ blogData: response.data });
    })
      .catch(function (error) {
        console.log(error);
      });
  }

  render() {

    return (
      <div>
        <form>
          <FormGroup
            controlId="formBasicText"
            validationState={this.getValidationState(this.state.trip)}
          >
            <ControlLabel>Trip</ControlLabel>
            <FormControl
              type="text"
              value={this.state.trip}
              placeholder="Enter text"
              onChange={this.handleTripChange}
            />
            <FormControl.Feedback />
          </FormGroup>
        </form>
        <ButtonToolbar>
          <Button bsStyle="primary" bsSize="large" onClick={this.onGetClicked}>
            Get Dem Blogs button
          </Button>
        </ButtonToolbar>

        <div>
          <BlogList blogsArr={this.state.blogData}/>
        </div>
      </div>
    );
  }
}

export default ViewBlogs;