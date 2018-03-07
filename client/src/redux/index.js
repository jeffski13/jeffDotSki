import { combineReducers } from 'redux';
import BlogReducer from '../BlogPage/redux/reducer';
import BlogListReducer from '../BlogBrowser/redux/reducer';

const rootReducer = combineReducers({
  currentBlog: BlogReducer,
  blogList: BlogListReducer
});

export default rootReducer;
