import React, { Component } from 'react';
import { Col, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
 
import BulletListTextItem from './BulletListTextItem';
import './styles.css';


/*
A bullet list for a blog.
Consists of some header text and a list of bullet items.
NOTE: header text is optional
*/
class BulletList extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleTextChange = this.handleTextChange.bind(this);
    this.returnBlogBulletListModel = this.returnBlogBulletListModel.bind(this);
    this.addBulletListItem = this.addBulletListItem.bind(this);
    this.removeBulletListItem = this.removeBulletListItem.bind(this);
    this.renderBulletListItems = this.renderBulletListItems.bind(this);

    //initial state with one bulletlist item
    this.state = {
      headertext: null,
      bulletListItems: [
        {
          title: null,
          text: null,
          subtext: null
        }
      ]
    };
  }

  handleTextChange(e) {
    this.setState({ headertext: e.target.value });
  }

  returnBlogBulletListModel(){
    //create model for bullet list data
    let bulletListDataModel = {
      text: this.state.headertext,
      list: {
        style: 'bullet',
        textItems: this.state.bulletListItems
      }
    };

    //hand data up to callback
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

  //shows the header text entry form and the bullet list items.
  //Bullet list items can be added and removed
  render() {

    return (
      <div>
        <form>
          <Col xs={12} >
            <FormGroup
              className="formInputSection"
              >
              <ControlLabel className="formInputLabel" >Bullet Section Text (Optional)</ControlLabel>
              <FormControl
                type="text"
                value={this.state.headertext}
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