import axios from 'axios';

export const GET_BLOG_ACTION='GET_BLOG_ACTION';

export function getBlog(refUrl){
  let blogRequest = axios.get(refUrl);

  return{
    type: GET_BLOG_ACTION,
    payload: blogRequest,
    blogUrl: refUrl
  }
}