import { configureStore } from '@reduxjs/toolkit'
//从各个模块中引入的reducer
import reduxReducer from '../pages/1/2/3/demo/reduxSlice'
import topicTrendsNumReducer from '../utils/slice/topicTrendsNumSlice'
import topicTrendsReducer from '../utils/slice/topicTrendsSlice'
import loginStatusReducer from '../pages/1/2/3/utils/slice/loginStatusSlice'
import outerRecentBrowseReducer from '../pages/1/2/3/outerVideo/utils/slice/outerRecentBrowseSlice'
import outerLinkReducer from '../pages/1/2/3/outerVideo/utils/slice/outerLinkSlice'

import { useDispatch } from 'react-redux'
import {updateOuterLinkAsync} from '../pages/1/2/3/outerVideo/utils/slice/outerLinkSlice';

//设置store的同时，默认还会自动在 store setup 中添加几个中间件以提供良好的开发者体验，如thunk
const store = configureStore({
  reducer: {
    reduxDemo: reduxReducer,     //切片slice
    topicTrendsNum:topicTrendsNumReducer,
    topicTrends:topicTrendsReducer,

    loginStatus:loginStatusReducer,//登录状态
    outerRecentBrowse:outerRecentBrowseReducer,//外链影视最近浏览
    outerLink:outerLinkReducer,//获取外链影视中的外链地址
  }
})

export default store;
//从远程获得链接并初始化
function initOuterLink(){
  store.dispatch(updateOuterLinkAsync());
}
initOuterLink()