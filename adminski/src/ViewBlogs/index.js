import React, { Component } from 'react';
import { FormGroup, ControlLabel, FormControl, ButtonToolbar, Button } from 'react-bootstrap';
import axios from 'axios';
import 'react-datepicker/dist/react-datepicker.css';
import {awsApiKey} from '../configski';
import BlogList from './BlogList';
import {validateFormString} from '../formvalidation';

class ViewBlogs extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleTripInputChange = this.handleTripInputChange.bind(this);
    this.onGetBlogsButtonClicked = this.onGetBlogsButtonClicked.bind(this);

    this.state = {
      trip: 'TestAdminski',
      blogData: []
    };
  }
  
  handleTripInputChange(e) {
    this.setState({ trip: e.target.value });
  }
  
  //get list of blogs by trip name from server
  onGetBlogsButtonClicked() {
    console.log('jeffski button clicked', this.state);
    axios({
      method: 'get',
      url: `https://ctbw9plo6d.execute-api.us-east-2.amazonaws.com/Prod/blogs?tripName=${this.state.trip}`,
      headers: { 'x-api-key': awsApiKey }
    })
    .then( (response) => {
      console.log('jeffski blogs returned', response.data);
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
            validationState={validateFormString(this.state.trip)}
          >
            <ControlLabel>Trip</ControlLabel>
            <FormControl
              type="text"
              value={this.state.trip}
              placeholder="Enter text"
              onChange={this.handleTripInputChange}
            />
            <FormControl.Feedback />
          </FormGroup>
        </form>
        <ButtonToolbar>
          <Button bsStyle="primary" bsSize="large" onClick={this.onGetBlogsButtonClicked}>
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