import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StatusBar, NativeModules, TouchableOpacity, Image, Animated, Vibration } from 'react-native';
import { ImageHeaderScrollView, TriggeringView } from 'react-native-image-header-scroll-view';
import { screenHeight, screenWidth, statusBarHeight } from '../../../../../utils/stylesKits';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import FontAwesomeIcon5 from 'react-native-vector-icons/FontAwesome5'
import Feather from 'react-native-vector-icons/Feather'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Video from "react-native-video";
import { Card } from 'react-native-shadow-cards';
import Modal from 'react-native-modal'
import ImagePicker from 'react-native-image-crop-picker';
import LinearGradient from 'react-native-linear-gradient';

import { useTopicTrends } from '../utils/hooks';
import { useSelector } from 'react-redux';
import { selectLoginStatus } from '../utils/slice/loginStatusSlice'

const imgHeight = screenWidth * 9 / 16;

// const videoSource = require('../../../../../res/video/rain.mp4');
const bottomOverlayImg = require('../../../../../res/img/bottom.png');
const anonymousPhoto = require('../../../../../res/img/apk/appLogo.png')

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

    const [backgroundImgPickerShow, setBackgroundImgPickerShow] = useState(false);
    const [backgroundImg, setBackgroundImg] = useState(require("../../../../../res/img/snow.jpg"))
    const chooseImg = async () => {
        const image = await ImagePicker.openPicker({
            width: screenWidth,
            height: screenWidth * 9 / 16,
            cropping: true,
            mediaType: "photo"
        });
        setBackgroundMediaType("photo");
        setBackgroundImg({ uri: image.path })
    }

    const [backgroundVideo, setBackgroundVideo] = useState(require('../../../../../res/video/rain.mp4'));
    const [backgroundMediaType, setBackgroundMediaType] = useState("photo");//photo||video
    const chooseVideo = async () => {
        const video = await ImagePicker.openPicker({
            mediaType: "video"
        });
        setBackgroundMediaType("video");
        setBackgroundVideo({ uri: video.path })
    }

    const chooseCamera = async () => {
        const image = await ImagePicker.openCamera({
            width: screenWidth,
            height: screenWidth * 9 / 16,
            cropping: true
        });
        setBackgroundMediaType("photo");
        setBackgroundImg({ uri: image.path })
    }

    const pressTime = useRef(0);
    const timer = useRef();
    const puzzleOnPress = () => {
        if (pressTime.current > 0) {
            pressTime.current++;
            if (pressTime.current == 3) {
                pressTime.current = 0;
                navigation.navigate("BonusEggs");
                clearTimeout(timer.current);
            }
        } else {
            setBackgroundImgPickerShow(true);
        }
    }

    const puzzleOnLongPress = () => {
        Vibration.vibrate([0, 100], false);//震动提示
        pressTime.current++;
        timer.current = setTimeout(() => {
            pressTime.current = 0;
            clearTimeout(timer.current);
        }, 3000);
    }

    const [videoMuted, setVideoMuted] = useState(true);


    return (
        <View style={{ flex: 1 }}>
            <StatusBar backgroundColor="transparent" barStyle="light-content" translucent={true} hidden={false} />
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
            // renderForeground={() => { }}
            >

                <View style={{ paddingTop: 10, backgroundColor: "#fff", height: screenHeight - 140, paddingLeft: 5, paddingRight: 5 }}>

                    {
                        loginStatus
                            ? <>
                                <View style={{
                                    backgroundColor: "#fff", borderRadius: 10,
                                    flexDirection: "row", justifyContent: "space-evenly", paddingTop: 20, paddingBottom: 10
                                }}>
                                    <Card
                                        cornerRadius={0} elevation={5} opacity={0.5}
                                        style={{
                                            width: "auto", borderRadius: 40, backgroundColor: "#fff",
                                            marginTop: 2, marginBottom: 2,
                                        }}>
                                        <TouchableOpacity
                                            onPress={() => { navigation.navigate("MySocial", { index: 0 }) }}
                                            activeOpacity={0.5} style={{
                                                alignItems: "center", justifyContent: "center",
                                                width: 80, height: 80, borderRadius: 40,
                                            }}>
                                            <Text style={{ padding: 5, fontSize: 20 }}>2</Text>

                                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                <Feather name='repeat' size={12} color='#000b' />
                                                <Text style={{ marginLeft: 2, fontSize: 12 }}>互关</Text>

                                            </View>
                                        </TouchableOpacity>
                                    </Card>
                                    <Card
                                        cornerRadius={0} elevation={5} opacity={0.5}
                                        style={{
                                            width: "auto", borderRadius: 40, backgroundColor: "#fff",
                                            marginTop: 2, marginBottom: 2,
                                        }}>
                                        <TouchableOpacity
                                            onPress={() => { navigation.navigate("MySocial", { index: 1 }) }}
                                            activeOpacity={0.5} style={{
                                                alignItems: "center", justifyContent: "center",
                                                width: 80, height: 80, borderRadius: 40,
                                            }}>
                                            <Text style={{ padding: 5, fontSize: 20 }}>3</Text>

                                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                <Feather name='heart' size={12} color='#000b' />
                                                <Text style={{ marginLeft: 2, fontSize: 12 }}>关注</Text>

                                            </View>
                                        </TouchableOpacity>
                                    </Card>
                                    <Card
                                        cornerRadius={0} elevation={5} opacity={0.5}
                                        style={{
                                            width: "auto", borderRadius: 40, backgroundColor: "#fff",
                                            marginTop: 2, marginBottom: 2,
                                        }}>
                                        <TouchableOpacity
                                            onPress={() => { navigation.navigate("MySocial", { index: 2 }) }}
                                            activeOpacity={0.5} style={{
                                                alignItems: "center", justifyContent: "center",
                                                width: 80, height: 80, borderRadius: 40,
                                            }}>
                                            <Text style={{ padding: 5, fontSize: 20 }}>3</Text>

                                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                <Feather name='users' size={12} color='#000b' />
                                                <Text style={{ marginLeft: 2, fontSize: 12 }}>粉丝</Text>

                                            </View>

                                        </TouchableOpacity>
                                    </Card>
                                </View>
                                <View style={{ height: 5, backgroundColor: "transparent" }}></View>

                                <Card
                                    cornerRadius={0} elevation={3} opacity={0.5}
                                    style={{
                                        width: "auto", borderRadius: 10, backgroundColor: "#fff",
                                        marginTop: 2, marginBottom: 2,
                                    }}>
                                    <TouchableOpacity
                                        onPress={() => { navigation.navigate("MyCreation", { index: 0 }) }}
                                        activeOpacity={0.6}
                                        style={{
                                            borderRadius: 10,
                                            flexDirection: "row", alignItems: "center", justifyContent: "space-between",
                                            backgroundColor: "#fff", padding: 20,
                                        }}>

                                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                                            <Feather name='activity' size={25} color='#000b' />
                                            <Text style={{ fontSize: 16, paddingLeft: 20, color: "#000b" }}>我的动态</Text>
                                        </View>
                                        <View>
                                            <FontAwesomeIcon name='angle-right' size={25} color='#000b' />
                                        </View>
                                    </TouchableOpacity>
                                </Card>
                                <View style={{ height: 5, backgroundColor: "transparent" }}></View>

                                <Card
                                    cornerRadius={0} elevation={3} opacity={0.5}
                                    style={{
                                        width: "auto", borderRadius: 10, backgroundColor: "#fff",
                                        marginTop: 2, marginBottom: 2,
                                    }}>
                                    <TouchableOpacity
                                        onPress={() => { navigation.navigate("MyInteraction", { index: 0 }) }}
                                        activeOpacity={0.6}
                                        style={{
                                            borderRadius: 10,
                                            flexDirection: "row", alignItems: "center", justifyContent: "space-between",
                                            backgroundColor: "#fff", padding: 20,
                                        }}>

                                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                                            <FontAwesomeIcon name='hand-paper-o' size={25} color='#000b' />
                                            <Text style={{ fontSize: 16, paddingLeft: 20, color: "#000b" }}>我的操作记录</Text>
                                        </View>
                                        <View>
                                            <FontAwesomeIcon name='angle-right' size={25} color='#000b' />
                                        </View>
                                    </TouchableOpacity>
                                </Card>

                                <View style={{ height: 5, backgroundColor: "transparent" }}></View>
                                <Card
                                    cornerRadius={0} elevation={3} opacity={1}
                                    style={{
                                        width: "auto", borderRadius: 10, backgroundColor: "#fff",
                                        marginTop: 2, marginBottom: 2,
                                    }}>
                                    <TouchableOpacity
                                        onPress={() => { navigation.navigate("Notification", { index: 0 }) }}
                                        activeOpacity={0.6}
                                        style={{
                                            borderRadius: 10,
                                            flexDirection: "row", alignItems: "center", justifyContent: "space-between",
                                            backgroundColor: "#fff", padding: 20,
                                        }}>

                                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                                            <AntDesign name='notification' size={25} color='#000b' />
                                            <Text style={{ fontSize: 16, paddingLeft: 20, color: "#000b" }}>通知</Text>
                                        </View>
                                        <View>
                                            <FontAwesomeIcon name='angle-right' size={25} color='#000b' />
                                        </View>
                                    </TouchableOpacity>
                                </Card>

                            </>
                            : <View style={{ alignItems: "center" }}>
                                <Card
                                    cornerRadius={0} elevation={5} opacity={0.5}
                                    style={{
                                        width: "auto", borderRadius: 40, backgroundColor: "#fff",
                                        marginTop: 10, marginBottom: 10,
                                    }}>
                                    <Image source={anonymousPhoto} style={{
                                        width: 50, height: 50, borderRadius: 25,
                                    }} />
                                </Card>
                                <Card
                                    cornerRadius={0} elevation={5} opacity={0.5}
                                    style={{
                                        width: "auto", borderRadius: 40, backgroundColor: "#fff",
                                    }}>
                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        onPress={() => {
                                            navigation.navigate("Login")
                                        }}
                                        style={{
                                            // marginTop: 10, marginBottom: 10,
                                        }}
                                    >
                                        <LinearGradient
                                            start={{ x: 0, y: 1 }}
                                            end={{ x: 0, y: 0 }}
                                            colors={["#fff", "#fff"]}
                                            // colors={[topicTrends[topicTrendsNum].style_desc.gradient_start,
                                            // topicTrends[topicTrendsNum].style_desc.gradient_end]}
                                            style={{
                                                alignItems: "center", borderRadius: 10,
                                                padding: 10,
                                                width: screenWidth / 1.5,
                                                borderRadius: 30,
                                                flexDirection: "row",
                                                justifyContent: "center", alignItems: "center"
                                            }}
                                        >
                                            <Text style={{ fontSize: 18, color: topicTrends[topicTrendsNum].style_desc.gradient_start }}>登录</Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </Card>
                                <TouchableOpacity
                                    onPress={() => {
                                        navigation.navigate("Register")
                                    }}
                                    activeOpacity={0.9}
                                    style={{
                                        marginTop: 5, marginBottom: 5,
                                    }}
                                >
                                    <Text style={{ fontSize: 15, color: "#ccc" }}>注册</Text>
                                </TouchableOpacity>
                            </View>
                        // <View style={{ flexDirection: "row", justifyContent: "center" }}>
                        //     <TouchableOpacity
                        //         onPress={() => {
                        //             navigation.navigate("Register")
                        //         }}
                        //         activeOpacity={0.9}
                        //         style={{ flexDirection: "row", alignItems: "center", padding: 10 }}>
                        //         <Text style={{ fontSize: 25, color: "#000b", fontWeight: 'bold' }}>注册</Text>
                        //     </TouchableOpacity>
                        //     <View style={{ paddingTop: 10, paddingBottom: 10 }}><Text style={{ fontSize: 30, color: "#eee", }}>|</Text></View>
                        //     <TouchableOpacity
                        //         onPress={() => {
                        //             navigation.navigate("Login")
                        //         }}
                        //         activeOpacity={0.9}
                        //         style={{ flexDirection: "row", alignItems: "center", padding: 10 }}>
                        //         <Text style={{ fontSize: 25, color: "#000b", fontWeight: 'bold' }}>登录</Text>
                        //     </TouchableOpacity>
                        // </View>
                    }



                    <View style={{ height: 5, backgroundColor: "transparent" }}></View>

                    <Card
                        cornerRadius={0} elevation={3} opacity={1}
                        style={{
                            width: "auto", borderRadius: 10, backgroundColor: "#fff",
                            marginTop: 2, marginBottom: 2,
                        }}>
                        <TouchableOpacity
                            onPress={() => { navigation.navigate("RecentBrowse", { index: 0 }) }}

                            activeOpacity={0.6}
                            style={{
                                borderTopLeftRadius: 10, borderTopRightRadius: 10,
                                borderTopColor: "#eee", borderTopWidth: 0.5,
                                flexDirection: "row", alignItems: "center", justifyContent: "space-between",
                                backgroundColor: "#fff", padding: 20,
                            }}>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Feather name='clock' size={25} color='#6ff333' />
                                <Text style={{ fontSize: 16, paddingLeft: 20, color: "#000b" }}>最近浏览</Text>
                            </View>
                            <View>
                                <FontAwesomeIcon name='angle-right' size={25} color='#000b' />
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => { navigation.navigate("ShareApp") }}

                            activeOpacity={0.6}
                            style={{
                                flexDirection: "row", alignItems: "center", justifyContent: "space-between",
                                backgroundColor: "#fff", padding: 20,
                            }}>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Feather name='share' size={25} color='#fd994a' />
                                <Text style={{ fontSize: 16, paddingLeft: 20, color: "#000b" }}>分享应用</Text>
                            </View>
                            <View>
                                <FontAwesomeIcon name='angle-right' size={25} color='#000b' />
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => { props.navigation.navigate("Settings") }}
                            activeOpacity={0.6}
                            style={{
                                borderBottomLeftRadius: 10, borderBottomRightRadius: 10,
                                flexDirection: "row", alignItems: "center", justifyContent: "space-between",
                                backgroundColor: "#fff", padding: 20,
                            }}>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Feather name='settings' size={25} color='#4a9dfd' />
                                <Text style={{ fontSize: 16, paddingLeft: 20, color: "#000b" }}>设置</Text>
                            </View>
                            <View>
                                <FontAwesomeIcon name='angle-right' size={25} color='#000b' />
                            </View>
                        </TouchableOpacity>
                    </Card>
                </View>
            </ImageHeaderScrollView>

            <Animated.View style={{
                width: screenWidth, position: "absolute",
                left: leftOut,
                top: topOut,
                transform: [{ scale: scaleOut }],
            }}>
                {
                    loginStatus
                        ? <TouchableOpacity
                            onPress={() => { navigation.navigate("UserInfo") }}
                            activeOpacity={0.9}
                            style={{ flexDirection: "row", alignItems: "center", }}>
                            <Image style={{ width: 100, height: 100, borderRadius: 50 }} source={require("../../../../../res/img/photo.jpg")} />
                            <View style={{ paddingLeft: 10, }}>
                                <Text style={{ fontSize: 25, color: "#fff", fontWeight: 'bold' }}>
                                    qgao233
                                </Text>
                                <Text style={{ fontSize: 12, color: "#fff" }}>
                                    {`学而不思则罔，思而不学则殆${"!"}`}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        : <></>
                }

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

            <TouchableOpacity style={{ position: "absolute", top: 35, right: 25 }}
                onPress={() => { puzzleOnPress(); }}
                onLongPress={() => { puzzleOnLongPress(); }}
                activeOpacity={0.8} >
                <FontAwesomeIcon name='puzzle-piece' size={25} color='#fff' />
            </TouchableOpacity>
            <Modal isVisible={backgroundImgPickerShow} backdropColor="#0004"
                onBackdropPress={() => { setBackgroundImgPickerShow(false) }}
                style={{
                    width: screenWidth,
                    margin: 0,
                    justifyContent: "flex-end"
                }}
            >

                <View style={{
                    borderTopLeftRadius: 10, borderTopRightRadius: 10,
                    backgroundColor: "#fff",
                }}>
                    <View style={{ padding: 20, alignItems: "center" }}>
                        <Text>切换背景</Text>
                    </View>
                    <View style={{ padding: 20, flexDirection: "row", justifyContent: "space-evenly", alignItems: "center" }}>

                        <TouchableOpacity
                            onPress={() => {
                                chooseImg();
                            }}
                            activeOpacity={0.7}
                            style={{ alignItems: "center" }}>
                            <FontAwesomeIcon name="image" size={50} />
                            <Text style={{ fontSize: 15 }}>图片</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                chooseVideo();
                            }}
                            activeOpacity={0.7}
                            style={{ alignItems: "center" }}>
                            <FontAwesomeIcon name="video-camera" size={50} />
                            <Text style={{ fontSize: 15 }}>视频</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                chooseCamera();
                            }}
                            activeOpacity={0.7}
                            style={{ alignItems: "center" }}>
                            <FontAwesomeIcon name="camera" size={50} />
                            <Text style={{ fontSize: 15 }}>拍照</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </Modal>
        </View>
    );
}