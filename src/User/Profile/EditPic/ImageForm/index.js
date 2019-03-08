import React from 'react';
import { Panel, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import PropTypes from 'prop-types';

import { validateFormString, FORM_SUCCESS, FORM_ERROR } from '../../formvalidation';
import './styles.css';

const MAX_IMAGE_FILE_SIZE = 5000000;

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
        showPreview: PropTypes.bool
    };

    static defaultProps = {
        refreshProp: null,
        formDisabled: false
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
        if (e.target.files.length < 1) {
            //fail fast, no file was clicked
            this.setState(this.defaultState);
            return;
        }
        if (e.target.files.length > 0) {
            this.setState({
                image: e.target.files[0]
            }, () => {
                if (this.validateImage() === FORM_SUCCESS) {
                    //once preview url array with length is stored we can start storing preview urls as they come in
                    let reader = new FileReader();
                    let file = this.state.image;
                    
                    //give the reader a callback so it stores the images to state when its done reading them in
                    reader.onloadend = () => {
                        //store the url in the matching state index
                        this.setState({
                            imgPreviewUrl: reader.result
                        }, () => {
                            //if image is good give it to parent
                            this.props.imageSelectedCallback(this.state.image, this.state.imgPreviewUrl);
                        });
                    }
    
                    reader.readAsDataURL(file)
                }
                else {
                    //if image is too large or whatnot, send parent an empty object (so they know something invlaid was selected)
                    this.props.imageSelectedCallback(null);
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

    validateImage = () => {
        if(this.state.image && validateFormString(this.state.image.name) && this.state.image.size < MAX_IMAGE_FILE_SIZE){
            return FORM_SUCCESS;
        }
        else {
            return FORM_ERROR;
        }
    }

    render() {
        return (
            <form>
                <FormGroup
                    controlId="imageSelectForm"
                >
                    <ControlLabel>Upload New Profile Pic:</ControlLabel>
                    <div className="ImageForm__file_details" >
                        <FormControl
                            disabled={this.props.formDisabled}
                            type="file"
                            placeholder="Choose Image File"
                            onChange={this.handleImgFileChange}
                        />
                    </div>
                </FormGroup>
                {this.renderImageSize()}
                {this.props.showPreview && this.renderPreviewArea()}
            </form>
        );
    }
}