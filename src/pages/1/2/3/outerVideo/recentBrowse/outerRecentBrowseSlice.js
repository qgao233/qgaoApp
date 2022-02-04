import { createSlice } from '@reduxjs/toolkit'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUniqueId } from 'react-native-device-info';
import { isEmptyObject } from '../../../../../../utils/funcKits';

//createSlice负责生成:
//1. action 类型字符串    action.type      {name}/{reducers.key}
//2. action creator 函数 return action;    函数名和reducers.key同名
//3. action 对象         {type:"",payload:""}
export const outerRecentBrowseSlice = createSlice({
    name: 'outerRecentBrowse',
    initialState: {
        uniqueId: "-1",
        browseList: [
            {
                visitedVideoId: 233,
                visitedEpisodeId: 233,
                visitedEpisodeName: "name",
                visitedTime: undefined,
                visitedProgress: undefined,
            },
        ]
    },
    reducers: {
        initOuterRecentBrowse: (state, action) => {
            //不能直接：state = action.payload,
            state.uniqueId = action.payload.uniqueId;
            state.browseList = action.payload.browseList;
        },
        addOuterRecentBrowse: (state, action) => {
            let found = false;
            state.browseList.forEach((v, i) => {
                if (v.visitedVideoId == action.payload.visitedVideoId
                    && v.visitedEpisodeId == action.payload.visitedEpisodeId) {
                    found = true;
                    v.visitedTime = action.payload.visitedTime;
                }
            })
            if (!found) {
                //整个storage只能有8M（可以更改）,单个item只能保存2M，
                //根据实际计算，约束当前item中数组长度最大为5000
                if (state.browseList.length > 5000) {
                    state.browseList.splice(0, 1);
                }
                state.browseList.unshift(action.payload);

            } else {
                state.browseList.sort((a, b) => b.visitedTime - a.visitedTime);
            }
        },
        deleteOuterRecentBrowse: (state, action) => {
            if (isEmptyObject(action.payload)) {
                state.browseList = [];
                return;
            }
            let found = false;
            let index = -1;
            state.browseList.forEach((v, i) => {
                if (v.visitedVideoId == action.payload.visitedVideoId
                    && v.visitedEpisodeId == action.payload.visitedEpisodeId) {
                    found = true;
                    index = i;
                }
            });
            if (found) {
                state.browseList.splice(index, 1);
            }
        },
        updateOuterRecentBrowse: (state, action) => {
            state.browseList.forEach((v, i) => {
                if (v.visitedVideoId == action.payload.visitedVideoId
                    && v.visitedEpisodeId == action.payload.visitedEpisodeId) {
                    v.visitedProgress = action.payload.visitedProgress;
                }
            })
        }
    }
})
//action creator,若要传入参数,参数是action.payload
export const { initOuterRecentBrowse,
    addOuterRecentBrowse,
    deleteOuterRecentBrowse,
    updateOuterRecentBrowse } = outerRecentBrowseSlice.actions
//reducer
export default outerRecentBrowseSlice.reducer


//组件不能直接与 Redux store 对话，因为组件文件中不能引入 store
//React-Redux 库 有 [一组自定义 hooks，允许你的 React 组件与 Redux store 交互]
//在组件中用 useSelector 负责为我们在幕后获得state
//在组件中用 useDispatch 来 dispatch action
export const selectOuterRecentBrowse = state => state.outerRecentBrowse;

const cacheName = "OUTER_RECENT_BROWSE";

// thunk action
// init
export const initOuterRecentBrowseAsync = () => {
    return async (dispatch, getState) => {
        try {
            let uniqueId = getUniqueId();
            let jsonData = JSON.parse(await AsyncStorage.getItem(cacheName));
            if (jsonData == null || jsonData.browseList.length == 0) {
                jsonData = {
                    uniqueId: uniqueId,
                    browseList: [
                        // {
                        //     visitedVideoId:70683,
                        //     visitedTime:1642826662000,
                        //     visitedEpisodeId:1,
                        //     visitedEpisodeName:"第2集",
                        // }
                    ],
                }
            }
            dispatch(initOuterRecentBrowse(jsonData))
        } catch (err) {
            console.log("initOuterRecentBrowseAsync", err);
        }

    }
}

export const addOuterRecentBrowseAsync = (payload) => {
    return async (dispatch, getState) => {
        try {
            dispatch(addOuterRecentBrowse(payload))
            //await 某个异步操作
            AsyncStorage.setItem(cacheName, JSON.stringify(getState().outerRecentBrowse));
        } catch (err) {
            console.log("addOuterRecentBrowseAsync", err);
        }

    }
}

export const deleteOuterRecentBrowseAsync = (payload) => {
    return async (dispatch, getState) => {
        try {
            dispatch(deleteOuterRecentBrowse(payload))
            //await 某个异步操作
            AsyncStorage.setItem(cacheName, JSON.stringify(getState().outerRecentBrowse));
        } catch (err) {
            console.log("deleteOuterRecentBrowseAsync", err);
        }

    }
}

let updateInterval = null;

export const updateOuterRecentBrowseAsync = (payload) => {
    return async (dispatch, getState) => {
        try {
            dispatch(updateOuterRecentBrowse(payload))
            //await 某个异步操作
            if (updateInterval == null) {
                updateInterval = setInterval(() => {
                    AsyncStorage.setItem(cacheName, JSON.stringify(getState().outerRecentBrowse));
                    clearInterval(updateInterval);
                    updateInterval = null;
                }, 60000);//一分钟更新一次sqlLite
            }
        } catch (err) {
            console.log("updateOuterRecentBrowseAsync", err);
        }

    }
}
