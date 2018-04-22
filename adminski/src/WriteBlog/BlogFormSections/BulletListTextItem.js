import React, { Component } from 'react';
import { Col, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import Button from 'material-ui/Button';
import { Glyphicon } from 'react-bootstrap';
import './styles.css';

class BulletListTextItem extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleSubtextChange = this.handleSubtextChange.bind(this);
    this.onDeleteBulletButtonClicked = this.onDeleteBulletButtonClicked.bind(this);
    this.returnBlogBulletListModelData = this.returnBlogBulletListModelData.bind(this);
    
    this.state = {
      title: 'title here for bullet list text item',
      text: 'this\'n here is text for bullet list text item',
      subtext: 'here is subtext for bullet list text item'
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

  onDeleteBulletButtonClicked(){
    this.props.onDeleteBulletCallback();
  }

  //get current information in this component and that info back to callback
  returnBlogBulletListModelData(){
    let blogListTextItemModel = {
      title: this.state.title,
      text: this.state.text,
      subtext: this.state.subtext
    }
    this.props.onDataUpdatedCallback(blogListTextItemModel);
  }

  render() {

    let buttonStyles = {
      minWidth: "10px",
    }
    return (
      <form>
        <Col xs={12} sm={4} md={4} lg={4} >
          <FormGroup
            validationState={this.getValidationState(this.state.title)}
            className="formInputSection"
            >
            <ControlLabel className="formInputLabel" >Title</ControlLabel>
            <FormControl
              type="text"
              value={this.state.title}
              placeholder="Enter Title"
              onChange={this.handleTitleChange}
              onBlur={this.returnBlogBulletListModelData}
              />
          </FormGroup>
        </Col>
        <Col xs={12} sm={4} md={4} lg={4} >
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
              onBlur={this.returnBlogBulletListModelData}
              />
            <FormControl.Feedback />
          </FormGroup>
        </Col>
        <Col xs={10} sm={3} >
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
              onBlur={this.returnBlogBulletListModelData}
              />
            <FormControl.Feedback />
          </FormGroup>
        </Col>
        <Col xs={1} className="BulletListItem-deleteButtonContainer" >
          <Button
            onClick={this.onDeleteBulletButtonClicked}
            style={buttonStyles}
            variant="raised"
            >
            <Glyphicon glyph="minus" />
          </Button>
        </Col>    

      </form>
    );
  }
}

export default BulletListTextItem;