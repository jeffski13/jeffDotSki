import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'lodash';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import PageHeader from 'react-bootstrap/lib/PageHeader';
import Image  from 'react-bootstrap/lib/Image';


import { getBlog } from '../actions';
import NavigationBar from  '../../Inf/NavigationBar';
import Loadingski from '../../Inf/Loadingski';
import BlogTextItem from './BlogTextItem';
import './styles.css';

class BlogPage extends Component {

  constructor(props){
    super(props);

    this.renderBlogData = this.renderBlogData.bind(this);
    this.renderRemainingParagraphs = this.renderRemainingParagraphs.bind(this);
  }

  componentDidMount(){
    this.props.getBlog(this.props.blogUrl);
  }

  renderBlogData(){

    let blog = this.props.blogs[this.props.blogUrl];

    //get first paragraph data
    //then put the rest of the paragraphs into a separete array
    const firstParagraph =  blog.blogText[0];
    const remainingParagraphs = blog.blogText.slice(1, blog.blogText.length);

    return(
      <Grid>
        <Row className="show-grid">
          <PageHeader>{blog.title}</PageHeader>
        </Row>
        <Row className="show-grid">
          <div>{blog.location}</div>
        </Row>
        <Row className="show-grid">
          <div>{blog.date}</div>
        </Row>
        <Row className="show-grid blogPargraph">
          <Col sm={8} md={4} >{firstParagraph.text}</Col>
          <Col sm={8} md={4} >
            <Image src={blog.images.main} responsive />
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
    if(this.props.blogs[this.props.blogUrl]){
      return (
        <div>
          <div>{this.renderBlogData()}</div>
        </div>
      );
    }
    else{
      return(
        <Loadingski />
      );
    }
  }

}

BlogPage.propTypes = {
  blogUrl: PropTypes.string
}

function mapStateToProps({ blogs }){
  return { blogs };
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({getBlog}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(BlogPage);