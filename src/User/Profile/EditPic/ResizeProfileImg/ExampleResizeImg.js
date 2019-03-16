import React from 'react';
import { FormGroup, FormControl } from 'react-bootstrap';

import ResizeImg from './index';

export default class ExampleResizeImg extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
            imageFiles: null,
            thumbnailDataReturned: []
        }
    }
    
    onImagesChosen = (event) => {
        
        let files = event.target.files;
        
        this.setState({
            imageFiles: files,
            thumbnailDataReturned: []
        });
    };

    onThumbnailUploadComplete = (errData, thumbnailData) => {
        if(errData){
            console.log("error uploading ", errData.filename, " with error ", errData.error);
            this.setState({
                thumbnailDataReturned: [...this.state.thumbnailDataReturned, errData]
            });
            return;
        }
        this.setState({
            thumbnailDataReturned: [...this.state.thumbnailDataReturned, thumbnailData]
        });
    };


    renderReturnedUrls = (nextThumbnailData) => {
        let url = 'error';
        if(nextThumbnailData.url){
            url = nextThumbnailData.url;
        }
        return(
            <div>
                <strong>{nextThumbnailData.index}:</strong>{nextThumbnailData.filename}-{url}
            </div>
        );
    }

    render() {
        
        if(this.state.imageFiles && this.state.imageFiles.length === this.state.thumbnailDataReturned.length){
            let tempData = this.state.thumbnailDataReturned;

            tempData.sort(function (a, b) {
                return a.index - b.index;
              });
            console.log('We done! ', tempData);
        }

        return (
            <div>
                RESIZE IMAGE COMPONENT EXAMPLE USE:
                <FormGroup controlId="imageSelectski" >
                    <FormControl
                        multiple
                        type="file"
                        placeholder="Choose File"
                        onChange={this.onImagesChosen}
                        accept='image/*'
                        />
                </FormGroup>
                {this.state.imageFiles && 
                    <ResizeImg  filesToThumbAndUpload={this.state.imageFiles}
                        onPhotoFinished={this.onThumbnailUploadComplete}
                    />
                }
                {this.state.thumbnailDataReturned.map(this.renderReturnedUrls)}
            </div>
        );
    }
}