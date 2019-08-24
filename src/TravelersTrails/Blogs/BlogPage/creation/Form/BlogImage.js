import React from 'react';
import { Row, Col, Button, Alert, Image } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import ImageForm from '../../../../image-processing/ImageForm';
import ResizeProfileImg from '../../../../image-processing/ResizeProfileImg';
import { STATUS_LOADING, STATUS_SUCCESS, STATUS_FAILURE } from '../../../../Network/consts';
import { blogImageSelected } from '../actions';

class BlogImage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uploadedBlogImageUrl: null,
            imagePreviewLoading: false,
            formRefreshProp: false //needed?
        };
    }

    isFormDisabled = () => {
        return this.props.blogCreation.image.network === STATUS_LOADING || this.props.blogCreation.network === STATUS_LOADING;
    }

    isFormInvalid = () => {
        return this.props.blogCreation.image.value !== null;
    }

    render() {
        let picSrc = null;
        if (this.props.blogCreation.image.valueImageUrlLocal) {
            picSrc = this.props.blogCreation.image.valueImageUrlLocal;
        }

        //for edit we can render the one form the server
        if(this.props.blogCreation.isEdittingBlog && this.props.blogCreation.image.uploadedUrl) {
            picSrc = this.props.blogCreation.image.uploadedUrl;
        }

        return (
            <form>
                <Row className="show-grid">
                    <Col />
                    <Col xs={12} sm={8} md={4} >
                        <div className="ProfileEditInfo_profilepic">
                            <Image fluid src={picSrc} />
                        </div>
                    </Col>
                    <Col />
                </Row>

                <Row className="show-grid">
                    <Col />
                    <Col xs="auto" >
                        <ImageForm
                            refreshProp={this.state.formRefreshProp}
                            imageSelectedCallback={(err, imgData, imgUrl) => {
                                //prep state for uploading an image (network messages, status, etc.)
                                if (err) {
                                    // image selected failure
                                    this.setState({
                                        imagePreviewLoading: false
                                    });
                                }
                                else {
                                    // image selected success!
                                    this.setState({
                                        imagePreviewLoading: false
                                    });
                                    this.props.blogImageSelected(imgData, imgUrl);
                                }

                            }}
                            onImageLoading={() => {
                                this.setState({
                                    imagePreviewLoading: true
                                });
                            }}
                            showPreview={false}
                            formDisabled={this.isFormDisabled()}
                            shouldShowImageSize={false}
                        />
                    </Col>
                    <Col />
                </Row>

                {this.props.blogCreation.image.network === STATUS_FAILURE &&
                    <Row className="show-grid User_error-message">
                        <Col />
                        <Col xs={10} sm={8} md={4} >
                            <Alert variant="danger">
                                <Alert.Heading>Oh No!</Alert.Heading>
                                <p>There was an issue uploading your image.</p>
                                <p>Please try again later.</p>
                            </Alert>
                        </Col>
                        <Col />
                    </Row>
                }
            </form>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ blogImageSelected }, dispatch);
}

function mapStateToProps({ blogCreation }) {
    return { blogCreation };
}

export default connect(mapStateToProps, mapDispatchToProps)(BlogImage);