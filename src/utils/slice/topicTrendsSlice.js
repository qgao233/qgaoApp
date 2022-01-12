import { createSlice } from '@reduxjs/toolkit'

//createSlice负责生成:
//1. action 类型字符串    action.type      {name}/{reducers.key}
//2. action creator 函数 return action;    函数名和reducers.key同名
//3. action 对象         {type:"",payload:""}
export const topicTrendsSlice = createSlice({
    name: 'topicTrends',
    initialState: [
        {
            style_name:"sapphire",
            style_desc:{
                gradient_start:"#1f8be8",
                gradient_end:"#a5e6ff",
                background:"#97CAF6",
            }
        },
        {
            style_name:"ruby",
            style_desc:{
                gradient_start:"#ec1a0a",
                gradient_end:"#ffb3ae",
                background:"#F38981",
            }
        },
        {
            style_name:"cyan",
            style_desc:{
                gradient_start:"#08b4f4",
                gradient_end:"#40eff6",
                background:"#E4F1F5",
            }
        }
    ],
    reducers: {
        addTopicTrend:(state,action)=>{
            state.push(action.payload)
        },
        removeTopicTrend:(state,action)=>{
            state.splice(action.payload.removeIndex,1);
        }
    }
})
//action creator,若要传入参数,参数是action.payload
export const { addTopicTrend,removeTopicTrend } = topicTrendsSlice.actions
//reducer
export default topicTrendsSlice.reducer


//组件不能直接与 Redux store 对话，因为组件文件中不能引入 store
//React-Redux 库 有 [一组自定义 hooks，允许你的 React 组件与 Redux store 交互]
//在组件中用 useSelector 负责为我们在幕后获得state
//在组件中用 useDispatch 来 dispatch action
export const selectTopicTrends = state => state.topicTrends

