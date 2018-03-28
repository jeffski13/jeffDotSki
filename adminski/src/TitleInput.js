import React, {Component} from 'react';
import {FormGroup, ControlLabel, FormControl,HelpBlock, ButtonToolbar, Button} from 'react-bootstrap';
import axios from 'axios';

class TitleInput extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleChange = this.handleChange.bind(this);
    this.onButtonClicked = this.onButtonClicked.bind(this);

    this.state = {
      value: ''
    };
  }

  getValidationState() {
    const length = this.state.value.length;
    if(length > 0){
      //fire state valid action
      return 'success';
    }
    else{
      //fire state invalid action
      return 'error';
    }
    return null;
  }

  handleChange(e) {
    this.setState({ value: e.target.value });
  }

  onButtonClicked(){
    console.log('jeffski button clicked', this.state);
    axios({
      method:'post',
      url:`https://ctbw9plo6d.execute-api.us-east-2.amazonaws.com/Prod/blogs_write?title=${this.state.value}`,
      headers: {'x-api-key': ''}
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  render() {
    console.log('jeffski', this.props);

    return (
      <div>
        <form>
          <FormGroup
            controlId="formBasicText"
            validationState={this.getValidationState()}
          >
            <ControlLabel>Working example with validation</ControlLabel>
            <FormControl
              type="text"
              value={this.state.value}
              placeholder="Enter text"
              onChange={this.handleChange}
            />
            <FormControl.Feedback />
            <HelpBlock>Validation is based on string length.</HelpBlock>
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