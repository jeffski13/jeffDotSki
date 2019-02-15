export const STORE_AUTH_STATE = 'STORE_AUTH_STATE';
export const STORE_USER_INFO = 'STORE_USER_INFO';

export function storeAuthState(authState){
  return {
    type: STORE_AUTH_STATE,
    payload: authState
  }
}

export function storeUserInfo(userInfo){
  return {
    type: STORE_USER_INFO,
    payload: userInfo
  }
}

