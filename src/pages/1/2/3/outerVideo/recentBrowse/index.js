import React from 'react';
import {
    View,
    Text, FlatList, Image, TouchableOpacity,
    TouchableHighlight, StyleSheet, ActivityIndicator,
    RefreshControl, StatusBar
} from 'react-native';
import { dateDiff, replaceSlash, splitVideoUrl, splitVideoTags,videoTimeFormat } from '../../../../../../utils/funcKits';
import { articleType, screenHeight, screenWidth, statusBarHeight } from '../../../../../../utils/stylesKits';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import Popover, { Rect } from 'react-native-popover-view';
import ImageViewer from 'react-native-image-zoom-viewer';
import { SwipeListView } from 'react-native-swipe-list-view';
import InputBox from '../../../../../../utils/components/inputBox';
import { createSelector } from '@reduxjs/toolkit';
import { connect } from 'react-redux';
import { getUniqueId } from 'react-native-device-info';
import { getVideoDetail } from '../outerConfig/config';
import { Card } from 'react-native-shadow-cards';
import FullPageHeader from '../../../../../../utils/components/fullPageHeader';
import Modal from 'react-native-modal'
import Toast, { DURATION } from 'react-native-easy-toast'

import { deleteOuterRecentBrowseAsync } from '../recentBrowse/outerRecentBrowseSlice'

const spinnerTextArray = ["关注", "私聊", "拉黑", "举报"];


class Index extends React.Component {

    constructor() {
        super();
        this.downArrowRef = {};

        this.contentOffsetY = 0;
        this.velocityY = 0;

        this.preData = [];
        this.totalDataSize = 0;

        this.state = {
            isFirstLoad: true, //是否是第1次加载
            isRefresh: false,  //是否刷新列表
            page: 1,           //数据分页展示的第1页
            hasMorePage: true, //通过比较已经加载的数据条数和总的数据条数来判断是否还有更多数据
            loadingMore: false,//通过该字段来重新渲染新的加载数据
            sizePerPage: 10,    //每一页几条数据
            data: [],           //已经加载的数据

            filterText: "",
            clearModalShow: false,
        };
    }


