import { combineReducers } from 'redux';
import getBlogReducer from '../TravelersTrails/Blogs/getBlogReducer';
import getBlogListReducer from '../TravelersTrails/Blogs/getBlogListReducer';
import getShotGlassInfoReducer from '../AboutMe/Shotglass/redux/reducer';
import getBlogCreationReducer from '../TravelersTrails/Blogs/AddBlog/reducer';
import authReducer from '../TravelersTrails/Auth/reducer';

const rootReducer = combineReducers({
  blogs: getBlogReducer,
  blogList: getBlogListReducer,
  blogCreation: getBlogCreationReducer,
  shotGlassInfo: getShotGlassInfoReducer,
  reduxBlogAuth: authReducer
});

export default rootReducer;
