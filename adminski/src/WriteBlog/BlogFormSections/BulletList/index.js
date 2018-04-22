import React, { Component } from 'react';
import { Col, Form, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
 
import BulletListTextItem from './BulletListTextItem';
import './styles.css';

class BulletList extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleTextChange = this.handleTextChange.bind(this);
    this.returnBlogBulletListModel = this.returnBlogBulletListModel.bind(this);
    this.addBulletListItem = this.addBulletListItem.bind(this);
    this.removeBulletListItem = this.removeBulletListItem.bind(this);
    this.renderBulletListItems = this.renderBulletListItems.bind(this);

    this.state = {
      text: 'This is sample text for a bullet list parent obj',
      bulletListItems: [
        {
          title: null,
          text: null,
          subtext: null
        }
      ]
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

  handleTextChange(e) {
    this.setState({ text: e.target.value });
  }

  returnBlogBulletListModel(){
    //create array of 
    let bulletListDataModel = {
      text: this.state.text,
      list: {
        style: 'bullet',
        textItems: this.state.bulletListItems
      }
    };

    this.setState({ bulletListData: bulletListDataModel });

    this.props.formDataCallback(bulletListDataModel);
  }

  //add a bullet point to the state arr (this will cause another bullet list item to render)
  addBulletListItem(){
    let newBulletArr = [...this.state.bulletListItems];
    let nextBulletItem = {
      text: null,
      subtext: null,
      title: null
    };

    newBulletArr.push(nextBulletItem);
    //save to state
    this.setState({bulletListItems: newBulletArr});
  }
  
  removeBulletListItem(index){
    let newBulletArr = [...this.state.bulletListItems];
    newBulletArr.splice(index, 1);
    
    //save to state
    this.setState({bulletListItems: newBulletArr});
  }
  
  onBulletListItemDataUpdated(index, data){
    let newBulletArr = [...this.state.bulletListItems];
    newBulletArr[index] = data;
    //save to state
    this.setState({bulletListItems: newBulletArr},
      //on state update complete, hand info up to the callback
      ()=> {
        this.returnBlogBulletListModel();
      }
    );
  }

  //render a bullet list item component for each item in the state arr
  renderBulletListItems(bulletListItem, index){
    return (
      <BulletListTextItem
        key={index}
        onDeleteBulletCallback={
          ()=>{this.removeBulletListItem(index);}
        }
        onDataUpdatedCallback={
          (data)=> {this.onBulletListItemDataUpdated(index, data)}
        }
      />
    );
  }

  render() {

    return (
      <div>
        <form>
          <Col xs={12} >
            <FormGroup
              validationState={this.getValidationState(this.state.text)}
              className="formInputSection"
              >
              <ControlLabel className="formInputLabel" >Bullet Section Text</ControlLabel>
              <FormControl
                type="text"
                value={this.state.text}
                placeholder="Enter Text"
                onChange={this.handleTextChange}
                onBlur={this.returnBlogBulletListModel}
                />
            </FormGroup>
          </Col>
        </form>
        {this.state.bulletListItems.map(this.renderBulletListItems)}
        <Col xs={12} >
        
          <Button
            onClick={this.addBulletListItem}
            variant="raised"
          >
            Add Bullet
          </Button>
        </Col>
      </div>

    );
  }
}


BulletList.propTypes = {
  formDataCallback: PropTypes.func
}

export default BulletList;