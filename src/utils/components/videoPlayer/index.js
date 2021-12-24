import React from 'react';
import { View, Text, StatusBar, TouchableOpacity, PanResponder, Alert, Vibration } from 'react-native';
import Video from "react-native-video";
import { topicTrends, topicTrendsNum, screenWidth, screenHeight } from "../../../utils/stylesKits";
import { videoTimeFormat } from "../../../utils/funcKits";
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';
import Orientation from "react-native-orientation";
import SystemSetting from 'react-native-system-setting'

const videoSource = require('../../../res/video/rain.mp4');

class Index extends React.Component {

    static defaultProps = {
        videoPoster: "http://img.netbian.com/file/2021/0605/smalld9fcb449fa428b1cc001b40527b990761622906649.jpg",
        videoResizeMode: 'contain',
        videoPosterResizeMode: 'contain',
        videoWidth: screenWidth,
        videoHeight: screenWidth * 9 / 16,//16:9
    }

    showVideoTimeBar = (t) => {
        const { currentTime, duration } = this.state;
        let newTime = currentTime + t / 100;
        newTime = newTime < 0 ? 0 : newTime > duration ? duration : newTime;
        let currentTimeFormat = videoTimeFormat(newTime);
        this.videoPlayerRef.seek(newTime);
        this.setState({
            videoTimeBar: true,
            currentTime: newTime,
            currentTimeFormat
        })
    }

