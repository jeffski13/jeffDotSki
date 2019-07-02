import axios from 'axios';
import { defaultErrorResponse } from './Network/consts';
import { Auth, Storage } from 'aws-amplify';

export const tripsGetFailMessage = 'We were not able to get your trip information at this time.';
const mockErrorResponse = {
    "status": 409,
    "headers": {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true
    },
    "data": { "code": "BadRequest", "message": "Uh oh! We already have a trip with that name of Its Trippay2!. Please send a trip with a unique name." }
};

/**
 * gets user info (name, email, trips owned, etc.)
 * 
 * @param {string} userId - the id of the user which we want
 * @param {function} callback - (err, data) - function which will return the blogs or an error from aws
 */
export function getTripsSecure(userId, callback) {
    Auth.currentAuthenticatedUser({
        bypassCache: true  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    }).then((user) => {
        let idTokenJwt = user.signInUserSession.idToken.jwtToken
        axios({
            method: 'GET',
            url: `https://me41kdv4y4.execute-api.us-east-2.amazonaws.com/Prod/${userId}/trips`,
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
        axios({
            method: 'GET',
            url: `https://864wf8s3oi.execute-api.us-east-2.amazonaws.com/Prod/${userId}/trips`,
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
    });

}

/**
 * updates a blog users info
 * 
 * @param {string} userId - the id of the blog user
 * @param {string} tripId - the id of the trip user
 * @param {object} tripUpdateInfo - information for the updated trip
 * @param {function} callback - (err, data) - function which will return the blogs or an error from aws
 */
export function updateTripSecure(userId, tripId, tripUpdateInfo, callback) {
    Auth.currentAuthenticatedUser({
        bypassCache: true  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    }).then((user) => {
        let idTokenJwt = user.signInUserSession.idToken.jwtToken
        axios({
            method: 'PUT',
            url: `https://me41kdv4y4.execute-api.us-east-2.amazonaws.com/Prod/${userId}/trips/${tripId}`,
            data: tripUpdateInfo,
            headers: {
                'Authorization': idTokenJwt
            }
        })
            .then((response) => {
                //parse the response
                let rawUserResponse = response.data;

                callback(null, rawUserResponse);
            })
            .catch(function (error) {
                if (error.response) {
                    return callback(error.response);
                }
                return callback(defaultErrorResponse);
            });

    }).catch((err) => {
        console.log('ERROR updating trip: ', err)
    });
}

/**
 * updates a blog users info
 * 
 * @param {string} userId - the id of the blog user
 * @param {object} tripInfo - information abot the new trip
 * @param {function} callback - (err, data) - function which will return the blogs or an error from aws
 */
export function createTripSecure(userId, tripInfo, callback) {
    Auth.currentAuthenticatedUser({
        bypassCache: true  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    }).then((user) => {
        let idTokenJwt = user.signInUserSession.idToken.jwtToken
        axios({
            method: 'POST',
            url: `https://me41kdv4y4.execute-api.us-east-2.amazonaws.com/Prod/${userId}/trips/`,
            data: tripInfo,
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
        console.log('ERROR creating trip: ', err)
    });
}