import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { storeBlogText } from '../actions';
import { FormGroup, FormControl, Form } from 'react-bootstrap';

class BlogEntryText extends React.Component {

    handleBlogTextChange = (e) => {
        this.props.storeBlogText(e.target.value);
    }

    render() {
        return (
            <FormGroup
                controlId="blog-form-text"
            >
                <label>What Happened Today?</label>
                <FormControl
                    isInvalid={this.props.blogCreation.isValidated && !this.props.blogCreation.text.isValid}                        
                    type="text"
                    as="textarea"
                    value={this.props.blogCreation.text.rawValue}
                    placeholder="<Your Adventure Here>"
                    onChange={this.handleBlogTextChange}
                />
                <Form.Control.Feedback type="invalid">
                    Your reader's would love to hear what you did today!
                </Form.Control.Feedback>
            </FormGroup>
        );
    }
}

BlogEntryText.propTypes = {
    formDataCallback: PropTypes.func //will be called with null if form data is invalid
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ storeBlogText }, dispatch);
}

function mapStateToProps({ blogCreation }) {
    return { blogCreation };
}

export default connect(mapStateToProps, mapDispatchToProps)(BlogEntryText);