import React, { Component } from 'react';
import { Col, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

import { validateFormString } from '../../formvalidation';

/*
A quote for a blog, consists of the quote and the person who said those things
*/
class Quote extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleSubtextChange = this.handleSubtextChange.bind(this);
    this.returnBlogQuoteModel = this.returnBlogQuoteModel.bind(this);

    this.state = {
      text: null,
      subtext: null
    };
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
    //create model for blog quote
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

    //hand data up to callback
    this.props.formDataCallback(quoteDataModel);
  }

  render() {

    return (
      <form>
        <Col xs={12} >
          <FormGroup
            controlId="formBasicText"
            validationState={validateFormString(this.state.text)}
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
            >
            <ControlLabel>Author (Optional)</ControlLabel>
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