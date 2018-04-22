import React, { Component } from 'react';
import { Col, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

class Quote extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleSubtextChange = this.handleSubtextChange.bind(this);
    this.returnBlogQuoteModel = this.returnBlogQuoteModel.bind(this);

    this.state = {
      text: 'here is text for a vonderful quote',
      subtext: '~subtext of quote'
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

  returnBlogQuoteModel(){
    //create array of 
    let quoteDataModel = {
      list: {
        style: 'quote',
        textItems:[
          {
            text: this.state.text,
            subtext: this.state.subtext
          }
        ]
      }
    };

    this.props.formDataCallback(quoteDataModel);
  }

  render() {

    return (
      <form>
        <Col xs={12} >
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
              onBlur={this.returnBlogQuoteModel}
              />
            <FormControl.Feedback />
          </FormGroup>
        </Col>

        <Col xs={8} sm={4} >
          <FormGroup
            controlId="formBasicText"
            validationState={this.getValidationState(this.state.subtext)}
            >
            <ControlLabel>Author</ControlLabel>
            <FormControl
              type="text"
              value={this.state.subtexttitle}
              placeholder="Who said it?"
              onChange={this.handleSubtextChange}
              onBlur={this.returnBlogQuoteModel}
              />
            <FormControl.Feedback />
          </FormGroup>
        </Col>
        <Col xs={4} sm={8} />
      </form>
    );
  }
}

export default Quote;