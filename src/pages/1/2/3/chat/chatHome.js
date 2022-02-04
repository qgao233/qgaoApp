import React from 'react';
import {
    View,
    Text, FlatList, Image, TouchableOpacity,
    TouchableHighlight, StyleSheet, ActivityIndicator,
    RefreshControl, Modal, StatusBar
} from 'react-native';
import { dateDiff } from '../../../../../utils/funcKits';
import { topicTrends, topicTrendsNum, articleType, screenHeight, screenWidth, statusBarHeight } from '../../../../../utils/stylesKits';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import Popover, { Rect } from 'react-native-popover-view';
import ImageViewer from 'react-native-image-zoom-viewer';
import { SwipeListView } from 'react-native-swipe-list-view';
import InputBox from '../../../../../utils/components/inputBox';
import { createSelector } from '@reduxjs/toolkit';
import { connect } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast, { DURATION } from 'react-native-easy-toast'


const spinnerTextArray = ["搜索用户"];


class Index extends React.Component {

    constructor() {
        super();
        this.plusRef = {};

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


    //开关下拉列表
    toggleSpinner = () => {
        this.plusRef.measure((ox, oy, width, height, px, py) => {
            this.setState({
                rect: new Rect(px, py - height, width, height),
                showPopover: this.state.showPopover ? false : true
            });
        });

    }

    _renderItem = ({ item, index }, rowMap) => {
        // return (<></>);
        return (
            <View activeOpacity={1} key={index} style={{
                // borderTopLeftRadius: 50, borderBottomLeftRadius: 50,
                // borderTopRightRadius: 10, borderBottomRightRadius: 10,
                flexDirection: "row", alignItems: "center",
                padding: 5, paddingTop: 10, paddingBottom: 10,
                // marginLeft: 5, marginRight: 5, 
                backgroundColor: "#fff", height: 65
            }}>
                {/**第1列 头像*/}
                <View style={{ position: "relative", flex: 2, alignItems: "center" }}>
                    <TouchableOpacity activeOpacity={0.6} onPress={() => { this.props.navigation.navigate("MyCreation") }} style={{ flexDirection: "row", alignItems: "center" }}>
                        <Image style={{ ...styles.profilePhoto }} source={item.photoPath} />
                    </TouchableOpacity>
                    {/* <View style={{
                        paddingLeft: 5, paddingRight: 5, borderRadius: 10, backgroundColor: "#FF496C",
                        position: "absolute", top: 0, left: 5,
                        alignItems: "center", justifyContent: "center"
                    }} >
                        <Text style={{ color: "#fff", fontWeight: "bold" }}>9</Text>
                    </View> */}
                </View>
                {/* 第2列 */}
                <TouchableOpacity onPress={() => {
                    this.props.navigation.navigate("ChatScreen");
                }} activeOpacity={0.7} style={{ flex: 8 }}>
                    {/* 2.1层 用户信息 */}
                    <View style={{ marginRight: 15, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <View style={{}}>
                            <Text style={{ fontSize: 18, color: "#5a5a5a" }}>
                                {item.nickName}
                            </Text>
                        </View>
                        <View style={{}}>
                            <Text style={{ fontSize: 12, color: "#0007" }}>
                                {dateDiff(item.publishTime)}
                            </Text>
                        </View>
                    </View>
                    {/* 2.2层 评论内容 */}
                    <View style={{ marginRight: 15, }}>
                        <Text numberOfLines={1} style={{ color: "#0007", fontSize: 14, }}>2333333333333333333333333333333333333333333</Text>
                    </View>
                </TouchableOpacity>

            </View>
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
                    photoPath: require("../../../../../res/img/photo.jpg"),
                    nickName: "qgao",
                    publishTime: 1630584687000,//时间戳形式,ms
                    title: "论如何渲染flatlist",
                    type: type,
                    content: "先查阅相关组件的资料，然后查看属性的介绍，根据自己想要实现的功能，来实现自己的列表渲染",
                    imgPaths: [
                        require("../../../../../res/img/snow.jpg"),
                        require("../../../../../res/img/photo.jpg")
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

    _renderHiddenItem = (data, rowMap) => {
        const { topicTrends, topicTrendsNum } = this.props;

        return <View style={{
            // flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-end',
            height: 65,
            // borderTopRightRadius: 10, borderBottomRightRadius: 10,
        }}>
            <TouchableOpacity
                activeOpacity={0.8}
                style={{
                    backgroundColor: topicTrends[topicTrendsNum].style_desc.gradient_start,
                    width: 80,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <Text style={{ color: '#fff' }}>发消息</Text>
            </TouchableOpacity>
            <TouchableOpacity
                activeOpacity={0.8}
                style={{
                    backgroundColor: '#FF496C',
                    width: 80,
                    justifyContent: 'center',
                    alignItems: 'center',
                    // borderTopRightRadius: 10, borderBottomRightRadius: 10,

                }}>
                <Text style={{ color: '#fff' }}>移除</Text>
            </TouchableOpacity>
        </View>
    }

    _renderHeader = () => {
        const { topicTrends, topicTrendsNum } = this.props;

        return (
            <View style={{ backgroundColor: "#fff", alignItems: "center", padding: 10 }}>
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
                />
            </View>
        );
    }

    renderFlatList = () => {
        const { isRefresh } = this.state;
        const { topicTrends, topicTrendsNum } = this.props;

        return (
            <>
                <SwipeListView
                    data={this.state.data}
                    renderItem={this._renderItem}
                    style={{ backgroundColor: "#eee" }}

                    renderHiddenItem={this._renderHiddenItem}
                    closeOnRowOpen={true}
                    rightOpenValue={-160}
                    disableRightSwipe
                    directionalDistanceChangeThreshold={1}

                    ListHeaderComponent={this._renderHeader}

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
        this.getShowData(1);
    }

    render() {
        const { isFirstLoad } = this.state;
        return (
            <SafeAreaView>
                <StatusBar backgroundColor="#fff" barStyle="dark-content" translucent={true} hidden={false} />
                <View style={{ height: statusBarHeight, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <TouchableOpacity ref={ref => { this.plusRef = ref; }}
                        onPress={() => { this.toggleSpinner() }}
                        style={{ marginLeft: 10 }}>
                        <Feather name={this.state.showPopover ? "x" : "plus"} color="#aaa5" size={30} />
                    </TouchableOpacity>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Text>(๑•̀ㅂ•́)و✧</Text>
                        <Text>(99+)</Text>
                    </View>
                    <TouchableOpacity style={{ marginRight: 10 }} onPress={() => {
                        this.props.navigation.navigate("MoreChatRooms")
                    }}>
                        <Feather name="compass" color="#aaa5" size={25} />
                    </TouchableOpacity>
                </View>
                <Popover from={this.state.rect}
                    isVisible={this.state.showPopover}
                    onRequestClose={() => this.setState({ showPopover: false })}
                    backgroundStyle={{ backgroundColor: "#000", opacity: 0.1 }}
                    animationConfig={{ duration: 200 }}
                    popoverStyle={{ borderRadius: 5 }}
                >
                    {spinnerTextArray.map((v, i) => {
                        return <TouchableOpacity
                            activeOpacity={0.3}
                            key={i} onPress={() => { alert(v) }}
                            style={{ width: 120 }}
                            underlayColor='#ddd'>
                            <Text style={{ fontSize: 18, padding: 5, paddingLeft: 10, paddingRight: 10, color: '#5c5c5c' }}>
                                {v}
                            </Text>
                        </TouchableOpacity>
                    })
                    }
                </Popover>
                {
                    isFirstLoad
                        ? this.renderInitLoadIndicator()
                        : this.renderFlatList()
                }
                <Toast ref={ref => { this.toastRef = ref }} style={{ backgroundColor: "#fff", borderRadius: 10, borderWidth: 0.5, borderColor: "#eee6" }} textStyle={{ color: "#000" }} />

            </SafeAreaView>
        );
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