import React from 'react';
import {
    View,
    Text, FlatList, Image, TouchableOpacity,
    TouchableHighlight, StyleSheet, ActivityIndicator,
    RefreshControl, Modal,
} from 'react-native';
import { dateDiff } from '../../../../../../utils/funcKits';
import { topicTrends, topicTrendsNum, articleType, screenHeight } from '../../../../../../utils/stylesKits';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import Popover, { Rect } from 'react-native-popover-view';
import ImageViewer from 'react-native-image-zoom-viewer';
import { SwipeListView } from 'react-native-swipe-list-view';
import { createSelector } from '@reduxjs/toolkit';
import { connect } from 'react-redux';

const spinnerTextArray = ["关注", "私聊", "拉黑", "举报"];


class Index extends React.Component {

    constructor() {
        super();
        this.downArrowRef = {};

        this.contentOffsetY = 0;
        this.velocityY = 0;

        this.state = {
            isFirstLoad: true, //是否是第1次加载
            isRefresh: false,  //是否刷新列表
            page: 1,           //数据分页展示的第1页
            totalDataSize: 30, //数据总共有30条
            hasMorePage: true, //通过比较已经加载的数据条数和总的数据条数来判断是否还有更多数据
            loadingMore: false,//通过该字段来重新渲染新的加载数据
            sizePerPage: 18,    //每一页7条数据
            data: [],           //已经加载的数据

            showAlbum: false
        };
    }

    // 点击相册图片放大
    handleShowAlbum = (index, i) => {
        const imgUrls = this.state.data[index].imgPaths.map((v) => {
            // return ({url:v,props:{}})
            return { url: "", props: { source: v } }
        });
        this.setState({ imgUrls, albumIndex: i, showAlbum: true });
    }

    //开关下拉列表
    toggleSpinner = (index) => {
        this.downArrowRef[index].measure((ox, oy, width, height, px, py) => {
            this.setState({
                index: index,
                rect: new Rect(px, py - height * 3 / 2, width, height),
                showPopover: this.state.showPopover ? false : true
            });
        });

    }

    //2个问题：1、无法获得遍历后每个元素的measure（解决）
    //2、无法打开下拉列表（源代码还有问题）(解决)

    //item就是data传进去的，index就是list中每个元素的key属性,rowMap存着每行的ref
    _renderItem = ({ item, index }) => {
        const { topicTrends, topicTrendsNum } = this.props;

        return (
            <TouchableOpacity key={index} activeOpacity={0.7}
                onPress={() => { }}
            >
                <View style={{
                    paddingTop: 10, paddingBottom: 10, backgroundColor: "#fff",
                    flexDirection: "row",
                }}>
                    {/**第1列 头像*/}
                    <View style={{ flex: 1.5, alignItems: "center" }}>
                        <TouchableOpacity onPress={() => { }} style={{ flexDirection: "row", alignItems: "center" }}>
                            <Image style={{ ...styles.profilePhoto }} source={item.photoPath} />
                        </TouchableOpacity>
                    </View>
                    {/* 第2列 */}
                    <View style={{ flex: 8.5 }}>
                        {/* 2.1层 用户信息 */}
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <View style={{}}>
                                <Text style={{ fontSize: 15, color: "#5a5a5a" }}>
                                    {item.nickName}
                                </Text>
                                <Text style={{ fontSize: 12, color: "#0004" }}>
                                    {dateDiff(item.publishTime)}
                                </Text>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "flex-start" }}>
                                <TouchableOpacity style={{ marginRight: 10 }}>
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <FontAwesomeIcon name="thumbs-o-up" size={12} color="#0007" />
                                        <Text style={{ fontSize: 15, color: "#0007", paddingLeft: 6, paddingRight: 6 }}>
                                            {item.good}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <FontAwesomeIcon name="thumbs-o-down" size={12} color="#0007" />
                                        <Text style={{ fontSize: 15, color: "#0007", paddingLeft: 6, paddingRight: 6 }}>
                                            {item.bad}
                                        </Text>
                                    </View>
                                </TouchableOpacity>

