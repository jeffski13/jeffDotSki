import React, { Component } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'lodash';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import PageHeader from 'react-bootstrap/lib/PageHeader';
import Image from 'react-bootstrap/lib/Image';

import { getCurrentBlog } from '../actions/getblog'
import Banner from  './Banner';
import Loadingski from './Loadingski';
import BlogTextItem from './BlogTextItem';

class BlogPage extends Component {

  constructor(props){
    super(props);

    this.renderBlogData = this.renderBlogData.bind(this);
    this.renderRemainingParagraphs = this.renderRemainingParagraphs.bind(this);
  }

  componentDidMount(){
    this.props.getCurrentBlog();
  }

  renderBlogData(){
    //get first paragraph data
    //then put the rest of the paragraphs into a separete array
    const firstParagraph =  this.props.currentBlog.blogText[0];
    const remainingParagraphs = this.props.currentBlog.blogText.slice(1, this.props.currentBlog.blogText.length);
    console.log(remainingParagraphs);

    return(
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
    );
  }

  //renders all paragraphs except the first
  renderRemainingParagraphs(blogTextItem){
    return (
      <BlogTextItem key={blogTextItem._id}
        blogTextData={blogTextItem}
      />
    );
  }
  
  render(){
    //using a property to validate success of request...bad practice?
    if(this.props.currentBlog.title){
      console.log('jeffski loaded: ', this.props.currentBlog);
      return (
        <div>
          <Banner />
          <div>{this.renderBlogData()}</div>
        </div>
      );
    }
    else{
      console.log('jeffski loading');
      return(
        <Loadingski />
      );
    }
  }

}

function mapStateToProps({ currentBlog }){
  return { currentBlog };
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({getCurrentBlog}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(BlogPage);
