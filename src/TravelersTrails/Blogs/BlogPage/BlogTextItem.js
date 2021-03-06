import React, {Component} from 'react';
import { Col, Row } from 'react-bootstrap';

import './styles.css';

class BlogTextItem extends Component {

  constructor(props){
    super(props);

    this.renderText = this.renderText.bind(this);
    this.renderList = this.renderList.bind(this);
  }

  renderText(){
    if(this.props.blogTextData.text){
      return(
        <Col sm={8} >{this.props.blogTextData.text}</Col>
      );
    }
    else{
      return null;
    }
  }

  renderList(){

    if(this.props.blogTextData.list){

      if(this.props.blogTextData.list.style === "number"){
        return(
          <Col sm={8} >
            <ol>{this.props.blogTextData.list.textItems.map(this.renderTextListItem)}</ol>
          </Col>
        );
      }
      else if(this.props.blogTextData.list.style === "bullet"){
        return(
          <Col sm={8} >
            <ul>{this.props.blogTextData.list.textItems.map(this.renderTextListItem)}</ul>
          </Col>
        );
      }
      else if(this.props.blogTextData.list.style === "quote"){
        return(
          <div>
            <Col sm={5} smOffset={1} >
              {this.props.blogTextData.list.textItems[0].text}
            </Col>
            <Col sm={8} smOffset={2} >
              {this.props.blogTextData.list.textItems[0].subtext}
            </Col>
          </div>
        );
      }
    }
    else{
      return null;
    }
  }

  renderTextListItem(textListItem, index){
    let title = null;
    if(textListItem.title){
      let titleText = textListItem.title.trim();
      title = (
        <strong>{titleText} </strong>
      )
    }

    let subtext = null;
    if(textListItem.subtext){
      subtext = (
        <div>{textListItem.subtext}</div>
      );
    }

    //add in subtext. bold title, add in text
     return(
         <li key={index}> 
            {title}{textListItem.text}
            {subtext}
        </li>
     );
  }

  render(){
    return(
      <Row className="show-grid blogPargraph">
        {this.renderText()}
        {this.renderList()}
      </Row>
    );
  }
}

export default BlogTextItem;
