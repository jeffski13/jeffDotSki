import { STORE_USER_INFO, STORE_AUTH_STATE } from './actions';
import { AUTH_STATE_LOGIN_LOADING } from './consts';
//default logged out
const initialState = {
    authState: {
        isLoggedIn: false,
        isLoading: false,
        currentState: AUTH_STATE_LOGIN_LOADING,
        hasDoneInitialAuthCheck: false
    }
};

export default function (state = initialState, action) {
    if (action.type === STORE_AUTH_STATE) {
        return {
            ...state,
            authState: {...state.authState, ...action.payload}
            
        };
    }
    if (action.type === STORE_USER_INFO) {
        return {
            ...state,
            userInfo: {...state.userInfo, ...action.payload}
        };
    }
    return state;

}