import React, { Component } from 'react';
import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

class Quote extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleSubtextChange = this.handleSubtextChange.bind(this);

    this.state = {
      title: 'title here',
      text: 'here is text',
      subtext: 'here is subtext'
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

  handleTitleChange(e) {
    this.setState({ title: e.target.value });
  }
  
  handleTextChange(e) {
    this.setState({ text: e.target.value });
  }

  handleSubtextChange(e) {
    this.setState({ subtext: e.target.value });
  }

  render() {

    return (
      <form>
        <FormGroup
          controlId="formBasicText"
          validationState={this.getValidationState(this.state.title)}
        >
          <ControlLabel>Title</ControlLabel>
          <FormControl
            type="text"
            value={this.state.title}
            placeholder="Enter Title"
            onChange={this.handleTitleChange}
          />
          <FormControl.Feedback />
        </FormGroup>
        <FormGroup
          controlId="formBasicText"
          validationState={this.getValidationState(this.state.text)}
        >
          <ControlLabel>Text</ControlLabel>
          <FormControl
            type="text"
            value={this.state.text}
            placeholder="Enter text"
            onChange={this.handleTextChange}
          />
          <FormControl.Feedback />
        </FormGroup>
        <FormGroup
          controlId="formBasicText"
          validationState={this.getValidationState(this.state.subtext)}
        >
          <ControlLabel>Subtext</ControlLabel>
          <FormControl
            type="text"
            value={this.state.subtexttitle}
            placeholder="Enter subtext"
            onChange={this.handleSubtextChange}
          />
          <FormControl.Feedback />
        </FormGroup>
      </form>
    );
  }
}

export default Quote;