import * as React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SvgUri from '../../../../utils/components/svg/svgUri';
import { article, articleSelect, video, videoSelect, plusSymbol, activity, activitySelect, account, accountSelect } from '../../../../res/img/svg/customSvg';
import ArticleHome from './article/articleHome';
import VideoHome from './video/videoHome';
import ActivityHome from './activity/activityHome';
import AccountHome from './account/accountHome';
import LinearGradient from 'react-native-linear-gradient';
import { topicTrends, topicTrendsNum } from '../../../../utils/stylesKits';

function MyTabBar({ state, descriptors, navigation }) {
    return (
        <View style={{ backgroundColor: "#fff", flexDirection: 'row', borderTopColor: '#ddd', borderTopWidth: 0.5 }}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                        navigation.closeDrawer();//这里点击莫明会打开抽屉，手动关闭
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                //根据index获得各个对应的图标
                let activeIcon = '';
                let inactiveIcon = '';
                switch (index) {
                    case 0:
                        activeIcon = articleSelect;
                        inactiveIcon = article;
                        break;
                    case 1:
                        activeIcon = videoSelect;
                        inactiveIcon = video;
                        break;
                    case 2:
                        activeIcon = plusSymbol;
                        inactiveIcon = plusSymbol;
                        break;
                    case 3:
                        activeIcon = activitySelect;
                        inactiveIcon = activity;
                        break;
                    case 4:
                        activeIcon = accountSelect;
                        inactiveIcon = account;
                        break;
                    default: break;
                }

                return index == 2
                    ? (
                        <View key={index}
                            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                            <TouchableOpacity

                                onPress={() => { }}
                                onLongPress={onLongPress}
                            >
                                <LinearGradient
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    colors={[topicTrends[topicTrendsNum].plus_style.style_desc.gradient_start,
                                    topicTrends[topicTrendsNum].plus_style.style_desc.gradient_end]}
                                    style={{
                                        alignItems: "center", justifyContent: "center", borderRadius: 10,
                                        paddingLeft: 20, paddingRight: 20, paddingTop: 5, paddingBottom: 5,
                                    }}
                                >
                                    <Text style={{ color: '#fff', fontSize: 25 }}>
                                        {label}
                                    </Text>
                                </LinearGradient>

                            </TouchableOpacity>
                        </View>

                    )
                    : (
                        <TouchableOpacity
                            key={index}
                            accessibilityRole="button"
                            accessibilityState={isFocused ? { selected: true } : {}}
                            accessibilityLabel={options.tabBarAccessibilityLabel}
                            testID={options.tabBarTestID}
                            onPress={onPress}
                            onLongPress={onLongPress}
                            style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingTop: 5, paddingBottom: 5 }}
                        >
                            <SvgUri width="30" height="30" fill={isFocused ? topicTrends[topicTrendsNum].color.color_num : '#0007'} svgXmlData={isFocused ? activeIcon : inactiveIcon} />
                            <Text style={{ color: isFocused ? topicTrends[topicTrendsNum].color.color_num : '#0007', fontSize: 10 }}>
                                {label}
                            </Text>
                        </TouchableOpacity>
                    );
            })}
        </View>
    );
}

//暂时，之后要修改
function createCenter() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>createCenter!</Text>
        </View>
    )
}

const Tab = createBottomTabNavigator();

export default function App() {
    return (
        <Tab.Navigator
            sceneContainerStyle={{ backgroundColor: "#fff" }}
            screenOptions={{ headerShown: false }}
            tabBar={(props) => {
                return (<MyTabBar {...props} />);
            }}>
            
                <Tab.Screen name="article" options={{ title: "文章" }} component={ArticleHome} />
                <Tab.Screen name="video" options={{ title: "视频" }} component={VideoHome} />
                <Tab.Screen name="create" options={{ title: "+" }} component={createCenter} />
                <Tab.Screen name="activity" options={{ title: "聊天" }} component={ActivityHome} />
                <Tab.Screen name="my" options={{ title: "我的" }} component={AccountHome} />
            
        </Tab.Navigator>
    );
}
