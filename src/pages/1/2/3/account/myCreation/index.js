import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StatusBar, NativeModules, Easing, TouchableOpacity, Image, Animated, Vibration, ImageBackground } from 'react-native';
import { ImageHeaderScrollView, TriggeringView } from 'react-native-image-header-scroll-view';
import { screenHeight, screenWidth } from '../../../../../../utils/stylesKits';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Modal from 'react-native-modal'
import ImagePicker from 'react-native-image-crop-picker';
import LinearGradient from 'react-native-linear-gradient'
import { useSelector } from 'react-redux';
import { selectTopicTrendsNum } from '../../../../../../utils/slice/topicTrendsNumSlice'
import { selectTopicTrends } from '../../../../../../utils/slice/topicTrendsSlice'
import InnerTabBar from '../Components/innerTabBar'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import ShowList from './ShowList'
import FullPageHeader from '../../../../../../utils/components/fullPageHeader';


const imgHeight = screenWidth * 9 / 16;
const backgroundImage = require('../../../../../../res/img/rainbow.jpeg');

const tabList = [
    { id: 0, text: "文章" },
    { id: 1, text: "视频" },
]

export default (props) => {

    const topicTrendsNum = useSelector(selectTopicTrendsNum);
    const topicTrends = useSelector(selectTopicTrends);

    const [top, setTop] = useState(new Animated.Value(0));

    const topOut = top.interpolate({
        inputRange: [0, 1],     //0开1关
        outputRange: [imgHeight - 75, NativeModules.StatusBarManager.HEIGHT-10]
    })
    const rightTopOut = top.interpolate({
        inputRange: [0, 1],     //0开1关
        outputRange: [imgHeight - 75, NativeModules.StatusBarManager.HEIGHT]
    })
    const scaleOut = top.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0.8]
    })
    const leftOut = top.interpolate({
        inputRange: [0, 1],
        outputRange: [10, 20]
    })
    const imgScaleOut = top.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 2]
    })
    const imgHeightOut = top.interpolate({
        inputRange: [0, 1],
        outputRange: [imgHeight, 80]
    })

    const extraAnimateTop = useRef(new Animated.Value(55));

    const navigation = props.navigation;

    const [backgroundImg, setBackgroundImg] = useState(require("../../../../../../res/img/snow.jpg"))

    const dynamicRenderTabPage = () => {
        const views = [];
        tabList.forEach((v, i) => {
            views.push(
                <View key={i} tabLabel={v.text + "(5)"} >
                    <ShowList cid={v.id} showHeader={bool => toggleHeader(bool)} {...props} />
                </View>
            );
        })
        return views;
    }

    const toggleHeader = (bool) => {
        const config = bool
            ? {
                toValue: 0,
                duration: 250,
                easing: Easing.linear,
                useNativeDriver: false,//消除警告，但这里不能设置为true
            }
            : {
                toValue: 1,
                duration: 250,
                easing: Easing.linear,
                useNativeDriver: false,//消除警告，但这里不能设置为true
            };
        Animated.parallel([
            Animated.timing(top, { ...config, }),
        ]).start();
    }

    return (
        <View style={{ flex: 1 }}>
            <StatusBar backgroundColor="transparent" barStyle="light-content" translucent={true} hidden={false} />

            <Animated.Image source={backgroundImg} style={{
                transform: [{ scale: imgScaleOut },
                ],
                height: imgHeightOut, width: screenWidth
            }} />

            <View style={{ paddingLeft: 10, paddingTop: 25, backgroundColor: "#fff" }}>
                <Text style={{ paddingTop: 10, fontSize: 25, color: "#000c", fontWeight: 'bold' }}>
                    qgao233
                </Text>
                <Text style={{ paddingTop: 10, paddingBottom: 10, fontSize: 12, color: "#000c" }}>
                    {`学而不思则罔，思而不学则殆${"!"}`}
                </Text>
            </View>
            <View style={{ height: 5, backgroundColor: "#eee" }}></View>
            {/* tab标签栏,外层一定是弹性容器（flex:1)才会显示 */}
            <ScrollableTabView
                initialPage={props.route.params ? props.route.params.index : 0}
                renderTabBar={() => < InnerTabBar />}
            >
                {dynamicRenderTabPage()}
            </ScrollableTabView>

            <Animated.View style={{
                position: "absolute",
                left: leftOut,
                top: topOut,
                transform: [{ scale: scaleOut }],
            }}>
                <TouchableOpacity
                    onPress={() => { navigation.navigate("UserInfo") }}
                    activeOpacity={0.9}
                    style={{ flexDirection: "row", alignItems: "center", }}>
                    <Image style={{ width: 100, height: 100, borderRadius: 50 }} source={require("../../../../../../res/img/photo.jpg")} />

                </TouchableOpacity>
            </Animated.View>
            <Animated.View style={{
                position: "absolute",
                right: 15,
                top: Animated.add(rightTopOut, extraAnimateTop.current),
                // transform: [{ scale: scaleOut }],
                flexDirection: "row",
            }}>
                <TouchableOpacity
                    activeOpacity={0.9}
                    style={{ paddingRight: 10 }}
                >
                    <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                        colors={["#F15F0C",
                        "#EE6D24"]}
                        style={{
                            justifyContent: "center", alignItems: "center", padding: 15, paddingTop: 7, paddingBottom: 7,
                            flexDirection: "row",
                            borderRadius: 30,
                        }}
                    >
                        <Ionicons name="heart-outline" size={17} color='#fff' />
                        <Text style={{ fontSize: 15, color: "#fff", marginLeft: 5 }}>关注</Text>
                    </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.9}
                >
                    <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                        colors={[topicTrends[topicTrendsNum].style_desc.gradient_start,
                        topicTrends[topicTrendsNum].style_desc.gradient_end]}
                        style={{
                            justifyContent: "center", alignItems: "center", padding: 15, paddingTop: 7, paddingBottom: 7,
                            flexDirection: "row",
                            borderRadius: 30,
                        }}
                    >
                        <Ionicons name="chatbubble-ellipses-outline" size={17} color='#fff' />
                        <Text style={{ fontSize: 15, color: "#fff", marginLeft: 5 }}>发消息</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </Animated.View>

            <FullPageHeader style={{ position: "absolute", top: 0 }}
                gradientStartColor="transparent"
                gradientEndColor="transparent"
                color="#fff"
                leftName=""
                />


        </View>
    );
}