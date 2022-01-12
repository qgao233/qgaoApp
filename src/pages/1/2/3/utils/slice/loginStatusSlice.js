import { createSlice } from '@reduxjs/toolkit'

//createSlice负责生成:
//1. action 类型字符串    action.type      {name}/{reducers.key}
//2. action creator 函数 return action;    函数名和reducers.key同名
//3. action 对象         {type:"",payload:""}
export const loginStatusSlice = createSlice({
    name: 'loginStatus',
    initialState: {
        value:false
    },
    reducers: {
        changeLoginStatus:(state,action)=>{
            state.value = action.payload;
        }
    }
})
//action creator,若要传入参数,参数是action.payload
export const { changeLoginStatus } = loginStatusSlice.actions
//reducer
export default loginStatusSlice.reducer


//组件不能直接与 Redux store 对话，因为组件文件中不能引入 store
//React-Redux 库 有 [一组自定义 hooks，允许你的 React 组件与 Redux store 交互]
//在组件中用 useSelector 负责为我们在幕后获得state
//在组件中用 useDispatch 来 dispatch action
export const selectLoginStatus = state => state.loginStatus.value

