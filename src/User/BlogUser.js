import axios from 'axios';
import {defaultErrorResponse} from '../Network/consts';
import { Auth } from 'aws-amplify';

/**
 * gets user info (name, email, trips owned, etc.)
 * 
 * @param {string} userId - the id of the user which we want
 * @param {function} callback - (err, data) - function which will return the blogs or an error from aws
 */
export function getBlogUserSecure(userId, callback){
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
            if(error.response){
                return callback(error.response);
            }
            return callback(defaultErrorResponse);
        });
    }).catch((err) => {
        console.log('ERROR getting current auth user: ', err)
    });

}

/**
 * gets user info (name, email, trips owned, etc.)
 * 
 * @param {string} userId - the id of the user which we want
 * @param {object} userSignupInfo - information such at first, last name, date of birth, etc. for signup
 * @param {function} callback - (err, data) - function which will return the blogs or an error from aws
 */
export function createBlogUserSecure(userId, userSignupInfo, callback){
    console.log('body create blog user is ', userSignupInfo);
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
        if(error.response){
            return callback(error.response);
        }
        return callback(defaultErrorResponse);
    });
}