import React from 'react';
import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { validateFormString, FORM_SUCCESS } from '../../formvalidation';

/*
normal paragraph text for the blog.
Can contain multiple paragraphs
*/
class BlogEntryText extends React.Component {

    constructor(props, context) {
        super(props, context);
        
        this.state = {
          blogtext: ''
        };
    }

    handleBlogTextChange = (e) => {
        if(e.target.value === ''){
            this.setState({ blogtext: null });
        }else{
            this.setState({ blogtext: e.target.value });
        }
    }

    createBlogTextModel = () => {
        //send up null if form is invalid
        if(validateFormString(this.state.blogtext) !== FORM_SUCCESS){
            this.props.formDataCallback(null);
            return;
        }

        //create string array. items are separated by carriage returns
        let blogArr = this.state.blogtext.split('\n');
        //filter out empty text (empty string will be present if user used multiple carriage returns)
        blogArr = blogArr.filter(str => str !== '');
        let blogTextArrModel = this.rawBlogToBlogTextModel(blogArr);

        this.props.formDataCallback(blogTextArrModel);
    }

    //returns an array of objects with a "text" field. 
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
            <FormGroup 
                controlId="formControlsTextarea"
                validationState={validateFormString(this.state.blogtext)}
            >
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
    formDataCallback: PropTypes.func //will be called with null if form data is invalid
}

export default BlogEntryText;