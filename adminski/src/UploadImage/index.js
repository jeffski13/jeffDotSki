import React from 'react';
import { FormGroup, FormControl, ButtonToolbar, Button, Glyphicon } from 'react-bootstrap';
import AWS from 'aws-sdk';
import CircularProgress from 'material-ui/Progress/CircularProgress';

import Indicator from '../aws/Indicator';
import { uploadPhoto, fetchBlogObjects } from '../aws/photo';
import { AWS_S3_REGION, AWS_IDENTITY_POOL_ID } from '../configski';
//constants for AWS S3 SDK

const STATUS_LOADING = 'STATUS_LOADING';
const STATUS_FAILURE = 'STATUS_FAILURE';
const STATUS_SUCCESS = 'STATUS_SUCCESS';

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
            statusMessage: '',
			status: null
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
        this.setState({ 
            statusMessage: 'loading directory list...',
            status: STATUS_LOADING
        });

        fetchBlogObjects(this.state.awsS3, (err, allBlogS3Ojectes) => {
            if (err) {
                this.setState({ 
                    statusMessage: 'Error',
                    status: STATUS_FAILURE 
                });
            }
            //we got data!
            this.setState({
                blogDirectories: allBlogS3Ojectes,
                statusMessage: 'Success',
                status: STATUS_SUCCESS
            });
        });

    }

    onSubmitPhotoClicked = () => {
        //set state to loading so user cant submit blog twice, show loading indicator
        this.setState({
            isLoading: true,
            statusMessage: 'Uploading photo...',
            status: STATUS_LOADING
        });

        for (let i = 0; i < this.state.imgFile.length; i++) {
            //does file exist?
            if (this.doesFileExist(this.state.imgFile[i], 'Disney2018')) {
                this.setState({
                    statusMessage: `image ${this.state.imgFile[i].name} exists on server`,
                    status: STATUS_SUCCESS
                });
                return;
            }

            //upload the file
            uploadPhoto(this.state.imgFile[i], 'Disney2018', this.state.awsS3, (err, data) => {
                //error handling
                if (err) {
                    this.setState({ 
                        statusMessage: 'Error',
                        status: STATUS_FAILURE 
                    });
                    return;
                }
                //success: set status and fetch fresh list of all uploaded photos 
                this.setState({
                    statusMessage: 'Photo uploaded successful',
                    status: STATUS_SUCCESS
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
                        disabled={this.state.status === STATUS_LOADING || this.state.imgFile === ''}
                        onClick={this.onSubmitPhotoClicked}
                        >
                        Send Image
                    </Button>
                    <Button 
                        bsSize="large" 
                        disabled={this.state.status === STATUS_LOADING}
                        onClick={this.getBlogDirectories}
                    >
                        <Glyphicon glyph={"refresh"} />
                    </Button>
                    <div>
						{(this.state.status === STATUS_LOADING)
							&& <CircularProgress />}
						{(this.state.status === STATUS_SUCCESS)
							&& <Indicator success={true} />}
						{(this.state.status === STATUS_FAILURE)
							&& <Indicator success={false} />}
					</div>
                </ButtonToolbar>
                <div>Status: {this.state.statusMessage}</div>
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