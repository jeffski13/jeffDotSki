import React, { Component } from 'react';
import { FormGroup, ControlLabel, FormControl, ButtonToolbar, Button } from 'react-bootstrap';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import CircularProgress from 'material-ui/Progress/CircularProgress';
import moment from 'moment';
import _ from 'lodash';

import BlogEntryFormGenerator from './BlogEntryFormGenerator';
import {awsApiKey} from '../configski';
import './styles.css';

/*
parent/master class for writing a blog.
contains form elements required for a blog. (see other BlogEntryFormGenerator component for optional blog forms).
in charge of finalizing all information and sending it to the server.
*/
class WriteBlog extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleLocationChange = this.handleLocationChange.bind(this);
    this.handleTripChange = this.handleTripChange.bind(this);
    this.handleParagraphsChange = this.handleParagraphsChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.storeBlogTextFromChildForm = this.storeBlogTextFromChildForm.bind(this);
    this.onSendClicked = this.onSendClicked.bind(this);

    this.state = {
      trip: 'TestAdminski',
      location: 'Nerdvana',
      date: moment().startOf('day'),
      title: 'Working on json',
      blogtext: [],
      isLoading: false,
      isSuccessShowing: false,
      isFailureShowing: false,
      isStatusFading: false
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
    this.setState({date: date},
      () => {
        console.log('jeffski date', this.state.date);
        console.log('jeffski date valueof', this.state.date.valueOf());
        console.log('jeffski moment to unix', moment(this.state.date.valueOf()).unix());
        let valueToAndFromServer = moment(this.state.date.valueOf()).unix();
        console.log('jeffski moment.unix to format', moment.unix(valueToAndFromServer).format("MM/DD/YYYY"));
      }
    );
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
        date: moment(this.state.date.valueOf()).unix(),
        blogtext: this.state.blogtext
      },
    })
    .then( (response) => {
      //loading done, start success fade in
      this.setState({isLoading: false, isSuccessShowing: true});
      _.delay(()=>{
        //success showing, start fade out
        this.setState({isStatusFading: true});
        _.delay(()=>{
          //success animation complete, reset all state to original
          this.setState({isStatusFading: false, isSuccessShowing: false});
        }, 2000)
      }, 2000);
    })
    .catch( (error) => {
      //loading done, start failure fade in
      this.setState({isLoading: false, isFailureShowing: true});
      _.delay(()=>{
        //faile showing, start fade animation
        this.setState({isStatusFading: true});
        _.delay(()=>{
          //failure animation complete, reset all state to original
          this.setState({isStatusFading: false, isFailureShowing: false});
        }, 2000)
      }, 2000);
    });      
  }

  storeBlogTextFromChildForm(blogTextData){
    console.log('storing blog state...');
    this.setState({blogtext: blogTextData},
      () => {
        console.log('top level state', this.state);
      }
    );
  }

  render() {

    //status area to show network request is happening and success/failure for thereof hitherto.
    //Animation state machine with css classes is as follows 
    // 1. item not showing: class=hidden
    // 2. item showing/fading up: class=visible
    // 3. item fading out: class=hidden 
    let networkStatusAreaCssClass = "statusAreaHidden"
    if(this.state.isSuccessShowing || this.state.isFailureShowing){
      networkStatusAreaCssClass = "statusAreaVisible"
      if(this.state.isStatusFading){
        networkStatusAreaCssClass = "statusAreaHidden"
      }
    }

    return (
      <div className="WriteBlog">
        {/* minimum information required for blog (trip, title, date, location) */}
        <div className="form-group">
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
        
        {/* optional form with blog content (paragraphs, bullet list, etc.) */}
        <BlogEntryFormGenerator
          getBlogTextData={(data) => {this.storeBlogTextFromChildForm(data)}}
        />
        
        {/* submit button with network success/failure indicator */}
        <ButtonToolbar>
          <Button bsStyle="primary" bsSize="large" onClick={this.onSendClicked} disabled={this.state.isLoading} >
            Send button
          </Button>
          <div>
            {this.state.isLoading && 
              <CircularProgress />
            }
          </div>
          <div className={`statusArea ${networkStatusAreaCssClass}`} >
            {this.state.isSuccessShowing && 
              <i className="material-icons successColor" >done</i>
            }
            {this.state.isFailureShowing && 
              <i className="material-icons failureColor" >error</i>
            }
          </div>
        </ButtonToolbar>
      </div>
    );
  }
}

export default WriteBlog;