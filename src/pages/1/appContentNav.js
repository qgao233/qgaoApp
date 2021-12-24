import React from 'react';
import { View, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppWelcome from './2/appWelcome';
import DrawerNav from './2/drawerNav';
import VideoDetail from './2/3/video/videoDetail';
import ReduxDemo from './2/3/demo/reduxDemo';
import ResponderDemo from './2/3/demo/responderDemo'
import GestureDemo from './2/3/demo/gestureDemo'

//外链视频
import OuterVideoHome from './2/3/outerVideo/videoHome';
import OuterVideoDetail from './2/3/outerVideo/videoDetail';
import SearchResult from './2/3/outerVideo/searchResult';


const ContentStack = createNativeStackNavigator();

class Index extends React.Component {
    //暂时用这个来表示用户是否是第一次安装该app
    state = {
        isFirst: false
    }
    render() {
        return (
            <ContentStack.Navigator screenOptions={{ headerShown: false }}>{/* 更改了路由页面后，要reload才能使页面发生改变 */}
                <ContentStack.Group >
                    {this.state.isFirst
                        ? (
                            <ContentStack.Screen name="AppWelcome" component={AppWelcome} />
                        )
                        : (
                            <ContentStack.Screen name="DrawerNav" component={DrawerNav} />
                        )}
                </ContentStack.Group>
                <ContentStack.Group screenOptions={{ presentation: 'modal' }}>
                    <ContentStack.Screen name="VideoDetail" component={VideoDetail} />
                    <ContentStack.Screen name="ReduxDemo" component={ReduxDemo} />
                    <ContentStack.Screen name="ResponderDemo" component={ResponderDemo} />
                    <ContentStack.Screen name="GestureDemo" component={GestureDemo} />
                </ContentStack.Group>
                {/* 外链视频 */}
                <ContentStack.Group screenOptions={{ presentation: 'modal' }}>
                    <ContentStack.Screen name="OuterVideoHome" component={OuterVideoHome} />
                    <ContentStack.Screen name="OuterVideoDetail" component={OuterVideoDetail} />
                    <ContentStack.Screen name="SearchResult" component={SearchResult} />

                </ContentStack.Group>
            </ContentStack.Navigator>
        );
    }
}
export default Index;