    _renderItem = ({ item, index }, rowMap) => {
        // return (<></>);
        return (
            <Card key={index}
                cornerRadius={0} elevation={5} opacity={0.2}
                style={{
                    width: "auto",
                    height: 160,
                    marginTop: 10, marginLeft: 10, marginRight: 10, borderRadius: 10, backgroundColor: "#fff"
                }}>
                <TouchableOpacity
                    onPress={() => {
                        this.props.navigation.navigate("OuterVideoDetail", {
                            videoId: item.videoId,
                            currEpisode: item.visitedEpisodeId,
                            from: "recentBrowse",
                            videoProgress: item.visitedProgress,
                        })
                    }}
                    activeOpacity={0.7}
                    style={{
                        flexDirection: "row", alignItems: "center",
                        padding: 5, paddingTop: 10, paddingBottom: 10,
                        backgroundColor: "#fff",
                        borderRadius: 10,
                        // height: 65
                    }}>
                    {/**第1列 视频poster*/}
                    <View style={{ flex: 3, alignItems: "center" }}>
                        <Image source={{ uri: item.videoPoster }} style={{
                            width: 100, height: 140, resizeMode: "stretch",
                            borderRadius: 20,
                        }} />
                    </View>
                    {/* 第2列 视频信息*/}
                    <View style={{ flex: 7, }}>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                            <View><Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.videoTitle}</Text></View>
                            <View style={{ alignItems: "center" }}>
                                <LinearGradient
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    colors={
                                        [articleType.transfer.gradient_start,
                                        articleType.transfer.gradient_end]
                                    }
                                    style={{
                                        alignItems: "center", justifyContent: "center", borderRadius: 10,
                                        paddingLeft: 5, paddingRight: 5, paddingTop: 2, paddingBottom: 2,
                                    }}
                                >
                                    <Text style={{ color: "#fff", fontSize: 10 }}>互联网</Text>
                                </LinearGradient>
                            </View>
                        </View>
                        <View>
                            <Text style={{ fontSize: 14, color: "#5c5c5c", flexWrap: "wrap" }}>
                                {item.visitedTime} 观看到{item.visitedEpisodeName} ({videoTimeFormat(item.visitedProgress)})
                            </Text>
                        </View>
                        <View>
                            <Text style={{ fontSize: 10, color: "#878c92" }}>{item.videoTime} 更新到{item.latestEpisode}</Text>
                        </View>
                        <View>
                            <Text numberOfLines={3} style={{ fontSize: 10, color: "#878c92" }}>
                                {item.videoContent}
                            </Text>
                        </View>

                        <View style={{ flexDirection: "row", flexWrap: "wrap", overflow: "hidden", alignItems: "center" }}>
                            {
                                item.videoTags.length != 0
                                    ? item.videoTags.map((v, i) => {
                                        if (i == 0) {
                                            return <View key={i + "#" + Math.random() * new Date().getTime()} style={{ margin: 2, paddingLeft: 2, paddingRight: 2, paddingTop: 1, paddingBottom: 1, justifyContent: "center", backgroundColor: "#ffd5d3", borderRadius: 5 }}>
                                                <Text style={{ color: "#ec1a0a", fontSize: 10 }}>{v}</Text>
                                            </View>
                                        }

                                        else return <View key={i + "#" + Math.random() * new Date().getTime()} style={{ margin: 2, paddingLeft: 2, paddingRight: 2, paddingTop: 1, paddingBottom: 1, justifyContent: "center", backgroundColor: "#eee", borderRadius: 5 }}>
                                            <Text style={{ color: "#aaa", fontSize: 10 }}>{v}</Text>
                                        </View>
                                    })
                                    : <></>
                            }
                        </View>
                    </View>

                </TouchableOpacity>
            </Card>
        );
    }

    _onRefresh = () => {
        this.setState({
            isRefresh: true,
            page: 1
        }, () => {
            this.getRecentBrowseData();
            this.getShowData(1, 'refresh')
        })
    }

    _onLoadMore = () => {
        if ((this.state.page - 1) * this.state.sizePerPage < this.totalDataSize && !this.state.loadingMore) {
            this.setState({
                loadingMore: true,
                hasMorePage: true
            }, () => {
                this.getShowData(this.state.page);
            })
        } else if ((this.state.page - 1) * this.state.sizePerPage >= this.totalDataSize && !this.state.loadingMore) {
            this.setState({
                hasMorePage: false
            })
        }
    }

    getRecentBrowseData = () => {
        const { outerRecentBrowse } = this.props;
        if (getUniqueId() == outerRecentBrowse.uniqueId) {
            this.preData = outerRecentBrowse.browseList
            this.totalDataSize = this.preData.length;
        }
    }

    getShowData = (page, type) => {
        const { sizePerPage } = this.state;
        const totalDataSize = this.totalDataSize;
        let fetchArray = [];
        for (let i = (page - 1) * sizePerPage, j = 0; i < totalDataSize && j < sizePerPage; i++, j++) {
            let promiseItem = getVideoDetail({ ids: this.preData[i].visitedVideoId })
            fetchArray.push(promiseItem)
        }

        Promise.all([...fetchArray]).then((dataArray) => {
            let array = [];
            for (let i = (page - 1) * sizePerPage, j = 0; i < totalDataSize && j < sizePerPage; i++, j++) {
                if (this.state.filterText != "" && dataArray[j].list[0].vod_name.indexOf(this.state.filterText) == -1)
                    continue;
                let tmpStr = splitVideoUrl(replaceSlash(dataArray[j].list[0].vod_play_url));
                let obj = {
                    key: dataArray[j].list[0].vod_id + "" + this.preData[i].visitedEpisodeId,
                    videoId: dataArray[j].list[0].vod_id,
                    videoPoster: replaceSlash(dataArray[j].list[0].vod_pic),
                    latestEpisode: tmpStr[tmpStr.length - 1].split("$")[0],
                    videoTitle: dataArray[j].list[0].vod_name,
                    videoTime: dataArray[j].list[0].vod_time,
                    videoContent: dataArray[j].list[0].vod_content,
                    videoTags: splitVideoTags(dataArray[j].list[0].vod_tag),

                    visitedTime: dateDiff(this.preData[i].visitedTime),
                    visitedEpisodeId: this.preData[i].visitedEpisodeId,
                    visitedEpisodeName: this.preData[i].visitedEpisodeName,
                    visitedProgress: this.preData[i].visitedProgress,
                }
                array.push(obj);
            }
            return array;
        }).then((data) => {
            if (data.length > 0) {
                if (type === 'refresh') {
                    this.setState({
                        data: [...data],
                        page: this.state.page + 1,
                        isRefresh: false,
                        isFirstLoad: false,
                        loadingMore: false,
                    })
                } else {
                    this.setState({
                        data: [...this.state.data, ...data],
                        page: this.state.page + 1,
                        isRefresh: false,
                        isFirstLoad: false,
                        loadingMore: false,
                    })
                }
            } else {
                if (type === 'refresh') {
                    this.setState({
                        data: [...data],
                        isRefresh: false,
                        isFirstLoad: false,
                        loadingMore: false,
                    })
                } else {
                    this.setState({
                        data: [...this.state.data, ...data],
                        isRefresh: false,
                        isFirstLoad: false,
                        loadingMore: false,
                    })
                }
            }

        }).catch((error) => {
            console.log("fetchRecentBrowse", error)
        })

    }

    _renderFooter = () => {
        let { hasMorePage, page } = this.state;
        const { topicTrends, topicTrendsNum } = this.props;

        if (hasMorePage && page >= 2) {
            return (
                <View style={{ flexDirection: 'row', height: 30, alignItems: 'center', justifyContent: 'center', }}>
                    <ActivityIndicator animating={true}
                        color={topicTrends[topicTrendsNum].style_desc.gradient_start}
                    />
                    <Text style={{ color: '#999999', fontSize: 14, }}>
                        正在加载更多数据...
                    </Text>
                </View>
            )
        } else if (!hasMorePage) {
            return (
                <View style={{ height: 30, alignItems: 'center', justifyContent: 'flex-start', }}>
                    <Text style={{ color: '#999999', fontSize: 14, marginTop: 5, marginBottom: 5, }}>
                        没有更多数据了
                    </Text>
                </View>
            )
        } else {    //解决上拉刷新时出现的bug
            return <></>
        }
    }

    _renderEmptyer = () => {
        // 解决二级导航的bug加上backgroundColor:"#fff",
        return <View style={{ height: screenHeight * 1.5 / 2, alignItems: "center", justifyContent: "center" }}>
            <Text>空空如也!</Text>
        </View>
    }

    _renderHiddenItem = (data, rowMap) => {
        const { topicTrends, topicTrendsNum } = this.props;

        return <View style={{
            // flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-end',
            height: 160,
            margin: 10,
            borderRadius: 10,
            // borderTopRightRadius: 10, borderBottomRightRadius: 10,
        }}>
            {/* <TouchableOpacity
                activeOpacity={0.8}
                style={{
                    backgroundColor: topicTrends[topicTrendsNum].style_desc.gradient_start,
                    width: 80,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <Text style={{ color: '#fff' }}>发消息</Text>
            </TouchableOpacity> */}
            <TouchableOpacity
                onPress={() => {
                    this.props.dispatchDeleteOuterRecentBrowseAsync({
                        visitedVideoId: data.item.videoId,
                        visitedEpisodeId: data.item.visitedEpisodeId
                    })
                    this.state.data.forEach((v, i) => {
                        if (v.videoId == data.item.videoId && v.visitedEpisodeId == data.item.visitedEpisodeId) {
                            this.state.data.splice(i, 1);
                            this.setState({ data: this.state.data });
                        }
                    });
                }}
                activeOpacity={0.8}
                style={{
                    backgroundColor: '#FF496C',
                    width: 80,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderTopRightRadius: 10, borderBottomRightRadius: 10,

                }}>
                <Text style={{ color: '#fff' }}>删除记录</Text>
            </TouchableOpacity>
        </View>
    }


    renderFlatList = () => {
        const { isRefresh } = this.state;
        const { topicTrends, topicTrendsNum } = this.props;

        return (
            <>
                <View style={{ backgroundColor: "#fff", alignItems: "center" }}>
                    {/* 搜索框 */}
                    <InputBox
                        inputPlaceholder="筛选"
                        inputButtonText="go"
                        onPressSubmit={(inputTxt) => { }}
                        inputColorOpacity="22"
                        inputTopicColor={topicTrends[topicTrendsNum].style_desc.gradient_start}
                        inputWidth={screenWidth - 40}
                        inputHeight={40}
                        inputFontSize={15}
                        onChangeText={(inputText) => {
                            this.setState({ filterText: inputText });
                            this.getShowData(1, 'refresh')
                        }}
                    />
                </View>
                <SwipeListView
                    data={this.state.data}
                    renderItem={this._renderItem}
                    style={{ backgroundColor: "#fff" }}

                    renderHiddenItem={this._renderHiddenItem}
                    closeOnRowOpen={true}
                    rightOpenValue={-80}
                    disableRightSwipe
                    directionalDistanceChangeThreshold={1}

                    // ListHeaderComponent={this._renderHeader}

                    refreshControl={
                        <RefreshControl
                            refreshing={isRefresh}
                            onRefresh={this._onRefresh}//上拉刷新
                            colors={[topicTrends[topicTrendsNum].style_desc.gradient_start, "#ec1a0a", "#ffc051"]}
                            progressBackgroundColor="#fff"
                        />
                    }

                    onEndReached={() => this._onLoadMore()}//下拉加载
                    onEndReachedThreshold={0.3}
                    ListFooterComponent={this._renderFooter}
                    ListEmptyComponent={this._renderEmptyer}
                />
            </>


        );
    }

    renderInitLoadIndicator = () => {
        const { topicTrends, topicTrendsNum } = this.props;

        return (
            <View style={styles.container}>
                <ActivityIndicator animating={true}
                    color={topicTrends[topicTrendsNum].style_desc.gradient_start}
                    size="large" />
            </View>
        )
    }

    componentDidMount() {
        this.getRecentBrowseData();
        this.getShowData(1);
    }

    render() {
        const { isFirstLoad } = this.state;
        return (
            <View style={{ flex: 1, backgroundColor: "#fff" }}>
                <FullPageHeader gradientStartColor="#fff" gradientEndColor="#fff" color="#000b"
                    isShowStatusBarPad={true}
                    statusBarPadFontColorIndex={1}
                    middleName="最近观看"
                    rightComponent={(props) => {
                        return <TouchableOpacity
                            onPress={() => { this.setState({ clearModalShow: true }) }}
                            activeOpacity={0.8}>
                            <Text style={{ color: props.color, }}>清空</Text>
                        </TouchableOpacity>
                    }}
                />
                <Modal isVisible={this.state.clearModalShow} backdropColor="#0004"
                    onBackdropPress={() => { this.setState({ clearModalShow: false }) }}
                    style={{
                        width: screenWidth,
                        margin: 0,
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >

                    <View style={{
                        borderRadius: 10,
                        backgroundColor: "#fff",
                    }}>
                        <View style={{
                            padding: 20,
                            paddingLeft: 50, paddingRight: 50,
                            alignItems: "center"
                        }}>
                            <Text>确定清空观看记录?</Text>
                            <Text style={{ fontSize: 10, color: "#000b" }}>(可以保存5000条记录)</Text>
                        </View>
                        <View style={{
                            flexDirection: "row", justifyContent: "space-evenly", alignItems: "center",
                        }}>

                            <TouchableOpacity
                                onPress={() => {
                                    this.props.dispatchDeleteOuterRecentBrowseAsync({});
                                    this.setState({ clearModalShow: false })
                                    this.toastRef.show("清空成功!", 1000);
                                }}
                                activeOpacity={0.5}
                                style={{ alignItems: "center" }}>
                                <Text style={{
                                    fontSize: 15,
                                    paddingLeft: 35, paddingRight: 35,
                                    paddingTop: 10, paddingBottom: 10,
                                }}>当然</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({ clearModalShow: false })
                                }}
                                activeOpacity={0.5}
                                style={{ alignItems: "center" }}>
                                <Text style={{
                                    fontSize: 15,
                                    paddingLeft: 35, paddingRight: 35,
                                    paddingTop: 10, paddingBottom: 10,
                                }}>算了</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </Modal>
                {
                    isFirstLoad
                        ? this.renderInitLoadIndicator()
                        : this.renderFlatList()
                }
                <Toast ref={ref => { this.toastRef = ref }} style={{ backgroundColor: "#fff", borderRadius: 10, borderWidth: 0.5, borderColor: "#eee6" }} textStyle={{ color: "#000" }} />

            </View>
        );
        // if (isFirstLoad) {
        //     return this.renderInitLoadIndicator();
        // } else {
        //     return this.renderFlatList();
        // }
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
const getOuterRecentBrowse = createSelector(
    [state => state.outerRecentBrowse],
    outerRecentBrowse => outerRecentBrowse
)
const mapStateToProps = (state) => {
    return {
        topicTrends: getTopicTrends(state),
        topicTrendsNum: getTopicTrendsNum(state),
        outerRecentBrowse: getOuterRecentBrowse(state),
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        dispatchDeleteOuterRecentBrowseAsync: (args) => dispatch(deleteOuterRecentBrowseAsync(args))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Index);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",//// 解决二级导航的bug加上marginTop:screenHeight/3
        marginTop: screenHeight / 3
    },
    profilePhoto: {
        width: 40,
        height: 40,
        borderRadius: 20
    },
    img: {
        width: 80,
        height: 80,
        resizeMode: 'contain',
        borderRadius: 5
    }
})