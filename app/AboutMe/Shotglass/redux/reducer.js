import { GET_SHOT_GLASS_INFO } from './actions';

export default function (state={}, action){
  switch (action.type){
    case `${GET_SHOT_GLASS_INFO}_FULFILLED`:
      return action.payload.data;
    default:
  }
  return state;
}