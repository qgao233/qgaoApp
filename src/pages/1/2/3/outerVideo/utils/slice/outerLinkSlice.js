import { createSlice } from '@reduxjs/toolkit'
import { initOuterLink,handleResponse } from '../../outerConfig/config'

//列表地址
const outerLinkList = "https://api.apibdzy.com/api.php/provide/vod/?ac=list";
//详细信息地址
const outerLinkDetail = "https://api.apibdzy.com/api.php/provide/vod/?ac=detail";

//createSlice负责生成:
//1. action 类型字符串    action.type      {name}/{reducers.key}
//2. action creator 函数 return action;    函数名和reducers.key同名
//3. action 对象         {type:"",payload:""}
export const outerLinkSlice = createSlice({
    name: 'outerLink',
    initialState: {
        list:outerLinkList,
        detail:outerLinkDetail
    },
    reducers: {
        updateOuterLink: (state, action) => {
            state.list = action.payload.list;
            state.detail = action.payload.detail;
        },
    }
})
//action creator,若要传入参数,参数是action.payload
const { updateOuterLink } = outerLinkSlice.actions
//reducer
export default outerLinkSlice.reducer


//组件不能直接与 Redux store 对话，因为组件文件中不能引入 store
//React-Redux 库 有 [一组自定义 hooks，允许你的 React 组件与 Redux store 交互]
//在组件中用 useSelector 负责为我们在幕后获得state
//在组件中用 useDispatch 来 dispatch action
export const selectOuterLink = state => state.outerLink;


// thunk action
// init
const retrieveOuterLink = "https://qgao233.github.io/qgaoApp/"+"outerVideo/outerLink.json";
export const updateOuterLinkAsync = () => {
    return async (dispatch, getState) => {
        try {
            let jsonData = await fetch(retrieveOuterLink).then(handleResponse);
            if (jsonData != null) {
                dispatch(updateOuterLink(jsonData))
                initOuterLink(jsonData);
            }
        } catch (err) {
            console.log("updateOuterLinkAsync", err);
        }

    }
}

