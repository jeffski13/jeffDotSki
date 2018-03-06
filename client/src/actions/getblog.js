import axios from 'axios';

export const GET_BLOG_ACTION='GET_BLOG_ACTION';
const BLOG_URL_ROOT = 'https://s3.us-east-2.amazonaws.com/jeff.ski/';

export function getCurrentBlog(){
  console.log('jeffski: getting blog');
  let blogRequest = axios.get(BLOG_URL_ROOT +  'blog/chile/' + '2017_10_14' + '.json');

  return{
    type: GET_BLOG_ACTION,
    payload: blogRequest
  }
}
