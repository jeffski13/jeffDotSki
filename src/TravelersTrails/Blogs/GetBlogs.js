import axios from 'axios';
import {AWS_API_KEY_READONLY} from '../Network/consts';
import {defaultErrorResponse} from '../Network/consts';

/**
 * gets all blogs for a given trip
 * 
 * @param {string} tripName - the name of the trip for which you want the blogs
 * @param {function} callback - (err, data) - function which will return the blogs or an error from aws
 */
export function getBlogs(tripId, callback){
    console.log('getting blogs without auth');
    axios({
        method: 'get',
        url: `https://864wf8s3oi.execute-api.us-east-2.amazonaws.com/Prod/alltripblogs?tripId=${tripId}`,
        headers: { 'x-api-key': AWS_API_KEY_READONLY }
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
}