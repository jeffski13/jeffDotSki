import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { Container, Image, Col, Row } from 'react-bootstrap';

import { getShotGlassInfo } from './redux/actions';
import Loadingski from '../../Inf/Loadingski';
import '../styles.css';

class Shotglass extends Component {
  constructor(props){
    super(props);

    this.renderShotGlassInfoText = this.renderShotGlassInfoText.bind(this);
    this.renderList = this.renderList.bind(this);
  }

  componentDidMount(){
    this.props.getShotGlassInfo();
  }

  renderShotGlassInfoText(textItem, index){
    return(
      <Row key={index} className="show-grid aboutMePargraph">
        <Col sm={10} >{textItem.text}</Col>
        {this.renderList(textItem.list)}
      </Row>
    );
  }

  renderList(list){

    if(list){

      if(list.style === "bullet"){
        return(
          <Col sm={8} >
            <ul>{list.textItems.map(this.renderTextListItem)}</ul>
          </Col>
        );
      }
    }
    else{
      return null;
    }
  }

  renderTextListItem(textListItem, index){
    let location = null;
    if(textListItem.location){
      location = (
        <strong>{textListItem.location}: </strong>
      );
    }

    let city = null;
    if(textListItem.city){
      city = (
        <div>{textListItem.city}</div>
      );
    }

    //add in subtext. bold title, add in text
     return(
         <li key={index}>{location}{textListItem.date}{city}</li>
     );
  }

  render(){
    if(this.props.shotGlassInfo.title){
      return(
        <div className="aboutmeWrapper" >
          <div>
            <Image src={this.props.shotGlassInfo.images.main} fluid />
          </div>
          <div className="aboutMeTextSection" >
            <Container>
              <Col>
                <div className="aboutMeTitle" >{this.props.shotGlassInfo.title}</div>
              </Col>
            </Container>
            <Container>
              {this.props.shotGlassInfo.textItems.map(this.renderShotGlassInfoText)}
            </Container>
          </div>
        </div>
      );
    }
    return(
      <Loadingski />
    );
  }
}

function mapStateToProps({ shotGlassInfo }){
  return { shotGlassInfo };
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({getShotGlassInfo}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Shotglass);