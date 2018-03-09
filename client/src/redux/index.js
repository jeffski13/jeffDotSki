import { combineReducers } from 'redux';
import BlogReducer from '../Blog/reducer';
import CurrentBlogReducer from '../BlogPage/redux/reducer';
import BlogListReducer from '../BlogBrowser/redux/reducer';

const rootReducer = combineReducers({
  blogs: BlogReducer,
  currentBlog: CurrentBlogReducer,
  blogList: BlogListReducer
});

export default rootReducer;
