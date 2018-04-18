import React, { Component } from 'react';
import { FormGroup, ControlLabel, FormControl, ButtonToolbar, Button } from 'react-bootstrap';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import CircularProgress from 'material-ui/Progress/CircularProgress';
import moment from 'moment';

import BlogEntry from './BlogEntry';
import {awsApiKey} from '../configski';
import './styles.css';

class WriteBlog extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleLocationChange = this.handleLocationChange.bind(this);
    this.handleTripChange = this.handleTripChange.bind(this);
    this.handleParagraphsChange = this.handleParagraphsChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.onSendClicked = this.onSendClicked.bind(this);

    this.state = {
      trip: 'TestAdmin',
      location: 'Nerdvana',
      date: moment().startOf('day'),
      title: 'Working on json',
      blogtext: '',
      isLoading: false
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

  handleDateChange(date) {
    this.setState({
      date: date
    });
  }

  handleTitleChange(e) {
    this.setState({ title: e.target.value });
  }
  
  handleParagraphsChange(e) {
    this.setState({ paragraphs: e.target.value });
  }

  handleLocationChange(e) {
    this.setState({ location: e.target.value });
  }

  handleTripChange(e) {
    this.setState({ trip: e.target.value });
  }

  onSendClicked() {
    //set state to loading so user cant submit blog twice
    // and loading indicator appears
    this.setState({isLoading: true});
    
    console.log('jeffski state before send:', this.state);
    
    //send request with new blog entry
    axios({
      method: 'post',
      url: `https://ctbw9plo6d.execute-api.us-east-2.amazonaws.com/Prod/blogs`,
      headers: { 'x-api-key': awsApiKey },
      data: {
        trip: this.state.trip,
        title: this.state.title,
        location: this.state.location,
        date: this.state.date.valueOf(),
        blogtext: ''
      },
    })
    .then( (response) => {
      console.log(response);
      this.setState({isLoading: false});        
    })
    .catch( (error) => {
      this.setState({isLoading: false});        
      console.log(error);
    });      
  }

  render() {

    return (
      <div>
        <div class="form-group">
          <DatePicker
            selected={this.state.date}
            onChange={this.handleDateChange}
            className="form-control"
          />
        </div>
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
          <FormGroup
            controlId="formBasicText"
            validationState={this.getValidationState(this.state.location)}
          >
            <ControlLabel>Location</ControlLabel>
            <FormControl
              type="text"
              value={this.state.location}
              placeholder="Enter text"
              onChange={this.handleLocationChange}
            />
            <FormControl.Feedback />
          </FormGroup>
          <FormGroup
            controlId="formBasicText"
            validationState={this.getValidationState(this.state.title)}
          >
            <ControlLabel>Title</ControlLabel>
            <FormControl
              type="text"
              value={this.state.title}
              placeholder="Enter text"
              onChange={this.handleTitleChange}
            />
            <FormControl.Feedback />
          </FormGroup>
        </form>
        <BlogEntry />
        <ButtonToolbar>
          <Button bsStyle="primary" bsSize="large" onClick={this.onSendClicked} disabled={this.state.isLoading} >
            Send button
          </Button>
          {this.state.isLoading && 
            <div className="loadingBar">
              <CircularProgress />
            </div>
          }
        </ButtonToolbar>
      </div>
    );
  }
}

export default WriteBlog;