import { combineReducers } from 'redux';
import getBlogReducer from '../Blog/getBlogReducer';
import getBlogListReducer from '../Blog/getBlogListReducer';
import getShotGlassInfoReducer from '../AboutMe/Shotglass/redux/reducer';

const rootReducer = combineReducers({
  blogs: getBlogReducer,
  blogList: getBlogListReducer,
  shotGlassInfo: getShotGlassInfoReducer
});

export default rootReducer;
