import React from 'react';
import { Panel, FormGroup, FormControl, Form } from 'react-bootstrap';
import PropTypes from 'prop-types';

import { STATUS_LOADING, STATUS_FAILURE, STATUS_SUCCESS } from '../../Network/consts';
import { validateFormString, FORM_SUCCESS, FORM_ERROR } from '../../../formvalidation';
import './styles.css';

// keep the rif raf out (25MB image...seems a bit excessive), even a panoramic is 12.5MB
const MAX_IMAGE_FILE_SIZE = 25000000;
export const FILE_LOADING_ERROR_IMAGE_EXCESSIVELY_LARGE = 'FILE_LOADING_ERROR_IMAGE_EXCESSIVELY_LARGE';
export const FILE_LOADING_ERROR_UNKNOWN_CAUSE = 'FILE_LOADING_ERROR_UNKNOWN_CAUSE';
export const FILE_LOADING_ERROR_NO_FILE_FOUND = 'FILE_LOADING_ERROR_NO_FILE_FOUND';
export const FILE_LOADING_ERROR_INVALID_FORMAT = 'FILE_LOADING_ERROR_INVALID_FORMAT';
/**
 * handles the image selection process (not the upload, just interacting with the OS to choose the image)
 */
export default class ImageForm extends React.Component {

    static propTypes = {
        //callback image data
        imageSelectedCallback: PropTypes.func.isRequired,
        //refresh counter: could be anything just needs to change to refresh
        refreshProp: PropTypes.any,
        // can we select a photo?
        formDisabled: PropTypes.bool,
        showPreview: PropTypes.bool,
        onImageLoading: PropTypes.func
    };

    static defaultProps = {
        refreshProp: null,
        formDisabled: false,
        shouldShowImageSize: true,
        onImageLoading: () => { }
    };

    constructor(props, context) {
        super(props, context);

        this.state = {
            imgPreviewUrl: null,
            image: {}
        };
        this.defaultState = this.state;
    }

    //Allowes user to wipe out data on change of the refreshProp
    componentDidUpdate(prevProps) {
        //wipe out our data on refresh update
        if (this.props.refreshProp !== prevProps.refreshProp) {
            this.setState(this.defaultState);
        }
    }

    handleImgFileChange = (e) => {
        let error = null;
        if (e.target.files.length < 1) {
            //fail fast, no file was clicked
            error = {
                code: FILE_LOADING_ERROR_NO_FILE_FOUND,
                message: 'no file was given'
            };
            this.props.imageSelectedCallback(null);
            this.setState(this.defaultState);
            return;
        }
        if (e.target.files.length > 0) {
            this.props.onImageLoading();
            this.setState({
                image: e.target.files[0],
                imgLoading: STATUS_LOADING
            }, () => {
                //check to see if file is corrupt
                let imageType = /image.*/;
                if (!this.state.image || validateFormString(this.state.image.name) === FORM_ERROR) {
                    error = {
                        code: FILE_LOADING_ERROR_UNKNOWN_CAUSE,
                        message: 'Something went wrong while trying to load your file. Please choose another.'
                    };
                }
                //check if file is an image
                else if (!this.state.image.type.match(imageType)) {
                    //ERROR! file given is not an image type
                    error = {
                        code: FILE_LOADING_ERROR_INVALID_FORMAT,
                        message: 'The file provided must be in a supported image format'
                    };
                }
                //check to see if file is too large
                else if (this.state.image.size > MAX_IMAGE_FILE_SIZE) {
                    error = {
                        code: FILE_LOADING_ERROR_IMAGE_EXCESSIVELY_LARGE,
                        message: 'The file is too large. Please submit a file less than 25 MB'
                    };
                }

                if (!error) {
                    //once preview url array with length is stored we can start storing preview urls as they come in
                    let reader = new FileReader();
                    let file = this.state.image;

                    //give the reader a callback so it stores the images to state when its done reading them in
                    reader.onloadend = () => {
                        //store the url in the matching state index
                        this.setState({
                            imgPreviewUrl: reader.result,
                            imgLoading: STATUS_SUCCESS
                        }, () => {
                            //if image is good give it to parent
                            this.props.imageSelectedCallback(null, this.state.image, this.state.imgPreviewUrl);
                        });
                    }

                    reader.readAsDataURL(file)
                }
                else {
                    //if image is too large or whatnot, send parent an empty object (so they know something invlaid was selected)
                    this.setState({
                        imgPreviewUrl: null,
                        imgLoading: null
                    }, () => {
                        this.props.imageSelectedCallback(error);
                    });
                }

            });
        }
    }

    renderImageSize = () => {
        if (this.state.image && this.state.image.size) {
            let imgSize = this.state.image.size / 1000 / 1000;
            let fileTooLargeMessage = '';
            let fileSizeClassName = "ImageForm__file_size_valid";
            if (this.state.image.size > MAX_IMAGE_FILE_SIZE) {
                fileSizeClassName = "ImageForm__file_size_invalid";
                fileTooLargeMessage = "Please use a file less than 5 MB.";
            }
            return (
                <strong className={`ImageForm__file_size ${fileSizeClassName}`} >
                    {`${Math.round(imgSize * 100) / 100} MB ${fileTooLargeMessage}`}
                </strong>
            );
        }
        else {
            return null;
        }
    }

    //the image preview area which contains all of the images
    renderPreviewArea = () => {
        if (this.state.imgPreviewUrl) {
            return (
                <div>
                    <div
                        className="ImageForm__preview-image"
                    >
                        <img
                            src={this.state.imgPreviewUrl}
                            className="ImageForm__preview-image-individual"
                        />
                    </div>
                </div>
            );
        }
        else {
            return null;
        }
    }

    render() {
        return (
            <React.Fragment>
                <FormGroup
                    controlId="imageSelectForm"
                >
                    <div className="ImageForm__file_details" >
                        <FormControl
                            disabled={this.props.formDisabled}
                            type="file"
                            placeholder="Choose Image File"
                            onChange={this.handleImgFileChange}
                        />
                    </div>
                </FormGroup>
                {this.props.shouldShowImageSize && this.renderImageSize()}
                {this.props.showPreview && this.renderPreviewArea()}
            </React.Fragment>
        );
    }
}