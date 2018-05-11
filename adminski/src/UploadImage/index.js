import React from 'react';
import { FormGroup, FormControl, ButtonToolbar, Button } from 'react-bootstrap';
import AWS from 'aws-sdk';

import { uploadPhoto, fetchBlogObjects } from '../aws/photo';
import { AWS_S3_BUCKET_NAME, AWS_S3_REGION, AWS_IDENTITY_POOL_ID } from '../configski';
//constants for AWS S3 SDK

class UploadImage extends React.Component {

    constructor(props, context) {
        super(props, context);

        //initialize the AWS S3 SDK connection object
        AWS.config.update({
            region: AWS_S3_REGION,
            credentials: new AWS.CognitoIdentityCredentials({
                IdentityPoolId: AWS_IDENTITY_POOL_ID
            })
        });
        let s3 = new AWS.S3({ apiVersion: '2006-03-01' });

        this.state = {
            awsS3: s3,
            imgFile: '',
            blogDirectories: [],
            isLoading: false,
            status: ''
        };
    }

    componentDidMount() {
        this.getBlogDirectories();
    }

    handleImgFileChange = (e) => {
        this.setState({ imgFile: e.target.files });
    }

    //fetch all blog directories/objects currently on S3 
    getBlogDirectories = () => {
        this.setState({ status: 'loading directory list...' });

        fetchBlogObjects(this.state.awsS3, (err, allBlogS3Ojectes) => {
            if (err) {
                this.setState({ status: 'Error' });
            }
            //we got data!
            this.setState({
                blogDirectories: allBlogS3Ojectes,
                status: 'Success'
            });
        });

    }

    onSubmitPhotoClicked = () => {
        //set state to loading so user cant submit blog twice, show loading indicator
        this.setState({
            isLoading: true,
            status: 'Uploading photo...'
        });

        for (let i = 0; i < this.state.imgFile.length; i++) {
            //does file exist?
            if (this.doesFileExist(this.state.imgFile[i], 'Disney2018')) {
                this.setState({
                    status: `image ${this.state.imgFile[i].name} exists on server`,
                    isLoading: false
                });
                return;
            }

            //upload the file
            uploadPhoto(this.state.imgFile[i], 'Disney2018', this.state.awsS3, (err, data) => {
                //error handling
                if (err) {
                    this.setState({ status: 'Error' });
                    return;
                }
                //success: set status and fetch fresh list of all uploaded photos 
                this.setState({
                    status: 'Photo uploaded successful',
                    isLoading: false
                });
                this.getBlogDirectories();
            });
        }
    }

    //check to see if item we are uploading already exists
    doesFileExist = (file, tripName) => {
        let fileName = file.name;
        let blogImageUploadKey = `blog/${tripName}/${fileName}`;

        if (this.state.blogDirectories.includes(blogImageUploadKey)) {
            return true;
        }
        return false;
    }

    renderBlogDirectories = (blogDirectoryItem, index) => {
        return (
            <div key={index}>
                {blogDirectoryItem}
            </div>
        );
    }

    render() {

        return (
            <div className="UploadImage">
                <form>
                    <FormGroup
                        controlId="imageSelectski"
                    >
                        <FormControl
                            multiple
                            type="file"
                            placeholder="Choose File"
                            onChange={this.handleImgFileChange}
                        />
                    </FormGroup>
                </form>
                <ButtonToolbar>
                    <Button
                        bsStyle="primary"
                        bsSize="large"
                        disabled={this.state.isLoading || this.state.imgFile === ''}
                        onClick={this.onSubmitPhotoClicked}
                    >
                        Send Image
                    </Button>
                </ButtonToolbar>
                <div>Status: {this.state.status}</div>
                {
                    this.state.blogDirectories.length > 0
                        ?
                        <div>
                            <h4>Blog Directory List</h4>
                            {this.state.blogDirectories.map(this.renderBlogDirectories)}
                        </div>
                        : null
                }

            </div>
        );
    }
}

export default UploadImage;