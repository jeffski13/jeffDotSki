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
            isLoading: false
        };
    }

    componentDidMount(){
        this.getS3List();
    }
    
    handleImgFileChange = (e) => {
        this.setState({ imgFile: e.target.files });
    }
    
    getS3List = () => {
        let s3Params = {Bucket: AWS_S3_BUCKET_NAME};
        this.state.awsS3.listObjects(s3Params, (err, data) => {
            if (err) {
                console.log('There was an error listing your albums: ', err.message);
            }
            else {
                console.log('jeffski did it good! s3 data', data);
                //you got data! wonderful, now put it into a readable array
                let rawContentsArr = data.Contents;
                //turn into string array of directories
                let directoriesArr = [];
                rawContentsArr.forEach(function(contentsItem){
                    directoriesArr.push(contentsItem.Key);
                });
                let blogDirectoriesArr = directoriesArr.filter(directoryName => directoryName.startsWith("blog/"));
                // callback(blogDirectoriesArr);
                this.setState({blogDirectories: blogDirectoriesArr});
            }
        });
    }
    
    
    onCreateClicked = () =>{
        console.log('jeffski on create clicked');

        //all to get album name
        let albumName = 'testAlbumFromAdminski';
        if (!albumName) {
            return alert('Album names must contain at least one non-space character.');
        }
        if (albumName.indexOf('/') !== -1) {
            return alert('Album names cannot contain slashes.');
        }
        var albumKey = encodeURIComponent(albumName) + '/';
        
        let s3Params = {
            Key: albumKey,
            Bucket: AWS_S3_BUCKET_NAME
        };
        this.state.awsS3.headObject(s3Params, (err, data) => {
            if(!err) {
                return console.log('Album already exists.');
            }
            if(err.code !== 'NotFound') {
                return console.log('There was an error creating your album: ' + err.message);
            }
            this.state.awsS3.putObject(s3Params, (err, data) => {
                if(err) {
                    return console.log('There was an error creating your album: ' + err.message);
                }
                console.log('Successfully created album.');
                // viewAlbum(albumName);
            });
        });
    }
    
    onSendClicked = () => {
        //set state to loading so user cant submit blog twice
        // and loading indicator appears
        this.setState({ isLoading: true });

        for(let i = 0; i < this.state.imgFile.length; i++){
            var file = this.state.imgFile[i];
            let fileName = file.name;
            let albumName = 'testAlbumFromAdminski';
            let albumPhotosKey = encodeURIComponent(albumName) + '/';
    
            let photoKey = albumPhotosKey + fileName;
    
            let s3Params = {
                Key: photoKey,
                Body: file,
                Bucket: AWS_S3_BUCKET_NAME,
                ACL: 'public-read'
            };
            this.state.awsS3.upload(s3Params, function(err, data) {
                if (err) {
                    console.log('There was an error listing your albums: ', err.message);
                }
                console.log('jeffski did it good! s3 data', data);
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
                            value={this.state.image}
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
                        onClick={this.onSendClicked}
                    >
                        Send Image
                    </Button>
                    <Button 
                        bsStyle="primary" 
                        bsSize="large"
                        onClick={this.onCreateClicked}
                    >
                        Create Album
                    </Button>
                </ButtonToolbar>
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