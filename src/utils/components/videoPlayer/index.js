import React, { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react';
import { View, Text, StatusBar, TouchableOpacity, PanResponder, Alert, Vibration, } from 'react-native';
import Video from "react-native-video";
import {  screenWidth, screenHeight } from "../../../utils/stylesKits";
import { videoTimeFormat } from "../../../utils/funcKits";
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';
import Orientation from "react-native-orientation";
import SystemSetting from 'react-native-system-setting'
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { selectTopicTrendsNum } from '../../../utils/slice/topicTrendsNumSlice'
import { selectTopicTrends } from '../../../utils/slice/topicTrendsSlice'

const videoSource = require('../../../res/video/rain.mp4');

videoPlayer.defaultProps = {
    videoPoster: "http://img.netbian.com/file/2021/0605/smalld9fcb449fa428b1cc001b40527b990761622906649.jpg",
    videoResizeMode: 'contain',
    videoPosterResizeMode: 'contain',
    videoWidth: screenWidth,
    videoHeight: screenWidth * 9 / 16,//16:9
    canBeFullScreen: true,
    // videoSource: require('../../../res/video/rain.mp4'),
    videoType: "m3u8",
}
// videoPlayer.propTypes = {
//     videoPoster: PropTypes.string.isRequired,
//     videoResizeMode: PropTypes.string,
//     videoPosterResizeMode: PropTypes.number,
//     videoWidth: PropTypes.func,
//     videoHeight
// };

export default function videoPlayer(props) {

    let videoTimeBarControl = false;
    let videoBrightBarControl = false;
    let videoVolumeBarControl = false;



    let videoPlayerRef = useRef();

    let panResponder = useRef(
        PanResponder.create({
            // 是否允许子组件入栈（响应栈，出栈时进行响应）
            // onStartShouldSetPanResponderCapture: (evt, gestureState) => {
            //     // props.navigation.navigate("ResponderDemo");
            //     console.log(1);
            //     return true;
            // },
            // onStartShouldSetPanResponder: (evt, gestureState) => {
            //     console.log(2);
            //     return true;
            // },
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
                // console.log(3);
                //false不阻止子事件入栈并进入onMoveShouldSetPanResponder并进行出栈响应时的一些设置（防止冒泡时和子事件有冲突之类的），
                //true会阻止子事件入栈,那么就不会存在有可能在冒泡时和子事件的冲突，所以直接进入move
                return false;
            },
            onMoveShouldSetPanResponder: (evt, gestureState) => {
                // console.log(4)

                let { dx, dy } = gestureState;
                if ((Math.abs(dx) > 5) || (Math.abs(dy) > 5)) {
                    return true;//进入move
                } else {
                    return false;//当前事件不做操作，出栈
                }
            },
            onPanResponderGrant: (evt, gestureState) => {
                // 开始手势操作。给用户一些视觉反馈，让他们知道发生了什么事情！
                // console.log(5)
            },
            onPanResponderMove: (evt, gestureState) => {
                const { moveX, moveY, x0, y0, dx, dy, vx, vy } = gestureState;

                if (videoTimeBarControl) {
                    showVideoTimeBar(moveX - x0);
                }
                else if (videoVolumeBarControl) {
                    if ((Math.abs(vy) > 0.01)) {
                        showVideoVolumeBar(y0 - moveY);
                    }
                }
                else if (videoBrightBarControl) {
                    showVideoBrightBar(y0 - moveY);
                }
                else {
                    //横向滑动
                    if (Math.abs(vx) > Math.abs(vy)) {
                        videoTimeBarControl = true;
                        setVideoTimeBar(true);
                        showVideoTimeBar(moveX - x0);
                    } else {//纵向滑动
                        //左侧
                        if (x0 < videoWidth / 2) {
                            videoBrightBarControl = true;
                            setVideoBrightBar(true);
                            showVideoBrightBar(y0 - moveY);
                        } else {//右侧
                            videoVolumeBarControl = true;
                            setVideoVolumeBar(true);
                            showVideoVolumeBar(y0 - moveY);
                        }
                    }
                }
            },
            onPanResponderTerminationRequest: (evt, gestureState) => {
                // console.log(7);
                return true;
            },
            onPanResponderRelease: (evt, gestureState) => {
                // 用户放开了所有的触摸点，且此时视图已经成为了响应者。
                // 一般来说这意味着一个手势操作已经成功完成。
                // console.log(8);
                let timeout = setTimeout(() => {
                    videoTimeBarControl = false;
                    videoVolumeBarControl = false;
                    videoBrightBarControl = false;
                    setVideoTimeBar(false);
                    setVideoVolumeBar(false);
                    setVideoBrightBar(false);
                    clearTimeout(timeout)
                }, 1000);

            },
            onPanResponderTerminate: (evt, gestureState) => {
                // console.log(9)
                // 另一个组件已经成为了新的响应者，所以当前手势将被取消。
            },
            onShouldBlockNativeResponder: (evt, gestureState) => {
                // console.log(10)
                // 返回一个布尔值，决定当前组件是否应该阻止原生组件成为JS响应者
                // 默认返回true。目前暂时只支持android。
                return true;
            },
        })
    ).current;

    const [isVideoPlay, setIsVideoPlay] = useState(true);
    const [cachedWidth, setCachedWidth] = useState(0);
    const [playedWidth, setPlayedWidth] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [currentTimeFormat, setCurrentTimeFormat] = useState("00:00");
    const [duration, setDuration] = useState(0);
    const [durationFormat, setDurationFormat] = useState("INF");
    const [videoRate, setVideoRate] = useState(1.0);
    const [rateStr, setRateStr] = useState("1.00");
    const [videoMuted, setVideoMuted] = useState(false);
    const [videoWidth, setVideoWidth] = useState(props.videoWidth);
    const [videoHeight, setVideoHeight] = useState(props.videoHeight);
    const [videoVolumeBarHeight, setVideoVolumeBarHeight] = useState(props.videoHeight / 1.5);
    const [paddingLeftRight, setPaddingLeftRight] = useState(10);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isWidgetShow, setIsWidgetShow] = useState(true);
    const [videoTimeBar, setVideoTimeBar] = useState(false);
    const [videoVolume, setVideoVolume] = useState(0.5);
    const [videoVolumeBar, setVideoVolumeBar] = useState(false);
    const [videoBright, setVideoBright] = useState(1);
    const [videoBrightBar, setVideoBrightBar] = useState(false);
    const [videoForwardBar, setVideoForwardBar] = useState(false);
    const [isBufferTips, setIsBufferTips] = useState(true);
    const [startBuffer, setStartBuffer] = useState(false);
    const [finishBuffer, setFinishBuffer] = useState(false);

    // let isDidMount = true;

    useEffect(() => {
        //默认锁定为竖屏
        Orientation.lockToPortrait();
    }, [])


    const showVideoTimeBar = (t) => {

        setCurrentTime(prevTime => {
            let newTime = prevTime + t / 100;
            setDuration(duration=>{
                newTime = newTime < 0 ? 0 : newTime > duration ? duration : newTime;
                return duration;
            })
            let currentTimeFormat = videoTimeFormat(newTime);
            setCurrentTimeFormat(currentTimeFormat);
            videoPlayerRef.current.seek(newTime);
            return newTime;
        })
    }

    //暂时改变不了，感觉是组件api的问题
    const showVideoBrightBar = async (size) => {

        let addPercent = size / 10 / videoVolumeBarHeight;
        let newVideoBright = videoBright + addPercent;
        newVideoBright = newVideoBright < 0 ? 0 : newVideoBright > 1 ? 1 : newVideoBright;
        //get the current brightness
        SystemSetting.getBrightness().then((brightness) => {
            setVideoBright(brightness);
        });
        //change the brightness & check permission
        // await SystemSetting.setBrightnessForce(newVideoBright).then((success) => {
        //     if (success) {
        //         setState({
        //             videoBrightBar: true,
        //             videoBright: newVideoBright
        //         })
        //     } else {
        //         Alert.alert('Permission Deny', 'You have no permission changing settings', [
        //             { 'text': 'Cancel', style: 'cancel' },
        //             { 'text': 'Open Setting', onPress: () => SystemSetting.grantWriteSettingPermission() }
        //         ])
        //     }
        // });

    }

    // let videoVolumeRef = useRef(0.5).current;
    const showVideoVolumeBar = (size) => {
        let addPercent = size / 10 / videoVolumeBarHeight;
        // let newVideoVolume = videoVolumeRef + addPercent;
        // newVideoVolume = newVideoVolume < 0 ? 0 : newVideoVolume > 1 ? 1 : newVideoVolume;
        // videoVolumeRef = newVideoVolume;
        // console.log(videoVolumeRef)
        // setVideoVolume(videoVolumeRef);

        setVideoVolume(prevVideoVolume => {
            let newVideoVolume = prevVideoVolume + addPercent;
            return newVideoVolume < 0 ? 0 : newVideoVolume > 1 ? 1 : newVideoVolume;
        });
    }



    //准备好播放时调用的回调函数
    const onLoad = ({ duration }) => {
        let durationFormat = videoTimeFormat(duration);
        setIsBufferTips(false);
        setDuration(duration);
        setDurationFormat(durationFormat);
    }

    //播放时,进度条移动
    const onProgress = ({ currentTime, playableDuration, seekableDuration }) => {
        let cachedWidth = playableDuration / seekableDuration * videoWidth;
        let playedWidth = currentTime / seekableDuration * videoWidth;
        let currentTimeFormat = videoTimeFormat(currentTime);
        setCachedWidth(cachedWidth);
        setPlayedWidth(playedWidth);
        setCurrentTime(currentTime);
        setCurrentTimeFormat(currentTimeFormat);
    }

    //点击进度条,进行进度调整
    const onClickProgress = (event) => {
        let pageX = event.nativeEvent.pageX;
        let playedPercent = pageX / videoWidth;
        videoPlayerRef.current.seek(duration * playedPercent);
        setPlayedWidth(pageX);
    }

    const toggleSpeed = () => {
        let videoRateTmp = videoRate;
        if (videoRateTmp == 2.0) {
            videoRateTmp = 0.25;
        } else {
            videoRateTmp += 0.25;
        }
        let rateStr = videoRateTmp.toString();
        if (rateStr.length == 1) {
            rateStr += ".00";
        } else if (rateStr.length == 3) {
            rateStr += "0";
        }
        setVideoRate(videoRateTmp);
        setRateStr(rateStr);
    }

    let isFullScreenRef = useRef(false);//不知道是不是bool值的不能直接赋值current,直接赋不行.
    const openFullScreen = () => {
        isFullScreenRef.current = true;
        Orientation.lockToLandscape();
        
        let videoVolumeBarHeight = props.videoWidth / 1.5;
        props.onEnterFullScreen();
        setVideoWidth(screenHeight);
        setVideoHeight(screenWidth);
        setVideoVolumeBarHeight(videoVolumeBarHeight);
        setPaddingLeftRight(30);
        
    }

    const closeFullScreen = () => {
        isFullScreenRef.current = false;
        Orientation.lockToPortrait();

        let videoVolumeBarHeight = props.videoHeight / 1.5;
        props.onExitFullScreen();
        setVideoWidth(props.videoWidth);
        setVideoHeight(props.videoHeight);
        setVideoVolumeBarHeight(videoVolumeBarHeight);
        setPaddingLeftRight(10);
    }

    const toggleFullScreen = () => {
        if (isFullScreenRef.current) {
            closeFullScreen();
        } else {
            openFullScreen();
        }
    }

    const navigation = useNavigation();
    useEffect(()=>{
        navigation.addListener('beforeRemove',(e)=>{
            if(!isFullScreenRef.current){
                return;//如果不处于全屏状态,不拦截
            }
            e.preventDefault();
            closeFullScreen();
        })
    },[navigation])


    let timeout = useRef(null).current;
    let doublePressInitTime = useRef(0).current;//记录点击开始的时间
    let doublePressTime = useRef(0).current;    //记录点击的次数
    let doublePressTimeThreshold = useRef(300).current; //ms,记录只有在这段时间范围内，点击屏幕两次，才算双击
    const onPress = () => {
        //检查双击播放
        if (doublePressTime == 0) {
            doublePressInitTime = new Date().getTime();
            doublePressTime += 1;

            timeout = setTimeout(() => {
                doublePressTime = 0;
                setIsWidgetShow(!isWidgetShow);//单击
                clearTimeout(timeout)
            }, doublePressTimeThreshold);
        } else {
            doublePressTime = 0;
            let now = new Date().getTime();
            if (now - doublePressInitTime < doublePressTimeThreshold) {
                setIsVideoPlay(!isVideoPlay);//双击
                clearTimeout(timeout)
            }
        }

    }


    const showVideoForwardBar = (bool) => {
        if (bool) {
            Vibration.vibrate([0, 100], false);//震动提示
        }
        let videoRate = bool ? 2 : 1;
        setVideoForwardBar(bool);
        setVideoRate(videoRate);
    }


    const topicTrendsNum = useSelector(selectTopicTrendsNum);
    const topicTrends = useSelector(selectTopicTrends);

    return (
        // <View style={{ flex: 1, ...statusBarPadding }}>
        //     <StatusBar backgroundColor="#000" barStyle="light-content" translucent={true} hidden={!isStatusBarShow} />
        <View style={{ position: 'relative', zIndex: 0 }}>
            <Video
                ref={videoPlayerRef}
                // source={{ uri: "" }}
                source={props.videoSource ? { uri: props.videoSource, type: props.videoType } : videoSource}//设置视频源  新海诚，从未让我们失望 𝑻𝒉𝒆 𝒓𝒂𝒊𝒏 𝒂𝒏𝒅 𝒕𝒉𝒆 𝒍𝒊𝒈𝒉𝒕
                style={{ width: videoWidth, height: videoHeight, backgroundColor: "#000" }}
                // autoPlay={true}
                paused={isVideoPlay}//播放器暂停
                resizeMode={props.videoResizeMode}//contain(自适应) || cover(不适应) || stretch(拉伸)
                poster={props.videoPoster}//只能是url
                posterResizeMode={props.videoPosterResizeMode}
                rate={videoRate}//播放速率
                hideShutterView={true}
                volume={videoVolume}//调节音量
                muted={videoMuted}//控制音频是否静音
                onLoadStart={() => { setStartBuffer(true) }}//开始载入
                onReadyForDisplay={() => { setFinishBuffer(true) }}//载入完成
                onLoad={onLoad}//加载媒体并准备播放时调用的回调函数。
                onProgress={onProgress}//视频播放过程中每个间隔进度单位调用的回调函数
                bufferConfig={{
                    minBufferMs: 30000,//一直维持缓冲这么长时间
                    maxBufferMs: 180000,//最多只能缓存这么长
                    bufferForPlaybackMs: 2500,//只有缓存了这么长才能播放
                    bufferForPlaybackAfterRebufferMs: 15000//当前播放进度的前这么长时间,方便"快退"时不卡
                }}

            // fullscreen = {true}
            // fullscreenOrientation="landscape"
            // onEnd={onEnd}//视频播放结束时的回调函数
            // onAudioBecomingNoisy={onAudioBecomingNoisy}//音频变得嘈杂时的回调 - 应暂停视频
            // onAudioFocusChanged={onAudioFocusChanged}//音频焦点丢失时的回调 - 如果焦点丢失则暂停
            // repeat={true}//确定在到达结尾时是否重复播放视频。
            />


            {/* 透明遮罩,用来控制控件显示 */}
            <View
                {...panResponder.panHandlers}
                style={{ position: "absolute", zIndex: 1, width: videoWidth, height: videoHeight, }}
            >

                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => { onPress() }}
                    onLongPress={() => { showVideoForwardBar(true) }}
                    onPressOut={() => { showVideoForwardBar(false) }}
                    style={{ position: "absolute", width: videoWidth, height: videoHeight, }}
                >

                    {/* 是否提示正在缓冲 */}
                    {isBufferTips && startBuffer
                        ? <View style={{ position: 'absolute', zIndex: 2, bottom: videoHeight / 3.5, left: videoHeight / 6 }}>
                            <Text style={{ color: "#ffffffe6" }}>缓冲中...</Text>
                        </View>
                        : <></>}

                    {isBufferTips && finishBuffer
                        ? <View style={{ position: 'absolute', zIndex: 2, bottom: videoHeight / 5, left: videoHeight / 6 }}>
                            <Text style={{ color: "#ffffffe6" }}>缓冲完成，准备播放</Text>
                        </View>
                        : <></>}


                    {/* 左边调节亮度的bar */}
                    {videoBrightBar
                        ? <View style={{ position: 'absolute', zIndex: 2, top: videoHeight / 6, left: videoHeight / 6 }}>
                            <View style={{ position: 'relative', overflow: "hidden", flex: 1, alignItems: "center", borderRadius: 20, width: videoHeight / 4, height: videoVolumeBarHeight, backgroundColor: "#ccc5" }}>
                                <FontAwesomeIcon style={{ marginTop: videoHeight / 10 }} name="adjust" size={20} color="#ffffffe6" />
                                <View style={{ position: 'absolute', bottom: 0, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, width: videoHeight / 4, height: videoVolumeBarHeight * videoBright, backgroundColor: "#ffffffe6" }}></View>
                            </View>
                        </View>
                        : <></>}


                    {/* 右边调节声音的bar */}
                    {videoVolumeBar
                        ? <View style={{ position: 'absolute', zIndex: 2, top: videoHeight / 6, right: videoHeight / 6 }}>
                            <View style={{ position: 'relative', overflow: "hidden", flex: 1, alignItems: "center", borderRadius: 20, width: videoHeight / 4, height: videoVolumeBarHeight, backgroundColor: "#ccc5" }}>
                                <FontAwesomeIcon style={{ marginTop: videoHeight / 10 }} name="volume-off" size={20} color="#ffffffe6" />
                                <View style={{ position: 'absolute', bottom: 0, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, width: videoHeight / 4, height: videoVolumeBarHeight * videoVolume, backgroundColor: "#ffffffe6" }}></View>
                            </View>
                        </View>
                        : <></>}


                    {/* 左上角显示快进的bar */}
                    {videoForwardBar
                        ? <View style={{ position: 'absolute', zIndex: 2, top: videoHeight / 6, left: videoHeight / 6 + videoHeight / 4 }}>
                            <View style={{ backgroundColor: "#ccc5", borderRadius: 5, flexDirection: "row", alignItems: "center", justifyContent: "center", paddingTop: 2, paddingBottom: 2, paddingLeft: 5, paddingRight: 5 }}>
                                <Text style={{ fontWeight: "bold", color: topicTrends[topicTrendsNum].style_desc.gradient_start }}>2x</Text>
                                <Text style={{ color: "#ffffffe6" }}> 快进中...</Text>
                            </View>
                        </View>
                        : <></>}


                    {/* 播放按钮上的拖动进度条应该出现的播放时间bar */}
                    {videoTimeBar
                        ? <View style={{ position: 'absolute', zIndex: 2, top: 0, flex: 1, alignItems: "center", justifyContent: "center", width: videoWidth, height: videoHeight, }}>
                            <View style={{ backgroundColor: "#ccc5", marginBottom: 60, borderRadius: 5, flexDirection: "row", alignItems: "center", justifyContent: "center", paddingTop: 2, paddingBottom: 2, paddingLeft: 5, paddingRight: 5 }}>
                                <Text style={{ fontWeight: "bold", fontSize: 20, color: topicTrends[topicTrendsNum].style_desc.gradient_start, }}>{currentTimeFormat}</Text>
                                <Text style={{ color: "#ffffffe6", }}> / {durationFormat}</Text>
                            </View>

                        </View>
                        : <></>}


                    {/* 中间的播放按钮 */}
                    {isWidgetShow
                        ? <View style={{ position: 'absolute', zIndex: 2, top: 0, flex: 1, alignItems: "center", justifyContent: "center", width: videoWidth, height: videoHeight, }}>
                            <TouchableOpacity onPress={() => { setIsVideoPlay(!isVideoPlay) }}>
                                <FontAwesomeIcon name={isVideoPlay ? "play" : "pause"} size={30} color="#fff" />
                            </TouchableOpacity>
                        </View>
                        : <></>}

                    {/* 底部控件 */}
                    <LinearGradient
                        start={{ x: 0, y: 1 }}
                        end={{ x: 0, y: 0 }}
                        colors={["#0004", "transparent"]}
                        style={{ position: "absolute", zIndex: 2, bottom: 0, }}>
                        {/* 进度条 */}
                        <TouchableOpacity style={{
                            paddingTop: 5, paddingBottom: 5, position: "relative", bottom: -5,
                        }} onPress={(event) => { onClickProgress(event) }}>
                            <View style={{ position: "relative", zIndex: 2, backgroundColor: "#ccc5", height: 3, width: videoWidth }}>
                                {/* 缓存 */}
                                <View style={{ position: "absolute", zIndex: 3, backgroundColor: "#ffffffe6", height: 3, width: cachedWidth }}></View>
                                {/* 已播放 */}
                                <View style={{ position: "absolute", zIndex: 4, backgroundColor: topicTrends[topicTrendsNum].style_desc.gradient_start, height: 3, width: playedWidth }}></View>
                                {/* 小圆点 */}
                                <LinearGradient
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    colors={[topicTrends[topicTrendsNum].style_desc.gradient_start, topicTrends[topicTrendsNum].style_desc.gradient_end]}
                                    style={{
                                        position: "absolute", zIndex: 5,
                                        height: 8, width: 8, borderRadius: 4, left: playedWidth - 4, top: -2.5,
                                        shadowColor: "#fff", shadowRadius: 20,
                                    }}
                                ></LinearGradient>
                            </View>
                        </TouchableOpacity>
                        {/* 时间显示,调整音量,全屏等操作 */}
                        {isWidgetShow
                            ? <View style={{ flexDirection: "row", justifyContent: "space-between", paddingTop: 10, paddingBottom: 10, paddingLeft: paddingLeftRight, paddingRight: paddingLeftRight }}>
                                <View>
                                    <Text style={{ color: "#ffffffe6" }}>{currentTimeFormat} / {durationFormat}</Text>
                                </View>
                                <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                                    <TouchableOpacity onPress={toggleSpeed} style={{ marginLeft: 20, flexDirection: "row", alignItems: "center" }}>
                                        <Text style={{ color: "#ffffffe6" }}>x{rateStr}</Text>
                                        <FontAwesomeIcon style={{ marginLeft: 10 }} name="forward" size={15} color="#ffffffe6" />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => { setVideoMuted(!videoMuted) }} style={{ marginLeft: 20, justifyContent: "center" }}>
                                        <FontAwesomeIcon name={videoMuted ? "volume-mute" : "volume-up"} size={15} color="#ffffffe6" />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => {
                                        if(props.canBeFullScreen){
                                            toggleFullScreen()
                                        }
                                    }} style={{ marginLeft: 20, justifyContent: "center" }}>
                                        <FontAwesomeIcon name={isFullScreenRef.current ? "compress-arrows-alt" : "expand-arrows-alt"} size={15} color="#ffffffe6" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            : <></>}

                    </LinearGradient>
                </TouchableOpacity>

            </View>
        </View>

        //</View>
    );
}
