import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Row from 'react-bootstrap/lib/Row';
import Grid from 'react-bootstrap/lib/Grid';
import PageHeader from 'react-bootstrap/lib/PageHeader';

import Loadingski from '../../Inf/Loadingski';
import NavigationBar from '../../Inf/NavigationBar';
import { getBlogList } from '../actions';
import BlogPage from '../BlogPage';
import './styles.css';

class BlogBrowser extends Component{

  constructor(props){
    super(props);

    this.renderSampleBlogItem = this.renderSampleBlogItem.bind(this);
  }

  componentDidMount(){
    this.props.getBlogList();
  }

  //renders all paragraphs except the first
  renderSampleBlogItem(linkItem){
    return (
      <BlogPage key={linkItem.href}
        blogUrl={linkItem.href}
      />
    );
  }

  render(){
    if(this.props.blogList.title){
      console.log('jeffski in the cage blog list', this.props.blogList);
      return (
        <div className="BlogBrowser">
          <NavigationBar />
          <Grid>
            <div className="blogBrowserTitle">
              {this.props.blogList.title}
            </div>
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