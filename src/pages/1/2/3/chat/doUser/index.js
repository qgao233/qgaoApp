import React, { useEffect, useRef, useState } from 'react';
import {
    View, Text, StatusBar, NativeModules, TouchableOpacity,
    Image, Animated, Vibration
} from 'react-native';
import { ImageHeaderScrollView, TriggeringView } from 'react-native-image-header-scroll-view';
import { screenHeight, screenWidth, statusBarHeight } from '../../../../../../utils/stylesKits';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import FontAwesomeIcon5 from 'react-native-vector-icons/FontAwesome5'
import Feather from 'react-native-vector-icons/Feather'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Video from "react-native-video";
import { Card } from 'react-native-shadow-cards';
import Modal from 'react-native-modal'
import ImagePicker from 'react-native-image-crop-picker';
import LinearGradient from 'react-native-linear-gradient';

import { useTopicTrends } from '../../utils/hooks';
import { useSelector } from 'react-redux';
import { selectLoginStatus } from '../../utils/slice/loginStatusSlice'

import { SafeAreaView } from 'react-native-safe-area-context';
import FullPageHeader2 from '../../../../../../utils/components/fullPageHeader2';


const imgHeight = screenWidth * 9 / 16;

// const videoSource = require('../../../../../../res/video/rain.mp4');
const bottomOverlayImg = require('../../../../../../res/img/bottom.png');
const anonymousPhoto = require('../../../../../../res/img/apk/appLogo.png')

