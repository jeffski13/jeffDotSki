import axios from 'axios';

export const GET_SHOT_GLASS_INFO = 'GET_SHOT_GLASS_INFO';
export function getShotGlassInfo(){
  let shotGlassInfo = axios.get('https://s3.us-east-2.amazonaws.com/jeff.ski/aboutme/shotglass.json');

  return{
    type: GET_SHOT_GLASS_INFO,
    payload: shotGlassInfo
  }
}