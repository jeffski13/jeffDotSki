import {awsApiKey} from '../configski';
import axios from 'axios';

/**
 * uploads a specified blog to aws
 * 
 * @param {object} blogData - data for the blog being uploaded
 * @param {function} callback - (err, data) - function which will return error or data from aws
 */
export function uploadBlog(blogData, callback){
    axios({
        method: 'post',
        url: `https://ctbw9plo6d.execute-api.us-east-2.amazonaws.com/Prod/blogs`,
        headers: { 'x-api-key': awsApiKey },
        data: blogData
    })
    .then((response) => {
        callback(null, response);
    })
    .catch((error) => {
        callback(error);
    });
}

/**
 * gets all blogs for a given trip
 * 
 * @param {string} tripName - the name of the trip for which you want the blogs
 * @param {function} callback - (err, data) - function which will return the blogs or an error from aws
 */
export function getBlogs(tripName, callback){
    axios({
        method: 'get',
        url: `https://ctbw9plo6d.execute-api.us-east-2.amazonaws.com/Prod/blogs?tripName=${tripName}`,
        headers: { 'x-api-key': awsApiKey }
    })
    .then((response) => {
        //parse the response
        let rawBlogResponseArr = response.data;

        callback(null, rawBlogResponseArr);
    })
    .catch(function (error) {
        callback(error);
    });
}