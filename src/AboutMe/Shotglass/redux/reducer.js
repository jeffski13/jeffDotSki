import { GET_SHOT_GLASS_INFO } from './actions';

export default function (state={}, action){
  console.log('jeffski', action.type);
  switch (action.type){
    case `${GET_SHOT_GLASS_INFO}_FULFILLED`:
      console.log('jeffski', action.payload.data);
      return action.payload.data;
    default:
  }
  return state;
}