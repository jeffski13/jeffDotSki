import { GET_BLOG_ACTION } from '../actions/getblog';

export default function (state={}, action){
  console.log('jeffski, inside action reducer thing', action.type);

  switch (action.type) {
    case GET_BLOG_ACTION:
      console.log('jeffski, payload', action.payload.data);
      return action.payload.data;
      break;
    default:
  }
  return state;
}
