import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import { STATUS_FAILURE, STATUS_SUCCESS, STATUS_LOADING } from '../../Network/consts';
import ResizeProfileImg from '../../image-processing/ResizeProfileImg';
import {
    uploadingBlogSuccess, uploadingBlogFailure,
    uploadingImage, uploadImageSuccess, uploadImageFailure
} from './actions';
import withBlogAuth from '../../Auth/withBlogAuth';
import BlogDate from './BlogDate';
import BlogEntryText from './BlogEntryText';
import BlogImage from './BlogImage';
import { createBlogSecure } from '../../BlogForUser';
import BlogTitle from './BlogTitle';
import './styles.css';

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

    uploadBlogInfo = (errData, uploadedProfilePicData) => {
        if (errData) {
            console.log('errDate in AddBlog uploadBlogInfo: ', errData)
            this.props.uploadImageFailure();
            return;
        }

        //success
        //get bloginfotogether
        let blogInfo = {
            title: this.props.blogCreation.title.value,
            blogContent: this.rawBlogToBlogTextModel(this.props.blogCreation.text.value),
            titleImageUrl: uploadedProfilePicData.url,
            date: moment(this.props.blogCreation.date.value.valueOf()).unix()
        }
        createBlogSecure(this.props.tripOwnerId, this.props.tripId, blogInfo, (err, data) => {
            if (err) {
                return this.props.uploadingBlogFailure();
            }

            //WE DID IT! let state decide where we go from here
            return this.props.uploadingBlogSuccess();
        });
    };

    //returns an array of objects with a "text" field. 
    rawBlogToBlogTextModel(blogArr) {
        let finalArr = [];
        blogArr.forEach(function (str) {
            let nextEntry = {
                text: str
            };
            finalArr.push(nextEntry);
        });
        return finalArr;
    }

    render() {
        console.log('this.props.blogCreation: ', this.props.blogCreation);
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
        };

        let blogForm = null;

        if (this.props.blogCreation.network === null || this.props.blogCreation.network === STATUS_FAILURE) {
            let failureMessageRender = null;
            if(this.props.blogCreation.network === STATUS_FAILURE){
                failureMessageRender = (
                    <div>
                        <div className="Blogs_error" >
                            <Card bg="danger" text="white" style={{ width: '18rem' }}>
                                <Card.Header>Houston, we have a problem.</Card.Header>
                                <Card.Body>
                                    <Card.Text>
                                        <span>
                                            <span>Something went wrong while uploading the blog.</span>
                                        </span>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </div>
                    </div>
                );
            }
            blogForm = (
                <React.Fragment>
                    {failureMessageRender}
                    <BlogDate />
                    <BlogTitle />
                    <BlogEntryText />
                    <BlogImage />
                    <Button
                        onClick={() => {
                            this.props.uploadingImage();
                        }}
                        disabled={!this.props.blogCreation.isValid}
                        variant="primary"
                        size="lg"
                    >
                        Submit
                    </Button>
                </React.Fragment>
            );
        }

        return (
            <div>
                {blogForm}
                {this.props.blogCreation.image.network === STATUS_LOADING &&
                    <ResizeProfileImg
                        key={this.props.blogCreation.uploadAttempt} //needed so that we can get a "new" instance of the upload component
                        showProgressIndicator={false}
                        fileToResizeAndUpload={this.props.blogCreation.image.valueImageData}
                        userId={this.props.reduxBlogAuth.userInfo.id}
                        tripId={this.props.tripId}
                        onPhotoFinished={this.uploadBlogInfo}
                        resizeMaxHeight={2000}
                        isUserProfilePic={false}
                    />
                }
            </div>
        );
    }
}

AddBlog.defaultProps = {
    isAddingBlogCallback: () => { return false; }
};

AddBlog.propTypes = {
    //function when trip is/isn't being edited
    isAddingBlogCallback: PropTypes.func,
    tripOwnerId: PropTypes.string.isRequired,
    tripId: PropTypes.string.isRequired,
    isDisabled: PropTypes.bool
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        uploadingBlogFailure, uploadingBlogSuccess,
        uploadingImage, uploadImageSuccess, uploadImageFailure
    }, dispatch);
}

function mapStateToProps({ blogCreation }) {
    return { blogCreation };
}

export default connect(mapStateToProps, mapDispatchToProps)(withBlogAuth(AddBlog));