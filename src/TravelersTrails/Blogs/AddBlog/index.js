import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { STATUS_FAILURE, STATUS_SUCCESS, STATUS_LOADING } from '../../Network/consts';
import withBlogAuth from '../../Auth/withBlogAuth';
import BlogDate from './BlogDate';
import BlogEntryText from './BlogEntryText';
import BlogImage from './BlogImage';

const initialBlogFormState = {
    info: {
        value: '',
        isValid: true,
        validationMessage: '',
        errorMessage: ''
    },
    isValidated: false
};

class AddBlog extends React.Component {
    constructor(props) {
        super(props);

        // this.blogTitleInputRef = React.createRef();

        this.state = {
            isEditEnabled: false,
            isAddingBlog: false,
            networkStatus: null,
            addBlogNetwork: null,
            addBlogForm: initialBlogFormState,
        }
    }

    componentDidMount() {
        //REFACTOR? should we move this call into the withBlogAuth itself and just let the 
        // component did update check hang out since each page will require something different?
        //if we hit this page for the first time we might not know if we are logged in
        if (!this.props.reduxBlogAuth.authState.hasDoneInitialAuthCheck) {
            //perform initial auth check
            this.props.blogAuth.checkForAuth();
        }
        else {
            this.completeInitialization();
        }
    }

    componentDidUpdate(previousProps, previousState) {
        //switched to editing mode
        if (!previousState.isEditing && this.state.isEditing) {
            // this.blogTitleInputRef.current.focus();
        }

        //props changed for blog owner
        if (previousProps.tripOwnerId !== this.props.tripOwnerId
            || previousProps.tripId !== this.props.tripId) {
            this.completeInitialization();
        }

        //login check is complete
        if (!previousProps.reduxBlogAuth.authState.hasDoneInitialAuthCheck && this.props.reduxBlogAuth.authState.hasDoneInitialAuthCheck) {
            this.completeInitialization();
        }
    }

    completeInitialization = () => {
        //we are the owner of the blog
        if (this.props.reduxBlogAuth.authState.isLoggedIn && (this.props.reduxBlogAuth.userInfo.id === this.props.tripOwnerId || !this.props.tripOwnerId)) {
            this.setState({
                isEditEnabled: true
            });
        }
        else {
            this.setState({
                isEditEnabled: false
            });
        }
    }

    render() {
        if (this.state.isEditEnabled && !this.state.isAddingBlog) {
            return (
                <div className="Blogs_controls-add-blog">
                    <Button
                        onClick={() => {
                            this.setState({
                                isAddingBlog: true
                            }, () => {
                                this.props.isAddingBlogCallback(this.state.isAddingBlog)
                            });
                        }}
                        variant="success"
                        size="lg"
                        disabled={this.state.isDisabled}
                    >
                        <i className="material-icons">add</i>Add Blog
                    </Button>
                </div>
            );
        }

        return (
            <div>
                <BlogDate />
                <BlogEntryText />
                <BlogImage />
                <Button
                    onClick={() => {
                        console.log('this.props.blogCreation:', this.props.blogCreation );
                        this.setState({
                            addBlogNetwork: STATUS_LOADING
                        });
                    }}
                    disabled={!this.props.blogCreation.isValid}
                    variant="primary"
                    size="lg"
                >
                    Submit
                </Button>
            </div>
        );
    }
}

AddBlog.propTypes = {
    //function when trip is/isn't being edited
    isAddingBlogCallback: PropTypes.func,
    tripOwnerId: PropTypes.string.isRequired,
    tripId: PropTypes.string.isRequired,
    isDisabled: PropTypes.bool
};

function mapStateToProps({ blogCreation }) {
    return { blogCreation };
}

export default connect(mapStateToProps)(withBlogAuth(AddBlog));