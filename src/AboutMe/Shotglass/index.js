import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Image from 'react-bootstrap/lib/Image';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import Grid from 'react-bootstrap/lib/Grid';

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
      console.log(this.props.shotGlassInfo);
      return(
        <div className="aboutmeWrapper" >
          <div>
            <Image src={this.props.shotGlassInfo.images.main} responsive />
          </div>
          <div className="aboutMeTextSection" >
            <Grid>
              <Col>
                <div className="aboutMeTitle" >{this.props.shotGlassInfo.title}</div>
              </Col>
            </Grid>
            <Grid>
              {this.props.shotGlassInfo.textItems.map(this.renderShotGlassInfoText)}
            </Grid>
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