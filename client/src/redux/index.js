import { combineReducers } from 'redux';
import getBlogReducer from '../Blog/getBlogReducer';
import getBlogListReducer from '../Blog/getBlogListReducer';

const rootReducer = combineReducers({
  blogs: getBlogReducer,
  blogList: getBlogListReducer
});

export default rootReducer;
