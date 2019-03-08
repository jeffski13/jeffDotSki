import axios from 'axios';
import { defaultErrorResponse } from '../Network/consts';
import { Auth } from 'aws-amplify';
import AWS from 'aws-sdk';
import uuidv1 from 'uuid/v1';

import { AWS_S3_BUCKET_NAME, AWS_S3_REGION, AWS_IDENTITY_POOL_ID_AWS_ACCESS } from './AWS_CONSTS';

export const emptyProfileUrl = 'https://s3.us-east-2.amazonaws.com/jeff.ski/blog/alone-anime-art-262272.jpg';
export const profileGetFailMessage = 'We were not able to get your profile information at this time.';

/**
 * gets user info (name, email, trips owned, etc.)
 * 
 * @param {string} userId - the id of the user which we want
 * @param {function} callback - (err, data) - function which will return the blogs or an error from aws
 */
export function getBlogUserSecure(userId, callback) {
    Auth.currentAuthenticatedUser({
        bypassCache: true  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    }).then((user) => {
        let idTokenJwt = user.signInUserSession.idToken.jwtToken

        axios({
            method: 'GET',
            url: `https://me41kdv4y4.execute-api.us-east-2.amazonaws.com/Prod/${userId}`,
            headers: {
                'Authorization': idTokenJwt
            }
        })
            .then((response) => {
                //parse the response
                let rawUserResponseArr = response.data;

                callback(null, rawUserResponseArr);
            })
            .catch(function (error) {
                if (error.response) {
                    return callback(error.response);
                }
                return callback(defaultErrorResponse);
            });
    }).catch((err) => {
        console.log('ERROR getting current auth user: ', err)
    });

}

/**
 * creates a new blog user
 * 
 * @param {string} userId - the id of the user which we already exists in aws (cognito), but does is not yet a blog user
 * @param {object} userSignupInfo - information such at first, last name, date of birth, etc. for signup
 * @param {function} callback - (err, data) - function which will return the blogs or an error from aws
 */
export function createBlogUserSecure(userId, userSignupInfo, callback) {
    axios({
        method: 'POST',
        url: `https://me41kdv4y4.execute-api.us-east-2.amazonaws.com/Prod/${userId}`,
        data: userSignupInfo
    })
        .then((response) => {
            //parse the response
            let rawUserResponseArr = response.data;

            callback(null, rawUserResponseArr);
        })
        .catch(function (error) {
            if (error.response) {
                return callback(error.response);
            }
            return callback(defaultErrorResponse);
        });
}

/**
 * updates a blog users info
 * 
 * @param {string} userId - the id of the blog user
 * @param {object} userUpdateInfo - information such at first, last name, date of birth, etc. for update
 * @param {function} callback - (err, data) - function which will return the blogs or an error from aws
 */
export function updateBlogUserSecure(userId, userUpdateInfo, callback) {
    Auth.currentAuthenticatedUser({
        bypassCache: true  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    }).then((user) => {
        let idTokenJwt = user.signInUserSession.idToken.jwtToken
        axios({
            method: 'PUT',
            url: `https://me41kdv4y4.execute-api.us-east-2.amazonaws.com/Prod/${userId}`,
            data: userUpdateInfo,
            headers: {
                'Authorization': idTokenJwt
            }
        })
            .then((response) => {
                //parse the response
                let rawUserResponseArr = response.data;

                callback(null, rawUserResponseArr);
            })
            .catch(function (error) {
                if (error.response) {
                    return callback(error.response);
                }
                return callback(defaultErrorResponse);
            });
        
    }).catch((err) => {
        console.log('ERROR getting current auth user: ', err)
    });
}

/**
 * upload image to AWS S3 blogs "directory"
 *
 * @param {object} profilePicFile - photo file
 * @param {string} userId - name of the trip for this photo
 * @param {function} callback - (error, data) - function with error/data information from s3
 */
export function uploadProfilePic(profilePicFile, userId, callback) {
    console.log('propfilepic is', profilePicFile);
    console.log('userId is', userId);
    if(!profilePicFile || !userId || userId === ''){
        callback({ message: "No file or userId while trying to upload photo!"});
        return;
    }

    let fileName = uuidv1();
    if(profilePicFile.name){
        fileName += profilePicFile.name;
    }
    let blogImageUploadKey = `${userId}/profile/${fileName}`;

    AWS.config.update({
        region: AWS_S3_REGION,
        credentials: new AWS.CognitoIdentityCredentials({
            IdentityPoolId: AWS_IDENTITY_POOL_ID_AWS_ACCESS
        })
    });
    let awsS3client = new AWS.S3({ apiVersion: '2006-03-01' });

    //upload photo
    let s3Params = {
        Key: blogImageUploadKey,
        Body: profilePicFile,
        Bucket: AWS_S3_BUCKET_NAME,
        ACL: 'public-read'
    };

    console.log('aws upload');
    awsS3client.upload(s3Params, (err, data) => {
        console.log('aws upload done');
        callback(err, data);
    });
}