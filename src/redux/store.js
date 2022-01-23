import { configureStore } from '@reduxjs/toolkit'
//从各个模块中引入的reducer
import reduxReducer from '../pages/1/2/3/demo/reduxSlice'
import topicTrendsNumReducer from '../utils/slice/topicTrendsNumSlice'
import topicTrendsReducer from '../utils/slice/topicTrendsSlice'
import loginStatusReducer from '../pages/1/2/3/utils/slice/loginStatusSlice'
import outerRecentBrowseReducer from '../pages/1/2/3/outerVideo/recentBrowse/outerRecentBrowseSlice'


//设置store的同时，默认还会自动在 store setup 中添加几个中间件以提供良好的开发者体验，如thunk
export default configureStore({
  reducer: {
    reduxDemo: reduxReducer,     //切片slice
    topicTrendsNum:topicTrendsNumReducer,
    topicTrends:topicTrendsReducer,

    loginStatus:loginStatusReducer,//登录状态
    outerRecentBrowse:outerRecentBrowseReducer,//外链影视最近浏览

  }
})