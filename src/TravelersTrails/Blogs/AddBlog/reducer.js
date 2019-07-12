import {STORE_BLOG_DATE} from './actions';
import moment from 'moment';

//default blog
const initialState = {
    blogText: null,
    date: moment()
};

export default (state = initialState, action) => {
    if (action.type === STORE_BLOG_DATE) {
        return {
            ...state,
            date: action.payload
        };
    }
    return state;

}