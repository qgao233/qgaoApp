import React, { useState, useEffect, useRef } from 'react';
import { View, Text, BackHandler } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import AppWelcome from './2/appWelcome';
import DrawerNav from './2/drawerNav';
import ReduxDemo from './2/3/demo/reduxDemo';
import ResponderDemo from './2/3/demo/responderDemo'
import GestureDemo from './2/3/demo/gestureDemo'
import { useNavigationState } from '@react-navigation/native';
import Toast, { DURATION } from 'react-native-easy-toast'

//文章
import ArticleDetail from './2/3/article/articleDetail';
import ArticleResult from './2/3/article/searchResult'

//视频
import VideoDetail from './2/3/video/videoDetail';
import VideoResult from './2/3/video/searchResult'


//外链视频
import OuterVideoHome from './2/3/outerVideo/videoHome';
import OuterVideoDetail from './2/3/outerVideo/videoDetail';
import OuterSearchResult from './2/3/outerVideo/searchResult';
import OuterRecentBrowse from './2/3/outerVideo/recentBrowse';

//我的
import UserInfo from './2/3/account/userInfo'
import MySocial from './2/3/account/mySocial'
import MyCreation from './2/3/account/myCreation'
import MyInteraction from './2/3/account/myInteraction'
import Notification from './2/3/account/notification'
import RecentBrowse from './2/3/account/recentBrowse'
import ShareApp from './2/3/account/shareApp'
import BonusEggs from './2/3/account/bonusEggs'

//设置
import Settings from './2/3/account/settings';
import ToggleTopic from './2/3/account/settings/toggleTopic'
import Suggestion from './2/3/account/settings/suggestion'
import Disclaimer from './2/3/account/settings/disclaimer'
import AboutMe from './2/3/account/settings/aboutMe'

//创建模块
import CreateArticle from './2/3/modules/createArticle';
import CreateVideo from './2/3/modules/createVideo';

//登录/注册
import Register from './2/3/account/register';
import ReceiveCode from './2/3/account/register/receiveCode';
import ModifyPwd from './2/3/account/register/modifyPwd';
import ModifyInfo from './2/3/account/register/modifyInfo';
import Login from './2/3/account/login'


//测试
import WebViewTest from './2/3/test/webViewTest'
import RichEditorTest from './2/3/test/richEditorTest'
import ConfirmCodeTest from './2/3/test/confirmCodeTest'
import RenderHtmlTest from './2/3/test/renderHtmlTest'


const ContentStack = createStackNavigator();

