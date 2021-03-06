import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Row, Col, Form } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import { withRouter } from 'react-router-dom';

import { STATUS_FAILURE, STATUS_LOADING } from '../../../Network/consts';
import ResizeProfileImg from '../../../image-processing/ResizeProfileImg';
import {
    cancelBlogCreation,
    validateBlog,
    uploadingBlogSuccess, uploadingBlogFailure,
    uploadingImage, uploadImageSuccess, uploadImageFailure,
    startBlogUpdatedNoImage,
    deleteBlogImage, deleteImageSuccess, deleteImageFailure,
    deleteBlogSuccess, deleteBlogFailure
} from './actions';
import withBlogAuth from '../../../Auth/withBlogAuth';
import BlogDate from './Form/BlogDate';
import BlogEntryText from './Form/BlogEntryText';
import BlogImage from './Form/BlogImage';
import { updateBlogSecure, deleteBlogPic, deleteBlogSecure } from '../../../BlogForUser';
import BlogTitle from './Form/BlogTitle';
import './styles.css';
import './../../../styles.css'; //travelersTrails styles

/**
 * editting blog starts from the blog page
 */
class EditBlog extends React.Component {
    constructor(props) {
        super(props);

        // this.blogTitleInputRef = React.createRef();

        this.state = {
            isEditEnabled: false
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

    onSaveClicked = event => {
        // if we have valid inputs and we are not loading right now, try to login
        event.preventDefault();
        event.stopPropagation();
        if (this.props.blogCreation.isValid) {
            //see if user is updating the blog image (if not go straight to uploading blog info)
            if (this.props.blogCreation.image.valueImageUrlLocal && this.props.blogCreation.image.valueImageData) {
                this.props.uploadingImage();
            } else {
                this.props.startBlogUpdatedNoImage();
                this.uploadBlogInfo(null, null);
            }
        }
        else {
            //run validation
            this.props.validateBlog();
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
        const updateBlogInfo = {};
        if (this.props.blogCreation.title.value !== this.props.OGBlogInfo.title) {
            updateBlogInfo.title = this.props.blogCreation.title.value;
        }
        if (this.props.blogCreation.text.wasUpdated) {
            updateBlogInfo.blogContent = this.rawBlogToBlogTextModel(this.props.blogCreation.text.value);
        }
        if (uploadedProfilePicData && uploadedProfilePicData.url) {
            updateBlogInfo.titleImageUrl = uploadedProfilePicData.url;
        }
        if (moment(this.props.blogCreation.date.value.valueOf()).unix() !== this.props.OGBlogInfo.date) {
            updateBlogInfo.date = moment(this.props.blogCreation.date.value.valueOf()).unix();
        }

        updateBlogSecure(this.props.match.params.userId, this.props.match.params.tripId, this.props.blogCreation.id, updateBlogInfo, (err, data) => {
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

    onDeleteClicked = () => {
        // delete the blog image and the blog itself at the same time. 
        // Note here that the only thing we REALLY care about is the deleting of the blog
        // we want to make sure that the blog doesnt appear in the users trip list, but if an image exists that doesnt 
        // have a trip its not the end of the world. We do want to make a service later where we log all failed images.
        // Its good to know and if a user deletes something there will be the expectation that its actually deleted.
        this.props.deleteBlogImage();
        deleteBlogPic(this.props.OGBlogInfo.titleImageUrl, (err) => {
            if (err) {
                this.props.deleteImageFailure();
                return;
            }

            //update state with delete success
            this.props.deleteImageSuccess();
        });

        deleteBlogSecure(this.props.match.params.userId, this.props.match.params.tripId, this.props.OGBlogInfo.id, (err, data) => {
            if (err) {
                return this.props.deleteBlogFailure();
            }

            //WE DID IT! let state decide where we go from here
            return this.props.deleteBlogSuccess();
        });
    };

    render() {

        let blogForm = null;

        if (this.props.blogCreation.network === null || this.props.blogCreation.network === STATUS_FAILURE) {
            let failureMessageRender = null;
            if (this.props.blogCreation.network === STATUS_FAILURE) {
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
                <Form
                    onSubmit={e => this.onSaveClicked(e)}
                >
                    {failureMessageRender}
                    <BlogDate />
                    <BlogTitle
                        onFormEnterKeyCallback={this.onSaveClicked}
                    />
                    <BlogEntryText />
                    <BlogImage />
                    <Row className="show-grid">
                        <Col />
                        <Col sm={10} md={8} className="User_actions-section">
                            <span className="User_action-button" >
                                <Button
                                    onClick={this.onSaveClicked}
                                    variant="primary"
                                    size="lg"
                                >
                                    Save
                                </Button>
                            </span>
                            <span className="User_action-button" >
                                <Button
                                    onClick={() => {
                                        this.props.cancelBlogCreation();
                                    }}
                                    variant="secondary"
                                    size="lg"
                                >
                                    Cancel
                                </Button>
                            </span>
                            <span className="User_action-button" >
                                <Button
                                    onClick={this.onDeleteClicked}
                                    variant="danger"
                                    size="lg"
                                >
                                    Delete
                                </Button>
                            </span>
                        </Col>
                        <Col />
                    </Row>
                </Form>
            );
        }

        return (
            <div>
                {blogForm}
                {this.props.blogCreation.isEditing && this.props.blogCreation.image.network === STATUS_LOADING &&
                    <ResizeProfileImg
                        key={this.props.blogCreation.attempt} //needed so that we can get a "new" instance of the upload component
                        showProgressIndicator={false}
                        fileToResizeAndUpload={this.props.blogCreation.image.valueImageData}
                        userId={this.props.match.params.userId}
                        tripId={this.props.match.params.tripId}
                        onPhotoFinished={this.uploadBlogInfo}
                        resizeMaxHeight={2000}
                        isUserProfilePic={false}
                    />
                }
            </div>
        );
    }
}

EditBlog.propTypes = {
    OGBlogInfo: PropTypes.object.isRequired
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        cancelBlogCreation,
        validateBlog,
        uploadingBlogFailure, uploadingBlogSuccess,
        uploadingImage, uploadImageSuccess, uploadImageFailure,
        startBlogUpdatedNoImage,
        deleteBlogImage, deleteImageSuccess, deleteImageFailure,
        deleteBlogSuccess, deleteBlogFailure
    }, dispatch);
}

function mapStateToProps({ blogCreation }) {
    return { blogCreation };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withBlogAuth(EditBlog)));