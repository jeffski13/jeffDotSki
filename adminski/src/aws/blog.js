import {awsApiKey} from '../configski';

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