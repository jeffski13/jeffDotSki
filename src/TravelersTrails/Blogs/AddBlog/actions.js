export const STORE_BLOG_DATE = 'STORE_BLOG_DATE';

export function storeBlogDate(blogDate){
  return {
    type: STORE_BLOG_DATE,
    payload: blogDate
  }
}
