import axios from 'axios';

export const GET_BLOG_ACTION='GET_BLOG_ACTION';
const BLOG_URL = 'http://localhost:3000/blog/7';

export function getCurrentBlog(){
  console.log('jeffski: getting blog');
  let blogRequest = axios.get(BLOG_URL);

  return{
    type: GET_BLOG_ACTION,
    payload: blogRequest
  }
}
