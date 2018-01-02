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
    this.props.getBlog1();
  }

  render(){
    console.log('jeffski, render BlogPage with data: ', this.props.currentBlog);

    //using a property to validate success of request...bad practice?
    return (
        <div>
          {this.props.currentBlog.title
          ? ( <div>{this.renderBlogData()}</div> )
          : ( <div>Loading...</div> )}
        </div>
      );
    }

    renderBlogData(){
      //get first paragraph data
      const firstParagraph =  this.props.currentBlog.blogText[0];
      //then put the rest of the paragraphs into a separete array
      const remainingParagraphs = this.props.currentBlog.blogText.slice(1, this.props.currentBlog.blogText.length);

      console.log('jeffski rmain paras: ', remainingParagraphs)

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
            <Col sm={8} md={4} >{firstParagraph.text}</Col>
            <Col sm={8} md={4} >
              <img className="blogimg1" src="/img/chileTripToast.jpg"  height={300} />
            </Col>
          </Row>
          {remainingParagraphs.length > 0
            ? remainingParagraphs.map(this.renderRemainingParagraphs)
            : null}
        </Grid>
      </div>
      );
    }

    //renders all paragraphs except the first
    renderRemainingParagraphs(blogTextItem){
      return(
        <Row className="show-grid blogPargraph" key={blogTextItem._id}>
          <Col sm={8} >{blogTextItem.text}</Col>
        </Row>
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