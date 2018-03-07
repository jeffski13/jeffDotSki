import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { getBlogList } from './redux/actions';

class BlogBrowser extends Component{

  componentDidMount(){
    this.props.getBlogList();
  }

  render(){
    return(
      <div>BlogBrowser</div>
    );
  }
}

function mapStateToProps({ blogList }){
  return { blogList };
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({getBlogList}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(BlogBrowser);