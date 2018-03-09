import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Row from 'react-bootstrap/lib/Row';
import Grid from 'react-bootstrap/lib/Grid';
import PageHeader from 'react-bootstrap/lib/PageHeader';

import Loadingski from '../Inf/Loadingski';
import Banner from '../Inf/Banner';
import { getBlogList } from './redux/actions';
import BlogSample from './BlogSample';
import './styles.css';

class BlogBrowser extends Component{

  constructor(props){
    super(props);

    this.renderSampleBlogItem = this.renderSampleBlogItem.bind(this);
  }

  componentDidMount(){
    console.log('jeffski making blog browser call')
    this.props.getBlogList();
  }

  //renders all paragraphs except the first
  renderSampleBlogItem(linkItem){
    return (
      <BlogSample key={linkItem.href}
        blogUrl={linkItem.href}
      />
    );
  }

  render(){
    if(this.props.blogList.title){
      return (
        <div className="BlogBrowser">
          <Grid>
            <Row className="show-grid blogTitle">
              <PageHeader>{this.props.blogList.title}</PageHeader>
            </Row>
            <Row className="show-grid">
              <div>{this.props.blogList.date}</div>
            </Row>
            {this.props.blogList.links.map(this.renderSampleBlogItem)}
          </Grid>
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

function mapStateToProps({ blogList }){
  return { blogList };
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({getBlogList}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(BlogBrowser);