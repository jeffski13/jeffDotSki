import React, {Component} from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

class BlogTextItem extends Component {

  constructor(props){
    super(props);

    this.renderTitle = this.renderTitle.bind(this);
    this.renderList = this.renderList.bind(this);
  }

  renderTitle(){
    if(this.props.blogTextData.text){
      return(
        <Col sm={8} >{this.props.blogTextData.text}</Col>
      );
    }
    else{
      return null;
    }
  }

  renderList(){
    if(this.props.blogTextData.list.style === "number"){
      //console.log('jeffski rendering bullet with ', blogTextItem);
      return(
        <Col sm={8} >
          <ul>{this.props.blogTextData.list.textItems.map(this.renderBulletList)}</ul>
        </Col>
      );
    }
    else{
      return null;
    }
  }

  renderBulletList(bulletBlogStrArrItem){
    //add in subtext. bold title, add in text
     return(
       <li>{bulletBlogStrArrItem.title}</li>
     );
  }

  render(){
    // //bulletted list
    // if(blogTextItem.style === "indent "){
    //   return(
    //     <Row className="show-grid blogPargraph" key={blogTextItem._id}>
    //       <Col sm={8} smOffset={1} >
    //         {blogTextItem.text}
    //       </Col>
    //     </Row>
    //   );
    // }
    //

    //
    // //italicized quote
    // if(blogTextItem.style === "quote"){
    //   return(
    //     <Row className="show-grid blogPargraph " key={blogTextItem._id}>
    //       <Col className="blogPargraphQuote" sm={8} smOffset={1} >
    //         {blogTextItem.text}
    //       </Col>
    //       <Col sm={8} smOffset={2} >
    //         -{blogTextItem.subText}
    //       </Col>
    //     </Row>
    //   );
    // }

    console.log('jeffski in blogTextData: ', this.props.blogTextData);

    return(
      <Row className="show-grid blogPargraph">
        {this.renderTitle()}
        {this.renderList()}
      </Row>
    );
  }
}

export default BlogTextItem;
