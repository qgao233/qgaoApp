import React from 'react';
import { View, Text, StatusBar, StyleSheet,TouchableOpacity, TouchableWithoutFeedback, PanResponder, Alert, Vibration } from 'react-native';
import { topicTrends, topicTrendsNum, screenWidth, screenHeight } from "../../../../../../utils/stylesKits";
import VideoPlayer from "../../../../../../utils/components/videoPlayer"
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Introduction from './introduction';
import Comment from './comment';
import {getVideoDetail} from '../outerConfig/config'
import { dateDiff,replaceSlash,splitVideoUrl,splitVideoTags } from '../../../../../../utils/funcKits';

function TabBar(props) {
    const { goToPage, tabs, activeTab } = props;

    return (
        <View style={{ backgroundColor:"#fff",flexDirection: "row", height: 40, justifyContent: "space-evenly",borderBottomWidth:0.25,borderBottomColor:"#ccc" }}>
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
                            borderBottomColor: topicTrends[topicTrendsNum].color.color_num,
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
            statusBarPadding: { paddingTop: 30 },
            isStatusBarShow: true,
        }
        // this.getVideoResource();
    }

    onEnterFullScreen = () => {
        this.setState({
            statusBarPadding: { paddingTop: 0 },
            isStatusBarShow: false
        })
    }
    onExitFullScreen = () => {
        this.setState({
            statusBarPadding: { paddingTop: 30 },
            isStatusBarShow: true
        })
    }

    

    componentDidMount(){
        // this.getVideoResource();
    }

    changeEpisode = ({videoSource,currEpisode,videoPoster})=>{
        this.setState({
            videoSource,currEpisode,videoPoster
        })
    }

    render() {

        const {videoSource,videoPoster} = this.state;

        return (
            <View style={{ flex: 1, ...this.state.statusBarPadding }}>
                <StatusBar backgroundColor="#000" barStyle="light-content" translucent={true} hidden={!this.state.isStatusBarShow} />
                <VideoPlayer videoSource={videoSource} videoPoster={videoPoster} onEnterFullScreen={() => { this.onEnterFullScreen() }} onExitFullScreen={() => { this.onExitFullScreen() }}></VideoPlayer>
                {/* tab标签栏,外层一定是弹性容器（flex:1)才会显示 */}
                <ScrollableTabView
                    initialPage={0}
                    onChangeTab={obj => {
                        this.setState({ currIndex: obj.i })
                    }}
                    renderTabBar={() => < TabBar />}
                >
                    <Introduction tabLabel='简介' changeEpisode={(obj)=>{this.changeEpisode(obj)}}
                     {...this.props} {...this.state} />
                    <Comment tabLabel='评论'></Comment>
                </ScrollableTabView>

            </View>
        );
    }

}
export default Index;