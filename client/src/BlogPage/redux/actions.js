import axios from 'axios';

const BLOG_URL_ROOT = 'https://s3.us-east-2.amazonaws.com/jeff.ski/';

export const GET_BLOG_CURRENT_ACTION='GET_BLOG_CURRENT_ACTION';

export function getCurrentBlog(){
  let blogRequest = axios.get(BLOG_URL_ROOT +  'blog/chile/' + '2017_10_14' + '.json');

  return{
    type: GET_BLOG_CURRENT_ACTION,
    payload: blogRequest
  }
}