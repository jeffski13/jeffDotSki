import axios from 'axios';

export const GET_BLOG_LIST = 'GET_BLOG_LIST';

export function getBlogList(){
  let blogListRequest = axios.get('https://s3.us-east-2.amazonaws.com/jeff.ski/blog/chile.json');
  return {
    type: GET_BLOG_LIST,
    payload: blogListRequest
  }
}


export const GET_BLOG_ACTION='GET_BLOG_ACTION';

export function getBlog(blogUrl) {
  //check to see if data exists
  return (dispatch, getState) => {
    let blog = getState().blogs[blogUrl];

    if (blog) {
      return;
    }

    dispatch(fetchBlogData(blogUrl));
  };
}

function fetchBlogData(blogUrl){
  let blogRequest = axios.get(blogUrl);

  return{
    type: GET_BLOG_ACTION,
    payload: blogRequest,
    blogUrl: blogUrl
  }
}