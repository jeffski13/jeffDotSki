import React from 'react';
import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

class BlogEntryText extends React.Component {

    constructor(props, context) {
        super(props, context);
    
        this.handleBlogTextChange = this.handleBlogTextChange.bind(this);
        this.createBlogTextModel = this.createBlogTextModel.bind(this);
    
        this.state = {
          blogtext: '',
          blogtextrefined: []
        };
    }

    handleBlogTextChange(e){    
        this.setState({ blogtext: e.target.value });
    }

    createBlogTextModel(){
        //create array of 
        let blogArr = this.state.blogtext.split('\n');
        //filter out empty text (the result of carriage returns)
        blogArr = blogArr.filter(str => str !== '');
        let blogTextArrModel = this.rawBlogToBlogTextModel(blogArr);
        this.setState({ blogtextrefined: blogTextArrModel });
    }

    rawBlogToBlogTextModel(blogArr){
        let finalArr = [];
        blogArr.forEach(function(str) {
          let nextEntry = {
            text: str
          };
          finalArr.push(nextEntry);
        });
        return finalArr;
    }

    render(){
        return(
            <div>
                <div>Blog Paragraphs</div>
                <FormGroup controlId="formControlsTextarea">
                    <ControlLabel>What Happened Today?</ControlLabel>
                    <FormControl
                        componentClass="textarea" 
                        value={this.state.blogtext}
                        placeholder="blog text"
                        onChange={this.handleBlogTextChange}
                        onblur={this.createBlogTextModel} />
                </FormGroup>
            </div>
        );
    }
}

export default BlogEntryText;