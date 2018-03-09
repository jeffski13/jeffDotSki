import { GET_BLOG_LIST } from './actions';

export default function (state={}, action){
  switch (action.type){
    case `${GET_BLOG_LIST}_FULFILLED`:
      return action.payload.data;
    default:
  }
  return state;
}