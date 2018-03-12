import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Image from 'react-bootstrap/lib/Image';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';

import { getShotGlassInfo } from './redux/actions';
import Loadingski from '../../Inf/Loadingski';
import Banner from '../../Inf/Banner';
import './styles.css';

class Shotglass extends Component {
  constructor(props){
    super(props);

    this.renderShotGlassInfoText = this.renderShotGlassInfoText.bind(this);
  }

  componentDidMount(){
    this.props.getShotGlassInfo();
  }

  renderShotGlassInfoText(textItem, index){
    return(
      <Col sm={8} key={index}>{textItem.text}</Col>
    );
  }

  render(){
    if(this.props.shotGlassInfo.title){
      console.log(this.props.shotGlassInfo);
      return(
        <div className="TitlePage" >
          <Banner />
          <div className='titlePageImg' >
            <Image src={this.props.shotGlassInfo.images.main} responsive />
          </div>
          <div className="shotGlassTitle" >{this.props.shotGlassInfo.title}</div>
          <Row className="show-grid blogPargraph">
            {this.props.shotGlassInfo.textItems.map(this.renderShotGlassInfoText)}
          </Row>
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