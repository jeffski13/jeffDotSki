import { combineReducers } from 'redux';
import BlogReducer from './BlogReducer';

const rootReducer = combineReducers({
  currentBlog: BlogReducer
});

export default rootReducer;
