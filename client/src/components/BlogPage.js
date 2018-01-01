import React, { Component } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import PageHeader from 'react-bootstrap/lib/PageHeader';
import Image from 'react-bootstrap/lib/Image';

import { getBlog1 } from '../actions/getblog'
import Banner from  './Banner';
import BlogSlideShow from './BlogSlideShow';
import _ from 'lodash';

class BlogPage extends Component {

  constructor(props){
    super(props);

    this.renderBlogData = this.renderBlogData.bind(this);
  }

  componentDidMount(){
    _.delay(()=>{
      console.log('jeffski delayski');
      this.props.getBlog1();
    }, 3000);
  }

  renderBlogData(){
    return(
    <div>
      <Banner />

      <Grid>
        <Row className="show-grid blogTitle">
          <PageHeader>{this.props.currentBlog.title}</PageHeader>
        </Row>
        <Row className="show-grid">
          <div>{this.props.currentBlog.location}</div>
        </Row>
        <Row className="show-grid">
          <div>{this.props.currentBlog.date}</div>
        </Row>
        <Row className="show-grid blogPargraph">
          <Col sm={8} md={4} >{this.props.currentBlog.blogText[0].text}</Col>
          <Col sm={8} md={4} >
            <img className="blogimg1" src="/img/chileTripToast.jpg"  height={300} />
          </Col>
        </Row>
        <Row className="show-grid blogPargraph">
          {this.props.currentBlog.blogText[1]
          ?<Col sm={8} >{this.props.currentBlog.blogText[1].text}</Col>
          : null}
        </Row>
      </Grid>
    </div>
    );
  }

  render(){
    console.log('jeffski, render BlogPage with data: ', this.props.currentBlog);

    //using a property to validate success...bad practice?
    return (
        <div>
          {this.props.currentBlog.title
          ? ( <div>{this.renderBlogData()}</div> )
          : ( <div>Loading...</div> )}
        </div>
      );
    }
}

function mapStateToProps({ currentBlog }){
  return { currentBlog };
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({getBlog1}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(BlogPage);