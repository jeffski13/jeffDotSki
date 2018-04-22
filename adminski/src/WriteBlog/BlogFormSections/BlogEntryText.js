import React from 'react';
import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import PropTypes from 'prop-types';

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

        this.props.formDataCallback(blogTextArrModel);
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
            <FormGroup controlId="formControlsTextarea">
                <ControlLabel>What Happened Today?</ControlLabel>
                <FormControl
                    componentClass="textarea" 
                    value={this.state.blogtext}
                    placeholder="blog text"
                    onChange={this.handleBlogTextChange}
                    onBlur={this.createBlogTextModel} />
            </FormGroup>
        );
    }
}

BlogEntryText.propTypes = {
    formDataCallback: PropTypes.func
}

export default BlogEntryText;