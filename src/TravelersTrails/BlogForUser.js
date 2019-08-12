import axios from 'axios';
import { Auth, Storage } from 'aws-amplify';
import uuidv1 from 'uuid/v1';
import { defaultErrorResponse } from './Network/consts';

/**
 * upload image to AWS S3 blogs "directory"
 *
 * @param {object} blogPicFile - photo file
 * @param {string} userId - author user id for this photo
 * @param {string} tripId - trip id for this photo
 * @param {function} callback - (error, data) - function with error/data information from s3
 */
export function uploadBlogPic(blogPicFile, userId, tripId, callback) {
    Auth.currentAuthenticatedUser({
        bypassCache: true  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    }).then((user) => {
        let idTokenJwt = user.signInUserSession.idToken.jwtToken

        if (!blogPicFile || !userId || userId === '' || !tripId || tripId === '') {
            callback({ message: "No file or userId or tripId while trying to upload photo!" });
            return;
        }

        //create unique key for every photo file (cant put under blog id because it may not exist yet)
        let fileName = uuidv1();
        let blogImageUploadKey = `${userId}/trips/${tripId}/${fileName}`;
        let blogImageFileType = blogPicFile.type;

        Storage.put(blogImageUploadKey, blogPicFile, {
            level: 'public',
            contentType: blogImageFileType
        })
        .then(result => {
                const uploadFileUrlPrefix = 'https://s3.us-east-2.amazonaws.com/jeff.ski.blogski/public/';
                callback(null, `${uploadFileUrlPrefix}${result.key}`)
            })
            .catch(err => {
                callback({
                    message: "An error occured while trying to upload the blog pic!",
                    error: err
                });
            });
    }).catch((err) => {
        console.log('ERROR getting current auth user: ', err)
    });
}

/**
 * updates a blog users info
 * 
 * @param {string} userId - the id of the blog user
 * @param {string} tripId - the id of the trip
 * @param {object} tripInfo - information abot the new blog
 * @param {function} callback - (err, data) - function which will return the success or an error from aws
 */
export const createBlogSecure = (userId, tripId, blogInfo, callback) => {
    Auth.currentAuthenticatedUser({
        bypassCache: true  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    }).then(user => {
        let idTokenJwt = user.signInUserSession.idToken.jwtToken
        axios({
            method: 'POST',
            url: `https://me41kdv4y4.execute-api.us-east-2.amazonaws.com/Prod/${userId}/trips/${tripId}/blogs`,
            data: blogInfo,
            headers: {
                'Authorization': idTokenJwt
            }
        })
        .then(response => {
                //parse the response
                let rawUserResponseArr = response.data;
                
                callback(null, rawUserResponseArr);
            })
            .catch(error => {
                if (error.response) {
                    return callback(error.response);
                }
                return callback(defaultErrorResponse);
            });

    }).catch(err => {
        console.log('ERROR creating blog: ', err)
    });
}