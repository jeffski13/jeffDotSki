import { combineReducers } from 'redux';
import getBlogReducer from '../Blogs/getBlogReducer';
import getBlogListReducer from '../Blogs/getBlogListReducer';
import getShotGlassInfoReducer from '../AboutMe/Shotglass/redux/reducer';
import authReducer from '../User/Auth/reducer';

const rootReducer = combineReducers({
  blogs: getBlogReducer,
  blogList: getBlogListReducer,
  shotGlassInfo: getShotGlassInfoReducer,
  reduxBlogAuth: authReducer
});

export default rootReducer;
