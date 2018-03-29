import React, { Component } from 'react';
import { FormGroup, ControlLabel, FormControl, HelpBlock, ButtonToolbar, Button } from 'react-bootstrap';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import {awsApiKey} from './Config/config';

class TitleInput extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleLocationChange = this.handleLocationChange.bind(this);
    this.handleParagraphsChange = this.handleParagraphsChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.onButtonClicked = this.onButtonClicked.bind(this);

    this.state = {
      location: 'Dallas',
      date: moment("2017-10-13"),
      title: 'going places',
      paragraphs: 'i found a place to go one day'
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

  onButtonClicked() {
    console.log('jeffski button clicked', this.state);
    axios({
      method: 'post',
      url: `https://ctbw9plo6d.execute-api.us-east-2.amazonaws.com/Prod/blogs_write?title=${this.state.title}`,
      headers: { 'x-api-key': awsApiKey },
      data: {
        title: this.state.title,
        location: this.state.location,
        date: this.state.date.valueOf(),
        blogtext: this.state.paragraphs
      },
    })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  render() {

    console.log('jeffski', this.state, this.state.date.valueOf());
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
          <FormGroup
            controlId="formBasicText"
            validationState={this.getValidationState(this.state.paragraphs)}
          >
            <ControlLabel>Paragraph</ControlLabel>
            <FormControl
              type="text"
              value={this.state.paragraphs}
              placeholder="Enter text"
              onChange={this.handleParagraphsChange}
            />
            <FormControl.Feedback />
          </FormGroup>
        </form>
        <ButtonToolbar>
          <Button bsStyle="primary" bsSize="large" onClick={this.onButtonClicked}>
            Large button
            </Button>
        </ButtonToolbar>
      </div>
    );
  }
}

export default TitleInput;