    //暂时改变不了，感觉是组件api的问题
    showVideoBrightBar = async (size) => {

        let { videoBright, videoVolumeBarHeight } = this.state;
        let addPercent = size / 10 / videoVolumeBarHeight;
        let newVideoBright = videoBright + addPercent;
        newVideoBright = newVideoBright < 0 ? 0 : newVideoBright > 1 ? 1 : newVideoBright;
        //get the current brightness
        SystemSetting.getBrightness().then((brightness) => {
            this.setState({
                videoBrightBar: true,
                videoBright: brightness
            })

        });
        //change the brightness & check permission
        // await SystemSetting.setBrightnessForce(newVideoBright).then((success) => {
        //     if (success) {
        //         this.setState({
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

    showVideoVolumeBar = (size) => {
        let { videoVolume, videoVolumeBarHeight } = this.state;
        let addPercent = size / 10 / videoVolumeBarHeight;
        let newVideoVolume = videoVolume + addPercent;
        newVideoVolume = newVideoVolume < 0 ? 0 : newVideoVolume > 1 ? 1 : newVideoVolume;
        this.setState({
            videoVolumeBar: true,
            videoVolume: newVideoVolume
        })

    }

    constructor(props) {
        super(props);

        this.videoTimeBar = false;
        this.videoBrightBar = false;
        this.videoVolumeBar = false;

        this.doublePressInitTime = 0;//记录点击开始的时间
        this.doublePressTime = 0;    //记录点击的次数
        this.doublePressTimeThreshold = 500; //ms,记录只有在这段时间范围内，点击屏幕两次，才算双击

        this._panResponder = PanResponder.create({
            // 是否允许子组件入栈（响应栈，出栈时进行响应）
            // onStartShouldSetPanResponderCapture: (evt, gestureState) => {
            //     // this.props.navigation.navigate("ResponderDemo");
            //     console.log(1);
            //     return true;
            // },
            // onStartShouldSetPanResponder: (evt, gestureState) => {
            //     console.log(2);
            //     return true;
            // },
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
                // console.log(3);
                return false;//false会进入onMoveShouldSetPanResponder，true则跳过这个方法
            },
            onMoveShouldSetPanResponder: (evt, gestureState) => {
                // console.log(4)

                let { dx, dy } = gestureState;
                if ((Math.abs(dx) > 5) || (Math.abs(dy) > 5)) {
                    return true
                } else {
                    return false
                }
            },
            onPanResponderGrant: (evt, gestureState) => {
                // 开始手势操作。给用户一些视觉反馈，让他们知道发生了什么事情！
                // console.log(5)
            },
            onPanResponderMove: (evt, gestureState) => {
                const { moveX, moveY, x0, y0, dx, dy, vx, vy } = gestureState;


                if (this.videoTimeBar) {
                    this.showVideoTimeBar(moveX - x0);
                }
                else if (this.videoVolumeBar) {
                    this.showVideoVolumeBar(y0 - moveY);
                }
                else if (this.videoBrightBar) {
                    this.showVideoBrightBar(y0 - moveY);
                }
                else {
                    //横向滑动
                    if (Math.abs(vx) > Math.abs(vy)) {
                        this.videoTimeBar = true;
                        this.showVideoTimeBar(moveX - x0);
                    } else {//纵向滑动
                        //左侧
                        if (x0 < this.state.videoWidth / 2) {
                            this.videoBrightBar = true;
                            this.showVideoBrightBar(y0 - moveY);
                        } else {//右侧
                            this.videoVolumeBar = true;
                            this.showVideoVolumeBar(y0 - moveY);
                        }
                    }
                }



                // console.log(moveX, moveY, x0, y0, dx, dy, vx, vy)
            },
            onPanResponderTerminationRequest: (evt, gestureState) => {
                // console.log(7);
                return true;
            },
            onPanResponderRelease: (evt, gestureState) => {
                // 用户放开了所有的触摸点，且此时视图已经成为了响应者。
                // 一般来说这意味着一个手势操作已经成功完成。
                // console.log(8);
                this.videoTimeBar = false;
                this.videoVolumeBar = false;
                this.videoBrightBar = false;
                this.setState({
                    videoTimeBar: false,
                    videoVolumeBar: false,
                    videoBrightBar: false,
                })
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
        });

        // let videoWidth = screenWidth;
        // let videoHeight = screenWidth * 9 / 16;//16:9

        this.state = {
            isVideoPlay: true,
            cachedWidth: 0,
            playedWidth: 0,
            currentTime: 0,
            currentTimeFormat: "00:00",
            duration: 0,
            durationFormat: "INF",
            videoRate: 1.0,
            rateStr: "1.00",
            videoMuted: false,
            videoWidth: props.videoWidth,
            videoHeight: props.videoHeight,
            videoVolumeBarHeight: props.videoHeight / 1.5,
            paddingLeftRight: 10,
            isFullScreen: false,
            isWidgetShow: true,
            // statusBarPadding: { paddingTop: 30 },
            // isStatusBarShow: true,

            videoTimeBar: false,
            videoVolume: 0.5,
            videoVolumeBar: false,
            videoBright: 1,
            videoBrightBar: false,
            videoForwardBar: false,

            isBufferTips:true,
            startBuffer:false,
            finishBuffer:false,
        }
    }

    //准备好播放时调用的回调函数
    onLoad = ({ duration }) => {
        let durationFormat = videoTimeFormat(duration);
        this.setState({
            isBufferTips:false,
            duration: duration,
            durationFormat: durationFormat
        })
    }
    //播放完时调用的回调函数
    // onEnd = () => {
    //     this.setState({ paused: true })
    //     this.video.seek(1)
    // };

    //播放时,进度条移动
    onProgress = ({ currentTime, playableDuration, seekableDuration }) => {
        let cachedWidth = playableDuration / seekableDuration * this.state.videoWidth;
        let playedWidth = currentTime / seekableDuration * this.state.videoWidth;
        let currentTimeFormat = videoTimeFormat(currentTime);
        this.setState({
            cachedWidth: cachedWidth,
            playedWidth: playedWidth,
            currentTime, currentTimeFormat
        })
    }

    //点击进度条,进行进度调整
    onClickProgress = (event) => {
        let pageX = event.nativeEvent.pageX;
        let playedPercent = pageX / this.state.videoWidth;
        this.videoPlayerRef.seek(this.state.duration * playedPercent);
        this.setState({
            playedWidth: pageX
        })
    }

    toggleSpeed = () => {
        let videoRate = this.state.videoRate;
        if (videoRate == 2.0) {
            videoRate = 0.25;
        } else {
            videoRate += 0.25;
        }
        let rateStr = videoRate.toString();
        if (rateStr.length == 1) {
            rateStr += ".00";
        } else if (rateStr.length == 3) {
            rateStr += "0";
        }
        this.setState({
            videoRate, rateStr
        })
    }


    openFullScreen = () => {
        Orientation.lockToLandscape();
        let videoVolumeBarHeight = this.props.videoWidth / 1.5;
        this.props.onEnterFullScreen();
        this.setState({
            videoWidth: screenHeight,
            videoHeight: screenWidth,
            videoVolumeBarHeight,
            paddingLeftRight: 30,
            isFullScreen: true,
            // statusBarPadding: { paddingTop: 0 },
            // isStatusBarShow: false
        })
    }

    closeFullScreen = () => {
        Orientation.lockToPortrait();
        let videoVolumeBarHeight = this.props.videoHeight / 1.5;
        this.props.onExitFullScreen();
        this.setState({
            videoWidth: this.props.videoWidth,
            videoHeight: this.props.videoHeight,
            videoVolumeBarHeight,
            paddingLeftRight: 10,
            isFullScreen: false,
            // statusBarPadding: { paddingTop: 30 },
            // isStatusBarShow: true
        })
    }

    toggleFullScreen = () => {
        const { isFullScreen } = this.state;
        if (isFullScreen) {
            this.closeFullScreen();
        } else {
            this.openFullScreen();
        }
    }

    onPress = () => {
        //检查双击播放
        if (this.doublePressTime == 0) {
            this.doublePressInitTime = new Date().getTime();
            this.doublePressTime += 1;
            setTimeout(() => {
                this.doublePressTime = 0;
            }, this.doublePressTimeThreshold);
        } else {
            this.doublePressTime = 0;
            let now = new Date().getTime();
            if (now - this.doublePressInitTime < this.doublePressTimeThreshold) {
                this.setState({
                    isVideoPlay: !this.state.isVideoPlay
                })
            }
        }
        this.setState({ isWidgetShow: !this.state.isWidgetShow })
    }

    showVideoForwardBar = (bool) => {
        if (bool) {
            Vibration.vibrate([0, 100], false);//震动提示
        }
        let videoRate = bool ? 2 : 1;
        this.setState({
            videoForwardBar: bool,
            videoRate,
        })
    }

    render() {
        const { videoWidth, videoHeight, videoVolumeBarHeight } = this.state;

        // console.log("player播放网址：",this.props.videoSource);
        //     console.log("player封面：",this.props.videoPoster);
        return (
            // <View style={{ flex: 1, ...this.state.statusBarPadding }}>
            //     <StatusBar backgroundColor="#000" barStyle="light-content" translucent={true} hidden={!this.state.isStatusBarShow} />
            <View style={{ position: 'relative', zIndex: 0 }}>
                <Video
                    ref={(ref) => {
                        this.videoPlayerRef = ref
                    }}
                    // source={{ uri: "" }}
                    source={this.props.videoSource?{ uri: this.props.videoSource,type: 'm3u8' }:videoSource }//设置视频源  新海诚，从未让我们失望 𝑻𝒉𝒆 𝒓𝒂𝒊𝒏 𝒂𝒏𝒅 𝒕𝒉𝒆 𝒍𝒊𝒈𝒉𝒕
                    style={{ width: videoWidth, height: videoHeight, backgroundColor: "#000" }}
                    // autoPlay={true}
                    paused={this.state.isVideoPlay}//播放器暂停
                    resizeMode={this.props.videoResizeMode}//cover
                    poster={this.props.videoPoster}//只能是url
                    posterResizeMode={this.props.videoPosterResizeMode}
                    rate={this.state.videoRate}//播放速率
                    hideShutterView={true}
                    volume={this.state.videoVolume}//调节音量
                    muted={this.state.videoMuted}//控制音频是否静音
                    onLoadStart={() => { this.setState({startBuffer:true}) }}//开始载入
                    onReadyForDisplay={() => { this.setState({finishBuffer:true}) }}//载入完成
                    onLoad={this.onLoad}//加载媒体并准备播放时调用的回调函数。
                    onProgress={this.onProgress}//视频播放过程中每个间隔进度单位调用的回调函数
                    bufferConfig={{
                        minBufferMs: 15000,//一直维持缓冲这么长时间
                        maxBufferMs: 50000,//最多只能缓存这么长
                        bufferForPlaybackMs: 2500,//只有缓存了这么长才能播放
                        bufferForPlaybackAfterRebufferMs: 5000//当前播放进度的前这么长时间,方便"快退"时不卡
                    }}

                // fullscreen = {true}
                // fullscreenOrientation="landscape"
                // onEnd={this.onEnd}//视频播放结束时的回调函数
                // onAudioBecomingNoisy={this.onAudioBecomingNoisy}//音频变得嘈杂时的回调 - 应暂停视频
                // onAudioFocusChanged={this.onAudioFocusChanged}//音频焦点丢失时的回调 - 如果焦点丢失则暂停
                // repeat={true}//确定在到达结尾时是否重复播放视频。
                />


                {/* 透明遮罩,用来控制控件显示 */}
                <View
                    {...this._panResponder.panHandlers}
                    style={{ position: "absolute", zIndex: 1, width: videoWidth, height: videoHeight, }}
                >

                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => { this.onPress() }}
                        onLongPress={() => { this.showVideoForwardBar(true) }}
                        onPressOut={() => { this.showVideoForwardBar(false) }}
                        style={{ position: "absolute", width: videoWidth, height: videoHeight, }}
                    >

                        {/* 是否提示正在缓冲 */}
                        {this.state.isBufferTips && this.state.startBuffer
                            ? <View style={{ position: 'absolute', zIndex: 2, bottom: videoHeight / 3.5, left: videoHeight / 6 }}>
                                <Text style={{ color: "#ffffffe6" }}>缓冲中...</Text>
                            </View>
                            : <></>}

                        {this.state.isBufferTips && this.state.finishBuffer
                            ? <View style={{ position: 'absolute', zIndex: 2, bottom: videoHeight / 5, left: videoHeight / 6 }}>
                                <Text style={{ color: "#ffffffe6" }}>缓冲完成，准备播放</Text>
                            </View>
                            : <></>}


                        {/* 左边调节亮度的bar */}
                        {this.videoBrightBar
                            ? <View style={{ position: 'absolute', zIndex: 2, top: videoHeight / 6, left: videoHeight / 6 }}>
                                <View style={{ position: 'relative', overflow: "hidden", flex: 1, alignItems: "center", borderRadius: 20, width: videoHeight / 4, height: videoVolumeBarHeight, backgroundColor: "#ccc5" }}>
                                    <FontAwesomeIcon style={{ marginTop: videoHeight / 10 }} name="adjust" size={20} color="#ffffffe6" />
                                    <View style={{ position: 'absolute', bottom: 0, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, width: videoHeight / 4, height: videoVolumeBarHeight * this.state.videoBright, backgroundColor: "#ffffffe6" }}></View>
                                </View>
                            </View>
                            : <></>}


                        {/* 右边调节声音的bar */}
                        {this.state.videoVolumeBar
                            ? <View style={{ position: 'absolute', zIndex: 2, top: videoHeight / 6, right: videoHeight / 6 }}>
                                <View style={{ position: 'relative', overflow: "hidden", flex: 1, alignItems: "center", borderRadius: 20, width: videoHeight / 4, height: videoVolumeBarHeight, backgroundColor: "#ccc5" }}>
                                    <FontAwesomeIcon style={{ marginTop: videoHeight / 10 }} name="volume-off" size={20} color="#ffffffe6" />
                                    <View style={{ position: 'absolute', bottom: 0, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, width: videoHeight / 4, height: videoVolumeBarHeight * this.state.videoVolume, backgroundColor: "#ffffffe6" }}></View>
                                </View>
                            </View>
                            : <></>}


                        {/* 左上角显示快进的bar */}
                        {this.state.videoForwardBar
                            ? <View style={{ position: 'absolute', zIndex: 2, top: videoHeight / 6, left: videoHeight / 6 + videoHeight / 4 }}>
                                <View style={{ backgroundColor: "#ccc5", borderRadius: 5, flexDirection: "row", alignItems: "center", justifyContent: "center", paddingTop: 2, paddingBottom: 2, paddingLeft: 5, paddingRight: 5 }}>
                                    <Text style={{ fontWeight: "bold", color: topicTrends[topicTrendsNum].color.color_num }}>2x</Text>
                                    <Text style={{ color: "#ffffffe6" }}> 快进中...</Text>
                                </View>
                            </View>
                            : <></>}


                        {/* 播放按钮上的拖动进度条应该出现的播放时间bar */}
                        {this.state.videoTimeBar
                            ? <View style={{ position: 'absolute', zIndex: 2, top: 0, flex: 1, alignItems: "center", justifyContent: "center", width: videoWidth, height: videoHeight, }}>
                                <View style={{ backgroundColor: "#ccc5", marginBottom: 60, borderRadius: 5, flexDirection: "row", alignItems: "center", justifyContent: "center", paddingTop: 2, paddingBottom: 2, paddingLeft: 5, paddingRight: 5 }}>
                                    <Text style={{ fontWeight: "bold", fontSize: 20, color: topicTrends[topicTrendsNum].color.color_num, }}>{this.state.currentTimeFormat}</Text>
                                    <Text style={{ color: "#ffffffe6", }}> / {this.state.durationFormat}</Text>
                                </View>

                            </View>
                            : <></>}


                        {/* 中间的播放按钮 */}
                        {this.state.isWidgetShow
                            ? <View style={{ position: 'absolute', zIndex: 2, top: 0, flex: 1, alignItems: "center", justifyContent: "center", width: videoWidth, height: videoHeight, }}>
                                <TouchableOpacity onPress={() => { this.setState({ isVideoPlay: !this.state.isVideoPlay }) }}>
                                    <FontAwesomeIcon name={this.state.isVideoPlay ? "play" : "pause"} size={30} color="#fff" />
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
                            <TouchableOpacity ref={ref => this.progressRef = ref} style={{
                                paddingTop: 5, paddingBottom: 5, position: "relative", bottom: -5,
                            }} onPress={(event) => { this.onClickProgress(event) }}>
                                <View style={{ position: "relative", zIndex: 2, backgroundColor: "#ccc5", height: 3, width: this.state.videoWidth }}>
                                    {/* 缓存 */}
                                    <View style={{ position: "absolute", zIndex: 3, backgroundColor: "#ffffffe6", height: 3, width: this.state.cachedWidth }}></View>
                                    {/* 已播放 */}
                                    <View style={{ position: "absolute", zIndex: 4, backgroundColor: topicTrends[topicTrendsNum].color.color_num, height: 3, width: this.state.playedWidth }}></View>
                                    {/* 小圆点 */}
                                    <LinearGradient
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        colors={[topicTrends[topicTrendsNum].plus_style.style_desc.gradient_start, topicTrends[topicTrendsNum].plus_style.style_desc.gradient_end]}
                                        style={{
                                            position: "absolute", zIndex: 5,
                                            height: 8, width: 8, borderRadius: 4, left: this.state.playedWidth - 4, top: -2.5,
                                            shadowColor: "#fff", shadowRadius: 20,
                                        }}
                                    ></LinearGradient>
                                </View>
                            </TouchableOpacity>
                            {/* 时间显示,调整音量,全屏等操作 */}
                            {this.state.isWidgetShow
                                ? <View style={{ flexDirection: "row", justifyContent: "space-between", paddingTop: 10, paddingBottom: 10, paddingLeft: this.state.paddingLeftRight, paddingRight: this.state.paddingLeftRight }}>
                                    <View>
                                        <Text style={{ color: "#ffffffe6" }}>{this.state.currentTimeFormat} / {this.state.durationFormat}</Text>
                                    </View>
                                    <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                                        <TouchableOpacity onPress={this.toggleSpeed} style={{ marginLeft: 20, flexDirection: "row", alignItems: "center" }}>
                                            <Text style={{ color: "#ffffffe6" }}>x{this.state.rateStr}</Text>
                                            <FontAwesomeIcon style={{ marginLeft: 10 }} name="forward" size={15} color="#ffffffe6" />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => { this.setState({ videoMuted: !this.state.videoMuted }) }} style={{ marginLeft: 20, justifyContent: "center" }}>
                                            <FontAwesomeIcon name={this.state.videoMuted ? "volume-mute" : "volume-up"} size={15} color="#ffffffe6" />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => {
                                            this.toggleFullScreen()
                                        }} style={{ marginLeft: 20, justifyContent: "center" }}>
                                            <FontAwesomeIcon name={this.state.isFullScreen ? "compress-arrows-alt" : "expand-arrows-alt"} size={15} color="#ffffffe6" />
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

    componentDidMount() {
        // this.props.navigation.navigate("ResponderDemo");
        //默认锁定为竖屏
        Orientation.lockToPortrait();
    }
}
export default Index;