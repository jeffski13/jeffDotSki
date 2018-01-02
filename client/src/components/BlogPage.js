import React, { Component } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'lodash';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import PageHeader from 'react-bootstrap/lib/PageHeader';
import Image from 'react-bootstrap/lib/Image';

import { getBlog1 } from '../actions/getblog'
import Banner from  './Banner';
import Loadingski from './Loadingski';

class BlogPage extends Component {

  constructor(props){
    super(props);

    this.renderBlogData = this.renderBlogData.bind(this);
  }

  componentDidMount(){
    this.props.getBlog1();
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
    //bulletted list
    if(blogTextItem.style === "bullet"){
      return(
        <Row className="show-grid blogPargraph" key={blogTextItem._id}>
          <Col sm={8} >
            {blogTextItem.title
              ? (<ul>
                  <li><strong>{blogTextItem.title}: </strong>{blogTextItem.text}</li>
                </ul>)
              : null }
          </Col>
          <Col sm={8} smOffset={1} >
            {blogTextItem.subText}
          </Col>
        </Row>
      );
    }

    //italicized quote
    if(blogTextItem.style === "quote"){
      return(
        <Row className="show-grid blogPargraph " key={blogTextItem._id}>
          <Col className="blogPargraphQuote" sm={8} smOffset={1} >
            {blogTextItem.text}
          </Col>
          <Col sm={8} smOffset={2} >
            -{blogTextItem.subText}
          </Col>
        </Row>
      );
    }

    //default (text only)
    return(
      <Row className="show-grid blogPargraph" key={blogTextItem._id}>
        <Col sm={8} >{blogTextItem.text}</Col>
      </Row>
    );
  }

  render(){
    //using a property to validate success of request...bad practice?
    return (
        <div>
          <Banner />
          {this.props.currentBlog.title
          ? ( <div>{this.renderBlogData()}</div> )
          : ( <Loadingski /> )}
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