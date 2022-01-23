import React from 'react';
import { View, Text, StatusBar, PanResponder, Animated, Easing, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import MainTabBar from './components/mainTabBar';
import Latest from './latest';
import Classfication from './classfication';
import Rank from './rank';
import Modalbox from 'react-native-modalbox';
import { screenWidth } from '../../../../../utils/stylesKits';
import { createSelector } from '@reduxjs/toolkit';
import { connect } from 'react-redux';
import { initOuterRecentBrowseAsync } from './recentBrowse/outerRecentBrowseSlice'
import Feather from 'react-native-vector-icons/Feather'
import SearchBox from '../../../../../utils/components/inputBox'

class Index extends React.Component {

    constructor() {
        super();

        this.state = {

            translateY: new Animated.Value(1),//0,
            scale: new Animated.Value(1),//1,
            height: new Animated.Value(1),//40
            opacity: new Animated.Value(1),//1

            showReplyModal: true,
        }
    }

    toggleSearchFrame = (bool) => {
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

    componentDidMount() {
        //初始化最近浏览
        this.props.dispatchInitOuterRecentBrowseAsync();
    }

    render() {

        let { translateY, scale, height, opacity } = this.state;
        translateY = translateY.interpolate({
            inputRange: [0, 1],
            outputRange: [-10, 0]
        })
        scale = scale.interpolate({
            inputRange: [0, 1],
            outputRange: [0.5, 1]
        })
        height = height.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 40]
        })
        opacity = opacity.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1]
        })

        const {topicTrends,topicTrendsNum} = this.props;

        return (
            <View style={{ flex: 1, paddingTop: 30,backgroundColor:"#fff" }}>
                <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent={true} hidden={false} />
                {/* 搜索框 */}
                <Animated.View
                    style={{
                        transform: [{ translateY: translateY }, { scale: scale }],
                        height: height,
                        opacity: opacity,
                    }}
                >
                    <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "center" }}>
                        <SearchBox
                            onPressSubmit={(inputTxt) => { this.props.navigation.navigate("OuterSearchResult", { keyWord: inputTxt }) }}
                            inputColorOpacity="22"
                            inputTopicColor={topicTrends[topicTrendsNum].style_desc.gradient_start}
                            inputWidth={320}
                            inputHeight={40}
                            // inputFontSize={20}
                            inputPlaceholder="搜索"
                            inputButtonText="搜索"
                        />
                        <TouchableOpacity activeOpacity={0.7}
                            onPress={()=>{this.props.navigation.navigate("OuterRecentBrowse")}}
                        >
                            <Feather name='clock' size={30} color='#ddd9' />
                        </TouchableOpacity>
                    </View>
                </Animated.View>
                {/* tab标签栏,外层一定是弹性容器（flex:1)才会显示 */}
                <ScrollableTabView
                    initialPage={0}
                    renderTabBar={() => < MainTabBar />}
                >
                    <Latest tabLabel='最新' showSearchFrame={this.toggleSearchFrame} navigation={this.props.navigation} />
                    <Classfication showSearchFrame={this.toggleSearchFrame} navigation={this.props.navigation} tabLabel='分类' />
                </ScrollableTabView>
                {/* reply模态框 */}
                <Modalbox
                    isOpen={this.state.showReplyModal}
                    onOpened={() => {
                        // setTimeout(() => {
                        //     this.setState({showReplyModal:false})
                        // }, 3000);
                    }}
                    onClosed={() => {
                    }}
                    position="center"
                    entry="top"
                    backButtonClose={true}
                    style={{ height: 400, width: 300, borderRadius: 20, overflow: "hidden" }}
                // style={{ position: "relative" }}

                >
                    <View style={{
                        paddingTop: 5, paddingBottom: 5, borderBottomWidth: 8, borderBottomColor: "#eeee",
                        flexDirection: "row", justifyContent: "center", alignItems: "center"
                    }}>
                        <Text style={{ paddingLeft: 5, paddingRight: 5, fontSize: 15 }}>免责声明</Text>
                    </View>
                    {/* 声明内容 */}
                    <View style={{ width: 300, paddingLeft: 5, paddingRight: 5 }}>
                        <Text style={{ paddingTop: 10, paddingBottom: 10, }}>你可以选择不使用该软件，但一旦使用了，那就表示你认可本声明的全部内容。</Text>
                        <Text style={{ paddingTop: 10, paddingBottom: 10, }}>该处所有视频均来自于互联网，只支持在线观看，不支持随意下载、转载、流转以及任何不法的商业使用行为，一经发现，平台将会严肃处理，如有任何侵犯到第三方权益的，可通过邮件方式反馈给我，我会及时进行处理。</Text>
                        <Text style={{ paddingTop: 10, paddingBottom: 10, color: "red" }}>注意：</Text>
                        <Text style={{ paddingTop: 10, paddingBottom: 10, }}>退出全屏时，请一定点击屏幕上的“缩小全屏”按钮，否则将会返回上一页，并同时保持横屏方向。</Text>
                    </View>
                    <TouchableOpacity activeOpacity={0.6}
                        onPress={() => {
                            this.setState({ showReplyModal: false })
                        }}
                        style={{ backgroundColor: "#ccc4", width: 300, padding: 20, marginTop: 15, justifyContent: "center", alignItems: "center" }}>
                        <View>
                            <Text style={{ color: "#5c5c5c" }}>确定</Text>
                        </View>
                    </TouchableOpacity>
                </Modalbox>
            </View>
        );
    }
}
//使用reselect机制，防止不避要的re-render
const getTopicTrends = createSelector(
    [state => state.topicTrends],
    topicTrends => topicTrends
)
const getTopicTrendsNum = createSelector(
    [state => state.topicTrendsNum],
    topicTrendsNum => topicTrendsNum.value
)
const mapStateToProps = (state, ownProps) => {
    return {
        topicTrends: getTopicTrends(state),
        topicTrendsNum: getTopicTrendsNum(state),
    }
}
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        dispatchInitOuterRecentBrowseAsync: () => dispatch(initOuterRecentBrowseAsync()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Index);