import { GET_BLOG_ACTION } from './actions';

export default function (state={}, action){

  switch (action.type) {
    case `${GET_BLOG_ACTION}_FULFILLED`:
      console.log('jeffski action', action);
      if(action.payload.data){
        let key = action.payload.data.links[0].href;
        return {
          ...state,
          [key] : action.payload.data
        };
      }
      break;
    default:
  }
  return state;

}