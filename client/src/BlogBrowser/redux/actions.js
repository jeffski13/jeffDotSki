import axios from 'axios';

export const GET_BLOG_LIST = 'GET_BLOG_LIST';
const BLOG_URL_ROOT = 'https://s3.us-east-2.amazonaws.com/jeff.ski/';

export function getBlogList(){
  let blogListRequest = axios.get(BLOG_URL_ROOT + 'blog/' + 'chile.json');
  return {
    type: GET_BLOG_LIST,
    payload: blogListRequest
  }
}