export default (props) => {

    const loginStatus = useSelector(selectLoginStatus);
    const { topicTrends, topicTrendsNum } = useTopicTrends();

    const [top, setTop] = useState(new Animated.Value(0));

    const topOut = top.interpolate({
        inputRange: [0, 154.18],
        outputRange: [imgHeight - 75, NativeModules.StatusBarManager.HEIGHT - 30]
    })
    const scaleOut = top.interpolate({
        inputRange: [0, 154.18],
        outputRange: [1, 0.5]
    })
    const leftOut = top.interpolate({
        inputRange: [0, 154.18],
        outputRange: [25, -80]
    })

    const navigation = props.navigation;

    const [backgroundImg, setBackgroundImg] = useState(require("../../../../../../res/img/snow.jpg"))

    const [backgroundVideo, setBackgroundVideo] = useState(require('../../../../../../res/video/rain.mp4'));
    const [backgroundMediaType, setBackgroundMediaType] = useState("photo");//photo||video

    const [videoMuted, setVideoMuted] = useState(true);


    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            StatusBar.setBarStyle("dark-content");
            StatusBar.setBackgroundColor("transparent");
            StatusBar.setTranslucent(true);
            StatusBar.setHidden(false);
        });

        return unsubscribe;
    }, [navigation]);

    return (
        <SafeAreaView
            edges={['left', 'right']}
            style={{ flex: 1 }}
        >
            <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent={true} hidden={false} />
            <ImageHeaderScrollView
                // overScrollMode='always'
                onScroll={
                    Animated.event(
                        [{ nativeEvent: { contentOffset: { y: top } } }],
                        {
                            useNativeDriver: false, listener: (evt) => {
                                // console.log(evt.nativeEvent.contentOffset.y,imgHeight)
                            }
                        }
                    )
                }
                showsVerticalScrollIndicator={false}
                maxHeight={imgHeight}
                minHeight={70}
                renderHeader={() =>
                    backgroundMediaType == "photo"
                        ? <View style={{ position: "relative" }}>
                            <Image source={backgroundImg} style={{ width: screenWidth, height: screenWidth * 9 / 16, }} />
                            <Image source={bottomOverlayImg} style={{
                                width: screenWidth, height: screenWidth * 9 / 16 / 8,
                                position: "absolute",
                                top: screenWidth * 9 / 16 - screenWidth * 9 / 16 / 8,
                            }} />
                        </View>
                        : <View style={{ position: "relative" }}>
                            <Video muted={videoMuted} resizeMode='stretch' source={backgroundVideo} style={{ width: screenWidth, height: screenWidth * 9 / 16, }} autoPlay={true} repeat={true} />
                            <Image source={bottomOverlayImg} style={{
                                width: screenWidth, height: screenWidth * 9 / 16 / 8,
                                position: "absolute",
                                top: screenWidth * 9 / 16 - screenWidth * 9 / 16 / 8,
                            }} />
                        </View>
                }
            // renderForeground={() => {
            //     return <View><Text style={{fontSize:30,color:"#fff"}}>233</Text></View>
            //  }}
            >

                <View style={{ paddingTop: 10, backgroundColor: "#fff", height: screenHeight - 140, paddingLeft: 5, paddingRight: 5 }}>

                    <View style={{ height: 5, backgroundColor: "transparent" }}></View>

                    <Card
                        cornerRadius={0} elevation={3} opacity={1}
                        style={{
                            width: "auto", borderRadius: 10, backgroundColor: "#fff",
                            marginTop: 2, marginBottom: 2,
                        }}>
                        <TouchableOpacity
                            onPress={() => { navigation.navigate("MyCreation") }}

                            activeOpacity={0.6}
                            style={{
                                borderTopLeftRadius: 10, borderTopRightRadius: 10,
                                borderTopColor: "#eee", borderTopWidth: 0.5,
                                flexDirection: "row", alignItems: "center", justifyContent: "space-between",
                                backgroundColor: "#fff", padding: 20,
                            }}>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Feather name='activity' size={25} color='#000b' />
                                <Text style={{ fontSize: 16, paddingLeft: 20, color: "#000b" }}>用户主页</Text>
                            </View>
                            <View>
                                <FontAwesomeIcon name='angle-right' size={25} color='#000b' />
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => { }}

                            activeOpacity={0.6}
                            style={{
                                flexDirection: "row", alignItems: "center", justifyContent: "space-between",
                                backgroundColor: "#fff", padding: 20,
                            }}>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Feather name='user-x' size={25} color='#000b' />
                                <Text style={{ fontSize: 16, paddingLeft: 20, color: "#000b" }}>拉黑</Text>
                            </View>
                            <View>
                                <FontAwesomeIcon name='angle-right' size={25} color='#000b' />
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                Vibration.vibrate([0, 50], false);//震动提示
                            }}
                            activeOpacity={0.6}
                            style={{
                                borderRadius: 10,
                                borderTopColor: "#eee", borderTopWidth: 0.5,
                                flexDirection: "row", alignItems: "center", justifyContent: "center",
                                backgroundColor: "#fff", paddingTop: 15, paddingBottom: 15, padding: 20, paddingRight: 20
                            }}>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Feather name='alert-circle' size={25} color='#FF496C' />
                                <Text style={{ fontSize: 16, paddingLeft: 20, color: "#FF496C" }}>不再关注</Text>
                            </View>
                        </TouchableOpacity>
                    </Card>
                </View>
            </ImageHeaderScrollView>

            <View style={{ position: "absolute", zIndex: 0, top: statusBarHeight,left:10, }}>
                <TouchableOpacity
                    onPress={() => { navigation.goBack() }}
                    activeOpacity={0.8} style={{  flexDirection: "row", alignItems: "center" }}
                >
                    <Feather name={"chevron-left"} size={30} color={"#eee"} />
                </TouchableOpacity>
            </View>
            <Animated.View style={{
                width: screenWidth, position: "absolute",
                left: leftOut,
                top: topOut,
                transform: [{ scale: scaleOut }],
            }}>
                <TouchableOpacity
                    onPress={() => { }}
                    activeOpacity={0.9}
                    style={{ flexDirection: "row", alignItems: "center", }}>
                    <Image style={{ width: 100, height: 100, borderRadius: 50 }} source={require("../../../../../../res/img/photo.jpg")} />
                    <View style={{ paddingLeft: 10, }}>
                        <Text style={{ fontSize: 25, color: "#fff", fontWeight: 'bold' }}>
                            qgao233
                        </Text>
                        <Text style={{ fontSize: 12, color: "#fff" }}>
                            {`学而不思则罔，思而不学则殆${"!"}`}
                        </Text>
                    </View>
                </TouchableOpacity>

            </Animated.View>

            {
                backgroundMediaType == "video"
                    ? <TouchableOpacity style={{ position: "absolute", top: 35, right: 65 }}
                        onPress={() => { setVideoMuted(videoMuted => !videoMuted) }}
                        activeOpacity={0.8} >
                        <FontAwesomeIcon5 name={videoMuted ? "volume-mute" : "volume-up"} size={25} color="#fff" />
                    </TouchableOpacity>
                    : <></>
            }

        </SafeAreaView>
    );
}