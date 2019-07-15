import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { storeBlogTitle } from './actions';
import { FormGroup, FormControl } from 'react-bootstrap';
import { validateFormString, FORM_SUCCESS } from '../../../formvalidation';

class BlogTitle extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.blogTextInputRef = React.createRef();
    }

    componentDidMount() {
        this.blogTextInputRef.current.focus();
    }

    handleBlogTitleChange = (e) => {
        this.props.storeBlogTitle(e.target.value);
    }

    render() {
        return (
            <FormGroup
                controlId="formControlsTextarea"
                validationState={validateFormString(this.props.blogCreation.title.value)}
            >
                <label>Title</label>
                <FormControl
                    type="text"
                    value={this.props.blogCreation.title.value}
                    placeholder="<An Exciting Day!>"
                    onChange={this.handleBlogTitleChange}
                    ref={this.blogTextInputRef}
                />
            </FormGroup>
        );
    }
}

BlogTitle.propTypes = {
    formDataCallback: PropTypes.func //will be called with null if form data is invalid
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ storeBlogTitle }, dispatch);
}

function mapStateToProps({ blogCreation }) {
    return { blogCreation };
}

export default connect(mapStateToProps, mapDispatchToProps)(BlogTitle);