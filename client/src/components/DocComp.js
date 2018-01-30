import React, {Component} from 'react';

class DocComp extends Component{
  render(){
    return(
      <div>{this.props.title}</div>
    );
  }
}

DocComp.propTypes = {
  title: React.PropTypes.string.isRequired,
  id: React.PropTypes.number,
  arr: React.PropTypes.array
}

export default DocComp;
