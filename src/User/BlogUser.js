import axios from 'axios';
import { defaultErrorResponse } from '../Network/consts';
import { Auth, Storage } from 'aws-amplify';

import uuidv1 from 'uuid/v1';

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
            .catch((error) => {
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
    Auth.currentAuthenticatedUser({
        bypassCache: true  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    }).then((user) => {
        let idTokenJwt = user.signInUserSession.idToken.jwtToken

        console.log('propfilepic is', profilePicFile);
        if (!profilePicFile || !userId || userId === '') {
            callback({ message: "No file or userId while trying to upload photo!" });
            return;
        }

        let fileName = uuidv1();
        if (profilePicFile.name) {
            fileName += profilePicFile.name;
        }
        let blogImageUploadKey = `${userId}/profile/${fileName}`;
        let blogImageFileType = profilePicFile.type;
        
        Storage.put(blogImageUploadKey, profilePicFile, {
            level: 'public',
            contentType: blogImageFileType
        })
            .then((result) => {
                const uploadFileUrlPrefix = 'https://s3.us-east-2.amazonaws.com/jeff.ski.blogski/public/';
                callback(null, `${uploadFileUrlPrefix}${result.key}`)
            })
            .catch((err) => {
                callback({
                    message: "An error occured while trying to upload the profile pic!",
                    error: err
                });
            });
    }).catch((err) => {
        console.log('ERROR getting current auth user: ', err)
    });

}