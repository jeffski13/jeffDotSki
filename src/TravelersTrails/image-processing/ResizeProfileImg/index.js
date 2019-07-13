import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';

import { uploadProfilePic } from '../../BlogUser';
import Indicator from '../../Network/Indicator';
import { STATUS_LOADING, STATUS_FAILURE, STATUS_SUCCESS } from '../../Network/consts';
import './styles.css';

export default class ResizeProfileImg extends React.Component {

    static propTypes = {
        fileToResizeAndUpload: PropTypes.object.isRequired,
        userId: PropTypes.string.isRequired,
        resizeMaxHeight: PropTypes.number, //the height
        onPhotoFinished: PropTypes.func
    };

    //default to empty functions to avoid crash
    static defaultProps = {
        // the onPhotoFinished() resizedImageData param will be an array with these objects:
        // {
        //   filename: string, 
        //   url: string, 
        //   index: number
        // }
        onPhotoFinished: (err, resizedImageData) => { },
        resizeMaxHeightDefault: 500,
        resizeMaxWidthLimit: 500 * 7.5 // a 360 panorama is a ~7.5:1 width:height, max size a photo could possibly be
    };

    constructor(props) {
        super(props);

        this.state = {
            thumbnailUrl: {
                filename: '',
                url: ''
            },
            loading: false,
            thumbnailNetworkStatus: null
        }
    }

    componentDidMount() {
        this.createThumnailAndUpload();
    }

    componentWillUnmount () {
        this.setState({
            unmounting: true
        });
    }

    createThumnailAndUpload = () => {

        let file = this.props.fileToResizeAndUpload;
        if (file == null || file == undefined || file.length === 0) {
            // fail here as they didnt give files we needed.
            // The console will warn them of their treachery
            return false;
        }

        this.setState({
            thumbnailUrl: {},
            thumbnailNetworkStatus: STATUS_LOADING
        });

        let imageType = /image.*/;
        //check if file is an image
        if (!file.type.match(imageType)) {
            //ERROR! file given is not an image type
            this.props.onPhotoFinished({
                error: {
                    code: 'InvalidFileFormat',
                    message: 'The file provided must be in a supported image format'
                },
                filename: file.name
            });
        }

        let reader = new FileReader();
        if (reader != null) {
            reader.onload = (event) => {
                let resizeMaxHeight = this.props.resizeMaxHeight;
                if(!this.props.resizeMaxHeight) {
                    resizeMaxHeight = this.state.resizeMaxHeightDefault;
                }

                let resizedCanvas = document.createElement('canvas');
                let img = new Image();
                img.src = event.target.result;
                // need reference to parentreactComponent because we cant bind this (need this of the img.onload to get height and width)
                let userId = this.props.userId;
                let parentReactComponent = this;
                img.onload = function () {

                    //resize the image with the max height
                    resizedCanvas.id = "tempCanvaForResizingImg";
                    let ratioedWidth = Math.floor((this.width * resizeMaxHeight) / this.height);
                    resizedCanvas.width = Number(ratioedWidth);
                    resizedCanvas.height = Number(resizeMaxHeight);

                    //check for width larger than allowed size 
                    if(resizedCanvas.width > parentReactComponent.state.resizeMaxWidthLimit) {
                        // ERROR: if we have an ultra wide image return error...nice try rogue user
                        parentReactComponent.props.onPhotoFinished({
                            error: {
                                code: 'InvalidFileFormat',
                                message: 'The image provided is too wide to be uploaded'
                            },
                            filename: file.name
                        });
                    }

                    if (resizedCanvas.getContext) {
                        let cntxt = resizedCanvas.getContext("2d");
                        cntxt.drawImage(img, 0, 0, resizedCanvas.width, resizedCanvas.height);

                        resizedCanvas.toBlob((createdBlobImage) => {
                            //upload the file
                            uploadProfilePic(createdBlobImage, userId, (err, uploadedImageUrl) => {
                                //error handling
                                if (err) {
                                    parentReactComponent.props.onPhotoFinished({
                                        error: err,
                                        filename: file.name
                                    });
                                    parentReactComponent.setState({
                                        thumbnailNetworkStatus: STATUS_FAILURE
                                    });
                                    return;
                                }

                                parentReactComponent.props.onPhotoFinished(null, {
                                    filename: file.name,
                                    url: uploadedImageUrl
                                });
                                parentReactComponent.setState({
                                    thumbnailUrl: {
                                        filename: file.name,
                                        url: uploadedImageUrl
                                    },
                                    thumbnailNetworkStatus: STATUS_SUCCESS
                                });
                            });
                        });

                    }
                }
            };
            reader.readAsDataURL(file);
        }

    }

    render() {
        if(this.state.unmounting){
            return null;
        }
        
        return (
            <div className="ResizeProfileImg_progressIndicator">
                <span>
                    {(this.state.thumbnailNetworkStatus === STATUS_LOADING)
                        && <CircularProgress />}
                    {(this.state.thumbnailNetworkStatus === STATUS_SUCCESS)
                        && <Indicator success={true} />}
                    {(this.state.thumbnailNetworkStatus === STATUS_FAILURE)
                        && <Indicator success={false} />}
                </span>
            </div>
        );
    }
}