export default () => {
    const [isFirst, setIsFirst] = useState(false);

    const navigationState = useNavigationState(state => state)
    const toastRef = useRef();

    let lastBackPressed = 0;
    let backHandler = 0;
    useEffect(() => {
        backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
            if (navigationState.index == 0) {
                let now = new Date().getTime();
                if (now - lastBackPressed < 1500) {
                    BackHandler.exitApp();
                    return false;
                }
                lastBackPressed = now;
                toastRef.current.show('再后退一次退出应用', 1500);
                return true;
            }
            return false;
        })
        return () => {
            backHandler.remove();
        }
    }, [])

    return (
        <>
            <ContentStack.Navigator screenOptions={{ headerShown: false }}
                // initialRouteName="OuterVideoHome"
            >{/* 更改了路由页面后，要reload才能使页面发生改变 */}

                <ContentStack.Group >
                    {isFirst
                        ? (
                            <ContentStack.Screen name="AppWelcome" component={AppWelcome} />
                        )
                        : (
                            <ContentStack.Screen name="DrawerNav" component={DrawerNav} />
                        )}
                </ContentStack.Group>
                {/* 测试 */}
                <ContentStack.Group screenOptions={{
                    presentation: 'modal',
                    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                    gestureEnabled: true,
                    gestureDirection: "horizontal",
                }}>
                    <ContentStack.Screen name="RichEditorTest" component={RichEditorTest} />
                    <ContentStack.Screen name="WebViewTest" component={WebViewTest} />
                    <ContentStack.Screen name="ConfirmCodeTest" component={ConfirmCodeTest} />
                    <ContentStack.Screen name="RenderHtmlTest" component={RenderHtmlTest} />
                </ContentStack.Group>
                {/* 文章 */}
                <ContentStack.Group screenOptions={{ 
                    presentation: 'modal',
                    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                    gestureEnabled: true,
                    gestureDirection: "horizontal",
                 }}>
                    <ContentStack.Screen name="ArticleDetail" component={ArticleDetail} />
                    <ContentStack.Screen name="ArticleResult" component={ArticleResult} />

                </ContentStack.Group>
                {/* 视频 */}
                <ContentStack.Group screenOptions={{ 
                    presentation: 'modal',
                    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                    gestureEnabled: true,
                    gestureDirection: "horizontal",
                 }}>
                    <ContentStack.Screen name="VideoDetail" component={VideoDetail} />
                    <ContentStack.Screen name="VideoResult" component={VideoResult} />
                </ContentStack.Group>
                {/* 外链视频 */}
                <ContentStack.Group screenOptions={{ 
                    presentation: 'modal',
                    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                    gestureEnabled: true,
                    gestureDirection: "horizontal",
                 }}>
                    <ContentStack.Screen name="OuterVideoHome" component={OuterVideoHome} />
                    <ContentStack.Screen name="OuterVideoDetail" component={OuterVideoDetail} />
                    <ContentStack.Screen name="OuterSearchResult" component={OuterSearchResult} />
                    <ContentStack.Screen name="OuterRecentBrowse" component={OuterRecentBrowse} />
                </ContentStack.Group>
                {/* 我的 */}
                <ContentStack.Group screenOptions={{
                    presentation: 'modal',
                    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                    gestureEnabled: true,
                    gestureDirection: "horizontal",
                }}>
                    <ContentStack.Screen name="UserInfo" component={UserInfo} />
                    <ContentStack.Screen name="MySocial" component={MySocial} />
                    <ContentStack.Screen name="MyCreation" component={MyCreation} />
                    <ContentStack.Screen name="MyInteraction" component={MyInteraction} />
                    <ContentStack.Screen name="Notification" component={Notification} />
                    <ContentStack.Screen name="RecentBrowse" component={RecentBrowse} />
                    <ContentStack.Screen name="ShareApp" component={ShareApp} />
                    <ContentStack.Screen name="BonusEggs" component={BonusEggs} />

                </ContentStack.Group>
                {/* 设置 */}
                <ContentStack.Group screenOptions={{
                    presentation: 'modal',
                    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                    gestureEnabled: true,
                    gestureDirection: "horizontal",
                }}>
                    <ContentStack.Screen name="Settings" component={Settings} />
                    <ContentStack.Screen name="ToggleTopic" component={ToggleTopic} />
                    <ContentStack.Screen name="Suggestion" component={Suggestion} />
                    <ContentStack.Screen name="Disclaimer" component={Disclaimer} />
                    <ContentStack.Screen name="AboutMe" component={AboutMe} />
                </ContentStack.Group>
                {/* 创建模块 */}
                <ContentStack.Group screenOptions={{
                    presentation: 'modal',
                    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                    gestureEnabled: true,
                    gestureDirection: "horizontal",
                }}>
                    <ContentStack.Screen name="CreateArticle" component={CreateArticle} />
                    <ContentStack.Screen name="CreateVideo" component={CreateVideo} />
                </ContentStack.Group>
                {/* 登录/注册 */}
                <ContentStack.Group screenOptions={{
                    presentation: 'modal',
                    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                    gestureEnabled: true,
                    gestureDirection: "horizontal",
                }}>
                    <ContentStack.Screen name="Register" component={Register} />
                    <ContentStack.Screen name="ReceiveCode" component={ReceiveCode} />
                    <ContentStack.Screen name="ModifyPwd" component={ModifyPwd} />
                    <ContentStack.Screen name="ModifyInfo" component={ModifyInfo} />
                    <ContentStack.Screen name="Login" component={Login} />
                </ContentStack.Group>
            </ContentStack.Navigator>
            {/* toast放在最外层View的底部 */}
            <Toast ref={toastRef} style={{ backgroundColor: "#fff", borderRadius: 10, borderWidth: 0.5, borderColor: "#eee6" }} textStyle={{ color: "#000" }} />
        </>
    );
}
