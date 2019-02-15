import axios from 'axios';
import {defaultErrorResponse, authErrorResponse} from '../Network/consts';
import { Auth } from 'aws-amplify';

/**
 * gets all blogs for a given trip
 * 
 * @param {string} tripName - the name of the trip for which you want the blogs
 * @param {function} callback - (err, data) - function which will return the blogs or an error from aws
 */
export function getBlogsSecure(userId, tripId, callback){
    Auth.currentAuthenticatedUser({
        bypassCache: true  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    }).then((user) => {
        let idTokenJwt = user.signInUserSession.idToken.jwtToken
        
        axios({
            method: 'GET',
            url: `https://me41kdv4y4.execute-api.us-east-2.amazonaws.com/Prod/${userId}/trips/${tripId}/blogs`,
            headers: {
                'Authorization': idTokenJwt
            }
        })
        .then((response) => {
            //parse the response
            let rawBlogResponseArr = response.data;
    
            callback(null, rawBlogResponseArr);
        })
        .catch(function (error) {
            if(error.response){
                return callback(error.response);
            }
            return callback(defaultErrorResponse);
        });
    }).catch((err) => {
        //not logged in
        
        axios({
            method: 'GET',
            url: `https://864wf8s3oi.execute-api.us-east-2.amazonaws.com/Prod/${userId}/trips/${tripId}/blogs`
        })
        .then((response) => {
            //parse the response
            let rawBlogResponseArr = response.data;
    
            callback(null, rawBlogResponseArr);
        })
        .catch(function (error) {
            if(error.response){
                return callback(error.response);
            }
            return callback(defaultErrorResponse);
        });
        
    });

}