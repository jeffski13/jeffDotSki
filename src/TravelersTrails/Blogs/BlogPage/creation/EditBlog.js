import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import {STATUS_FAILURE, STATUS_LOADING} from '../../../Network/consts';
import ResizeProfileImg from '../../../image-processing/ResizeProfileImg';
import {
    uploadingBlogSuccess, uploadingBlogFailure,
    uploadingImage, uploadImageSuccess, uploadImageFailure,
    startBlogUpdatedNoImage
} from './actions';
import withBlogAuth from '../../../Auth/withBlogAuth';
import BlogDate from './Form/BlogDate';
import BlogEntryText from './Form/BlogEntryText';
import BlogImage from './Form/BlogImage';
import { updateBlogSecure } from '../../../BlogForUser';
import BlogTitle from './Form/BlogTitle';
import './styles.css';

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

    onUpdateClicked = () => {
        //see if user is updating the blog image (if not go straight to uploading blog info)
        if(this.props.blogCreation.image.valueImageUrlLocal && this.props.blogCreation.image.valueImageData){
            this.props.uploadingImage();
        }else {
            this.props.startBlogUpdatedNoImage();
            this.uploadBlogInfo(null, null);
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
        if(this.props.blogCreation.title.value !== this.props.OGBlogInfo.title){
            updateBlogInfo.title = this.props.blogCreation.title.value;
        }
        if(this.props.blogCreation.text.wasUpdated){
            updateBlogInfo.blogContent = this.rawBlogToBlogTextModel(this.props.blogCreation.text.value);
        }
        if(uploadedProfilePicData && uploadedProfilePicData.url){
            updateBlogInfo.titleImageUrl = uploadedProfilePicData.url;
        }
        if(moment(this.props.blogCreation.date.value.valueOf()).unix() !== this.props.OGBlogInfo.date){
            updateBlogInfo.date = moment(this.props.blogCreation.date.value.valueOf()).unix();
        }
        
        updateBlogSecure(this.props.tripOwnerId, this.props.tripId, this.props.blogCreation.id, updateBlogInfo, (err, data) => {
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
                        onClick={this.onUpdateClicked}
                        disabled={!this.props.blogCreation.isValid}
                        variant="primary"
                        size="lg"
                    >
                        Update
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

EditBlog.defaultProps = {
    isAddingBlogCallback: () => { return false; }
};

EditBlog.propTypes = {
    //function when trip is/isn't being edited
    isAddingBlogCallback: PropTypes.func,
    tripOwnerId: PropTypes.string.isRequired,
    tripId: PropTypes.string.isRequired,
    isDisabled: PropTypes.bool,
    OGBlogInfo: PropTypes.object.isRequired
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        uploadingBlogFailure, uploadingBlogSuccess,
        uploadingImage, uploadImageSuccess, uploadImageFailure,
        startBlogUpdatedNoImage
    }, dispatch);
}

function mapStateToProps({ blogCreation }) {
    return { blogCreation };
}

export default connect(mapStateToProps, mapDispatchToProps)(withBlogAuth(EditBlog));