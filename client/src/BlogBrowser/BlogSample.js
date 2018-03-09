import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

import { getBlog } from '../Blog/actions';
import { readMoreBlogClicked } from '../Blog/actions';
import './styles.css';

class BlogSample extends Component {

  componentDidMount(){
    this.props.getBlog(this.props.blogUrl);
  }

  readMoreClicked(){
    this.props.readMoreBlogClicked(this.props.blogUrl);
  }

  render(){
    let blog = this.props.blogs[this.props.blogUrl];
    if(blog){
      let sampleBlogText = blog.blogText[0].text.substring(0,200) + '...';
      return(
        <div className="BlogSample">
          <Row className="show-grid">
            <div>{blog.title}</div>
          </Row>
          <Row className="show-grid blogPargraph">
            <Col sm={8} md={4} >{sampleBlogText}</Col>
          </Row>
          <button onClick={this.readMoreClicked} class="readMoreButton custom-btn btn-4">
            <span>Read More</span>
          </button>
        </div>
      );
    }
    else{
      return(
        <div>sample blog loading...</div>
      );
    }
  }
}

function mapStateToProps({ blogs }){
  return { blogs };
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({getBlog}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(BlogSample);