                            </View>
                        </View>
                        {/* 2.2层 回复内容 */}
                        <View style={{ paddingTop: 10, paddingBottom: 10, marginRight: 10 }}>
                            <Text >{item.content}</Text>
                        </View>
                        {/* 2.3层 回复的谁的内容 */}
                        <View style={{
                            borderLeftWidth: 2, borderLeftColor: topicTrends[topicTrendsNum].style_desc.gradient_start,
                            backgroundColor: "#eee5", padding: 10
                        }}>
                            <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                                <Text>回复</Text>
                                <Text style={{ paddingLeft: 5, color: topicTrends[topicTrendsNum].style_desc.gradient_start, }}>{item.nickName}</Text>
                                <Text style={{ paddingLeft: 5, }}>：</Text>
                            </View>
                            <View style={{ marginTop: 10 }}>
                                <Text>{item.content}</Text>
                            </View>
                        </View>
                    </View>

                </View>
            </TouchableOpacity>
        );
    }

    _onRefresh = () => {
        this.setState({
            isRefresh: true,
            page: 1
        }, () => {
            this.getShowData(1, 'refresh')
        })
    }

    _onLoadMore = () => {
        if ((this.state.page - 1) * this.state.sizePerPage < this.state.totalDataSize && !this.state.loadingMore) {
            this.setState({
                loadingMore: true,
                hasMorePage: true
            }, () => {
                this.getShowData(this.state.page);
            })
        } else if ((this.state.page - 1) * this.state.sizePerPage >= this.state.totalDataSize && !this.state.loadingMore) {
            this.setState({
                hasMorePage: false
            })
        }
    }

    getShowData = (page, type) => {
        const { sizePerPage, totalDataSize } = this.state;
        new Promise((resolve, reject) => {
            let array = [];
            for (let i = (page - 1) * sizePerPage, j = 0; i < totalDataSize && j < sizePerPage; i++, j++) {
                let type = i % 4 == 0 ? "原" : i % 4 == 1 ? "转" : i % 4 == 2 ? "翻" : "志";
                let obj = {
                    key: i,
                    photoPath: require("../../../../../../res/img/photo.jpg"),
                    nickName: "qgao",
                    publishTime: 1630584687000,//时间戳形式,ms
                    title: "论如何渲染flatlist",
                    type: type,
                    content: "先查阅相关组件的资料，然后查看属性的介绍，根据自己想要实现的功能，来实现自己的列表渲染",
                    imgPaths: [
                        require("../../../../../../res/img/snow.jpg"),
                        require("../../../../../../res/img/photo.jpg")
                        // "http://img.netbian.com/file/2021/0527/small2998966e25f9370d55e4672ade1013dc1622123475.jpg",
                        // "http://img.netbian.com/file/2021/0605/smalld9fcb449fa428b1cc001b40527b990761622906649.jpg"
                    ],
                    tags: [
                        "react-native",
                        "es6"
                    ],
                    good: 6,
                    bad: 2,
                    store: 8,
                    comment: 10,
                    reward: 10,

                };
                array.push(obj);
            }
            setTimeout(() => {
                resolve(array);
                // resolve([]);
            }, 500);

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
                this.setState({
                    data: [...this.state.data, ...data],
                    isRefresh: false,
                    isFirstLoad: false,
                    loadingMore: false,
                })
            }

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


    renderFlatList = () => {
        const { isRefresh } = this.state;
        const { topicTrends, topicTrendsNum } = this.props;

        return (
            <>
                <FlatList
                    data={this.state.data}
                    renderItem={this._renderItem}
                    style={{ backgroundColor: "#eee" }}

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
                <Modal visible={this.state.showAlbum} onRequestClose={() => this.setState({ showAlbum: false })} transparent={true}>
                    <ImageViewer
                        enableSwipeDown={true}
                        swipeDownThreshold={0.5}
                        onSwipeDown={() => this.setState({ showAlbum: false })}
                        imageUrls={this.state.imgUrls}
                        index={this.state.albumIndex}
                        loadingRender={this.renderInitLoadIndicator}
                        menuContext={{ saveToLocal: '保存到本地', cancel: '取消' }}
                        onSave={() => alert("点击了保存图片")}
                    />
                </Modal>
            </>


        );
    }

    renderInitLoadIndicator= ()=> {
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
        this.getShowData(1);
    }

    render() {
        const { isFirstLoad } = this.state;
        if (isFirstLoad) {
            return this.renderInitLoadIndicator();
        } else {
            return this.renderFlatList();
        }
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
        marginTop: screenHeight / 3
    },
    profilePhoto: {
        width: 50,
        height: 50,
        borderRadius: 25
    },
    img: {
        width: 80,
        height: 80,
        resizeMode: 'contain',
        borderRadius: 5
    }
})