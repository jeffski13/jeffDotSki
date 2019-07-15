import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { storeBlogText } from './actions';
import { FormGroup, FormControl } from 'react-bootstrap';
import { validateFormString, FORM_SUCCESS } from '../../../formvalidation';

class BlogEntryText extends React.Component {

    handleBlogTextChange = (e) => {
        this.props.storeBlogText(e.target.value);
    }

    render() {
        return (
            <FormGroup
                controlId="formControlsTextarea"
                validationState={validateFormString(this.props.blogCreation.text.rawValue)}
            >
                <label>What Happened Today?</label>
                <FormControl
                    type="text"
                    as="textarea"
                    value={this.props.blogCreation.text.rawValue}
                    placeholder="<Your Adventure Here>"
                    onChange={this.handleBlogTextChange}
                />
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