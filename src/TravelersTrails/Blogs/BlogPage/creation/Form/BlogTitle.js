import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { storeBlogTitle } from '../actions';
import { FormGroup, FormControl, Form } from 'react-bootstrap';
import { validateFormString, FORM_SUCCESS } from '../../../../../formvalidation';

class BlogTitle extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.blogTextInputRef = React.createRef();
    }

    componentDidMount() {
        //put focus onto title input when rendered
        this.blogTextInputRef.current.focus();
    }

    handleBlogTitleChange = (e) => {
        this.props.storeBlogTitle(e.target.value);
    }

    render() {
        return (
            <FormGroup
                controlId="blog-form-title"
            >
                <label>Title</label>
                <FormControl
                    isInvalid={this.props.blogCreation.isValidated && !this.props.blogCreation.title.isValid}    
                    type="text"
                    value={this.props.blogCreation.title.value}
                    aria-describedby="blog title input"
                    placeholder="<An Exciting Day!>"
                    onChange={this.handleBlogTitleChange}
                    ref={this.blogTextInputRef}
                    onKeyDown={event => {
                        if (event.key === 'Enter') {
                            this.props.onFormEnterKeyCallback(event);
                        }
                    }}
                />
                <Form.Control.Feedback type="invalid">
                    Title must not be blank.
                </Form.Control.Feedback>
            </FormGroup>
        );
    }
}

BlogTitle.propTypes = {
    onFormEnterKeyCallback: PropTypes.func, //called when user presses enter on form.
    formDataCallback: PropTypes.func //will be called with null if form data is invalid
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ storeBlogTitle }, dispatch);
}

function mapStateToProps({ blogCreation }) {
    return { blogCreation };
}

export default connect(mapStateToProps, mapDispatchToProps)(BlogTitle);