import React from 'react';
import {
    View, Text, StatusBar, StyleSheet, Image,
    TouchableOpacity, TouchableWithoutFeedback, TouchableHighlight,
    PanResponder, Alert, Vibration, Animated, Easing
} from 'react-native';
import { screenWidth, screenHeight, statusBarHeight } from "../../../../../../../utils/stylesKits";
import { dateDiff } from '../../../../../../../utils/funcKits'
import VideoPlayer from "../../../../../../../utils/components/videoPlayer"
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Introduction from './introduction';
import Comment from './comment';
import { createSelector } from '@reduxjs/toolkit';
import { connect } from 'react-redux';
import Popover, { Rect } from 'react-native-popover-view';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { Card } from 'react-native-shadow-cards';
import { transformHtml } from './htmlSource';
import { SafeAreaView } from 'react-native-safe-area-context';

const spinnerTextArray = ["关注", "私聊", "拉黑", "举报"];


function TabBar(props) {
    const { goToPage, tabs, activeTab } = props;
    const { topicTrends, topicTrendsNum } = props;

    return (
        <View style={{
            backgroundColor: "#fff", flexDirection: "row", height: 40, justifyContent: "space-evenly",
            // borderBottomWidth: 0.25, borderBottomColor: "#ccc"
        }}>
            {tabs.map((v, i) =>
                <TouchableOpacity
                    key={i}
                    onPress={() => {
                        goToPage(i)
                    }}
                    style={{
                        justifyContent: "center",
                        paddingLeft: 10,
                        paddingRight: 10,
                        borderBottomColor: topicTrends[topicTrendsNum].style_desc.gradient_start,
                        borderBottomWidth: activeTab === i ? 2 : 0
                    }}
                ><Text style={{ color: activeTab === i ? "#000" : "#ccc", fontSize: activeTab === i ? 18 : 15 }} >{v}</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

class Index extends React.Component {


    constructor() {
        super();

        this.downArrowRef = {};

        this.state = {
            translateY: new Animated.Value(1),//0,
            scale: new Animated.Value(1),//1,
            height: new Animated.Value(1),//40
            opacity: new Animated.Value(1),//1

            photoPath: require("../../../../../../../res/img/photo.jpg"),
            nickName: "qgao",
            publishTime: 1630584687000,//时间戳形式,ms

            showPopover: false,
            articleDetailData: {},
            isShowArticleLoading: true,
        }
    }

    toggleAuthorFrame = (bool) => {
        const config = bool
            ? {
                toValue: 1,
                duration: 250,
                easing: Easing.linear,
                useNativeDriver: false,//消除警告，但这里不能设置为true
            }
            : {
                toValue: 0,
                duration: 250,
                easing: Easing.linear,
                useNativeDriver: false,//消除警告，但这里不能设置为true
            };
        Animated.parallel([
            Animated.timing(this.state.translateY, { ...config, }),
            Animated.timing(this.state.scale, { ...config, }),
            Animated.timing(this.state.height, { ...config, }),
            Animated.timing(this.state.opacity, { ...config, }),
        ]).start();
    }

    //开关下拉列表
    toggleSpinner = () => {
        this.downArrowRef.measure((ox, oy, width, height, px, py) => {
            this.setState({
                rect: new Rect(px, py - height * 3 / 2, width, height),
                showPopover: !this.state.showPopover
            });
        });

    }

    renderHeader = () => {

        const { topicTrends, topicTrendsNum } = this.props;

        const {articleDetailData} = this.state;

        return (
            <Card
                cornerRadius={0} elevation={2} opacity={0}
                style={{
                    width: "auto", borderRadius: 10,
                    marginLeft: 10, marginRight: 10
                }}>
                <View style={{
                    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
                    padding: 10, borderRadius: 10,
                }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <TouchableOpacity onPress={() => { }} style={{ flexDirection: "row", alignItems: "center" }}>
                            <Image style={{ ...styles.profilePhoto }} source={articleDetailData.photoPath} />
                            <View style={{ paddingLeft: 10 }}>
                                <Text style={{ fontSize: 15, color: "#5a5a5a" }}>
                                    {articleDetailData.nickName}
                                </Text>
                                <Text style={{ fontSize: 12, color: "#0004" }}>
                                    {dateDiff(articleDetailData.publishTime)}
                                </Text>
                            </View>
                        </TouchableOpacity>

                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "center" }}>
                        <TouchableOpacity style={{ marginRight: 10, padding: 5, paddingLeft: 10, paddingRight: 10, }}>
                            <Text style={{ color: topicTrends[topicTrendsNum].style_desc.gradient_start }}>关注</Text>
                        </TouchableOpacity>
                        <TouchableOpacity ref={(ref) => {
                            this.downArrowRef = ref;
                        }} onPress={() => { this.toggleSpinner() }} style={{ padding: 5, paddingLeft: 10, paddingRight: 10, }}>
                            {
                                !this.state.showPopover
                                    ? <FontAwesomeIcon name="ellipsis-h" size={15} color="#ddd" />
                                    : <FontAwesomeIcon name="chevron-down" size={12} color="#ddd" />
                            }
                        </TouchableOpacity>

                    </View>
                </View>
            </Card>
        )

    }
    getArticleDetailData = () => {
        new Promise((resolve, reject) => {
            const obj = {
                photoPath: {uri:"https://img2.doubanio.com/icon/u220681750-1.jpg"},
                nickName: "精神文明創世神",
                publishTime: 1637916041000,//时间戳形式,ms
                title: "波粒二象性——相信即存在",
                type: "转",
                content: {html:transformHtml()},
                tags: [
                    "修仙",
                    "物理",
                    "科学",
                    "音乐",
                    "思想"
                ],
                good: 6,
                bad: 2,
                store: 8,
                comment: 10,
                reward: 10,
            }
            setTimeout(() => {
                resolve(obj);
            }, 1000);
        }).then(result => {
            this.setState({ articleDetailData: result, isShowArticleLoading: false });
        })
    }

    componentDidMount(){
        this.getArticleDetailData();
    }

    render() {
        let { translateY, scale, height, opacity } = this.state;
        translateY = translateY.interpolate({
            inputRange: [0, 1],
            outputRange: [-10, 0]
        })
        scale = scale.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1]
        })
        height = height.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 60 + 5]
        })
        // opacity = opacity.interpolate({
        //     inputRange: [0, 1],
        //     outputRange: [0.5, 1]
        // })

        return (
            <SafeAreaView 
            style={{ flex:1,backgroundColor:"#fff"}}>
                <StatusBar backgroundColor="#fff" barStyle="dark-content" translucent={true} hidden={false} />
                {/* 搜索框 */}
                <Animated.View
                    style={{
                        transform: [{ translateY: translateY }, { scale: scale }],
                        height: height,
                        // opacity: opacity,
                        backgroundColor:"#fff",
                        paddingTop:5,
                    }}
                >
                    {this.renderHeader()}
                </Animated.View>
                {/* tab标签栏,外层一定是弹性容器（flex:1)才会显示 */}
                <ScrollableTabView
                    initialPage={0}
                    onChangeTab={obj => {
                        this.setState({ currIndex: obj.i })
                        this.toggleAuthorFrame(true)
                    }}
                    renderTabBar={() => < TabBar {...this.props} />}
                >
                    <Introduction tabLabel='正文'
                        articleDetailData={this.state.articleDetailData}
                        isShowArticleLoading={this.state.isShowArticleLoading}
                        navigation={this.props.navigation}
                        toggleAuthorFrame={(bool) => this.toggleAuthorFrame(bool)} />
                    <Comment tabLabel='评论'
                        toggleAuthorFrame={(bool) => this.toggleAuthorFrame(bool)} />
                </ScrollableTabView>
                <Popover from={this.state.rect}
                    isVisible={this.state.showPopover}
                    onRequestClose={() => this.setState({ showPopover: false })}
                    backgroundStyle={{ backgroundColor: "#000", opacity: 0.1 }}
                    animationConfig={{ duration: 200 }}
                    popoverStyle={{ borderRadius: 5 }}
                >
                    {spinnerTextArray.map((v, i) => {
                        return <TouchableHighlight key={i} onPress={() => { alert(v, ",index:", this.state.index) }}
                            underlayColor='#ddd'>
                            <Text style={{ padding: 5, paddingLeft: 10, paddingRight: 10, color: '#5c5c5c' }}>
                                {v}
                            </Text>
                        </TouchableHighlight>
                    })
                    }
                </Popover>
            </SafeAreaView>
        );
    }

}//使用reselect机制，防止不避要的re-render
const getTopicTrends = createSelector(
    [state => state.topicTrends],
    topicTrends => topicTrends
)
const getTopicTrendsNum = createSelector(
    [state => state.topicTrendsNum],
    topicTrendsNum => topicTrendsNum.value
)
const mapStateToProps = (state) => {
    return {
        topicTrends: getTopicTrends(state),
        topicTrendsNum: getTopicTrendsNum(state),
    }
}


export default connect(mapStateToProps, null)(Index);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",//// 解决二级导航的bug加上marginTop:screenHeight/3

    },
    profilePhoto: {
        width: 30,
        height: 30,
        borderRadius: 15
    },
    img: {
        width: 80,
        height: 80,
        resizeMode: 'contain',
        borderRadius: 5
    }
})

