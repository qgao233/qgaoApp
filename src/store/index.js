//redux配置
import AppNavigator from './../pages/appNav';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { AsyncStorage } from '@react-native-community/async-storage';
import { createReduxContainer, createReactNavigationReduxMiddleware, createNavigationReducer } from 'react-navigation-redux-helpers';
import { connect } from 'react-redux';
import { stores,cacheNameList } from './stores';

import { NavigationActions } from '@react-navigation/core';

const initAction = {type:"sss"};
const initialState = AppNavigator.router.getStateForAction(initAction, null);
// ======================= middleware/reducer/store

// 创建React Navigation Redux中间件
const middleware = createReactNavigationReduxMiddleware(
    state => state.nav,
    "root",
);
//创建导航状态数据商店redux
const navReducer = createNavigationReducer(AppNavigator);
//结合redux
const appReducer = combineReducers({
    ...stores,
    nav: navReducer
});
//创建数据商店
export const store = createStore(
    appReducer,
    applyMiddleware(middleware),
);

// ======================= 包裹整个 <App>,让整个app都能访问redux

// 生成被redux包裹的导航组件
const App = createReduxContainer(AppNavigator, "root");
const mapStateToProps = (state) => ({
    state: state.nav,
});
export const AppWithNavigationState = connect(mapStateToProps)(App);

//================= 每次启动项目的时候自动把 cacheNameList 里面提供名称的数据填充到redux数据中心

async function setCacheData() {
    for (var item of cacheNameList) {
        let getData = await AsyncStorage.getItem(item);
        if (getData) {
            store.dispatch({
                type: item,
                data: JSON.parse(getData)
            });
        }
    }
};
setCacheData();