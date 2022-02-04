import React from 'react';
import { View, Text, StatusBar, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, PanResponder, Alert, Vibration } from 'react-native';
import { topicTrends, topicTrendsNum, screenWidth, screenHeight } from "../../../../../../../utils/stylesKits";
import VideoPlayer from "../../../../../../../utils/components/videoPlayer"
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Introduction from './introduction';
import Comment from './comment';
import { createSelector } from '@reduxjs/toolkit';
import { connect } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';



function TabBar(props) {
    const { goToPage, tabs, activeTab } = props;
    const { topicTrends, topicTrendsNum } = props;

    return (
        <View style={{ backgroundColor: "#fff", flexDirection: "row", height: 40, justifyContent: "space-evenly", borderBottomWidth: 0.25, borderBottomColor: "#ccc" }}>
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

        this.state = {
            isStatusBarShow: true,

            edges:['left', 'right','top','bottom']

        }
    }

    onEnterFullScreen = () => {
        this.setState({
            isStatusBarShow: false,
            edges:['left', 'right',]
        })
    }
    onExitFullScreen = () => {
        this.setState({
            isStatusBarShow: true,
            edges:['left', 'right','top','bottom']
        })
    }

    render() {

        return (
            <SafeAreaView
                edges={this.state.edges}
                style={{ flex: 1, }}>
                <StatusBar backgroundColor="#000" barStyle="light-content" translucent={true} hidden={!this.state.isStatusBarShow} />
                <VideoPlayer onEnterFullScreen={() => { this.onEnterFullScreen() }} onExitFullScreen={() => { this.onExitFullScreen() }}></VideoPlayer>
                {/* tab标签栏,外层一定是弹性容器（flex:1)才会显示 */}
                <ScrollableTabView
                    initialPage={0}
                    onChangeTab={obj => {
                        this.setState({ currIndex: obj.i })
                    }}
                    renderTabBar={() => < TabBar {...this.props} />}
                >
                    <Introduction tabLabel='简介' navigation={this.props.navigation} />
                    <Comment tabLabel='评论'></Comment>
                </ScrollableTabView>

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