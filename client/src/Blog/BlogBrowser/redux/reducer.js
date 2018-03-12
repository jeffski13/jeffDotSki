import { READMORE_BLOG_CLICKED } from './actions';

export default function (state={}, action){
  switch (action.type){
    case READMORE_BLOG_CLICKED:
      return action.payload;
    default:
  }
  return state;
}