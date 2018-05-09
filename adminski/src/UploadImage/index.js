import React from 'react';
import { FormGroup, FormControl, ButtonToolbar, Button } from 'react-bootstrap';
import AWS from 'aws-sdk';
import {AWS_S3_BUCKET_NAME, AWS_S3_REGION, AWS_IDENTITY_POOL_ID} from '../configski';
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
        let s3 = new AWS.S3({apiVersion: '2006-03-01'});
        
        this.state = {
            awsS3: s3,
            imgFile: '',
            blogDirectories: [],
            allDirectories: [],
            isLoading: false,
            status: ''
        };
    }

    componentDidMount(){
        this.getBlogDirectories();
    }
    
    handleImgFileChange = (e) => {
        this.setState({ imgFile: e.target.files });
    }
    
    //fetch all blog directories/objects currently on S3 
    getBlogDirectories = () => {
        let s3Params = {Bucket: AWS_S3_BUCKET_NAME};
        this.setState({status: 'loading directory list...'});
        
        this.state.awsS3.listObjects(s3Params, (err, data) => {
            if (err) {
                console.log('There was an error listing your albums: ', err.message);
                this.setState({status: 'Success'});
            }
            else {
                //you got data! wonderful, now put it into a readable array
                let rawContentsArr = data.Contents;

                //turn into string array of directories
                let directoriesKeyArr = [];
                rawContentsArr.forEach(function(contentsItem){
                    directoriesKeyArr.push(contentsItem.Key);
                });
                let blogDirectoriesArrRaw = directoriesKeyArr.filter(directoryKey => directoryKey.startsWith("blog/"));
                this.setState({
                    blogDirectories: blogDirectoriesArrRaw,
                    allDirectories: directoriesKeyArr,
                    status: 'Success'
                });
            }
        });
    }
    
    uploadPhoto = () => {
        //set state to loading so user cant submit blog twice, show loading indicator
        this.setState({ 
            isLoading: true,
            status: 'Uploading photo...'
         });
        
        for(let i = 0; i < this.state.imgFile.length; i++){
            var file = this.state.imgFile[i];
            let fileName = file.name;
            let tripName = 'Disney2018';
            let blogImageUploadKey = `blog/${tripName}/${fileName}`;
            
            //check to see if item we are uploading already exists
            if(this.state.allDirectories.includes(blogImageUploadKey)){
                this.setState({
                    status: `image ${blogImageUploadKey} exists on server`,
                    isLoading: false
                });
                return;
            }
            
            //upload photo
            let s3Params = {
                Key: blogImageUploadKey,
                Body: file,
                Bucket: AWS_S3_BUCKET_NAME,
                ACL: 'public-read'
            };
            
            this.state.awsS3.upload(s3Params, (err, data) => {
                if (err) {
                    this.setState({status: 'Error'});
                    console.log('There was an error listing your albums: ', err.message);
                }
                this.setState({
                    status: 'Photo uploaded successful',
                    isLoading: false
                });
                this.getBlogDirectories();
            });
        }
    }

    renderBlogDirectories = (blogDirectoryItem, index) => {
        return(
            <div key={index}>
                {blogDirectoryItem}
            </div>
        );
    }

    render(){

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
                        onClick={this.uploadPhoto}
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