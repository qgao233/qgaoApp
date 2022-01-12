import React from 'react';
import {
    View,
    Text, FlatList, Image, TouchableOpacity,
    TouchableHighlight, StyleSheet, ActivityIndicator,
    RefreshControl, Modal,
    Animated, Easing,
    ScrollView
} from 'react-native';
import { dateDiff } from '../../../../../../../utils/funcKits';
import { topicTrends, topicTrendsNum, articleType, screenHeight, screenWidth } from '../../../../../../../utils/stylesKits';
import FontAwesomeIcon5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import Popover, { Rect, PopoverPlacement } from 'react-native-popover-view';
import Modalbox from 'react-native-modalbox';
import InputBox from '../../../../../../../utils/components/inputBox'

const spinnerTextArray = ["关注", "私聊", "拉黑", "举报"];
const spinnerSortArray = ["推荐", "最热", "最新"];

class Index extends React.Component {

    constructor() {
        super();
        this.downArrowRef = {};
        this.commentItemRef = [];

        this.videoInfo = {
            photoPath: require("../../../../../../../res/img/photo.jpg"),
            nickName: "qgao",
            publishTime: 1630584687000,//时间戳形式,ms
            content: "先查阅相关组件的资料，然后查看属性的介绍，根据自己想要实现的功能，来实现自己的列表渲染",
            good: 6,
            bad: 2,
            comment: 10,
        }

        this.state = {
            isFirstLoad: true, //是否是第1次加载

            //评论
            isRefresh: false,  //是否刷新列表
            page: 1,           //数据分页展示的第1页
            totalDataSize: 30, //数据总共有30条
            hasMorePage: true, //通过比较已经加载的数据条数和总的数据条数来判断是否还有更多数据
            loadingMore: false,//通过该字段来重新渲染新的加载数据
            sizePerPage: 7,    //每一页7条数据
            data: [],           //已经加载的数据

            showReplyModal: false,
            showCommentSortPopover: false,

            //回复
            isReplyRefresh: false,  //是否刷新列表
            replyPage: 1,           //数据分页展示的第1页
            totalReplyDataSize: 30, //数据总共有30条
            hasReplyMorePage: true, //通过比较已经加载的数据条数和总的数据条数来判断是否还有更多数据
            loadingReplyMore: false,//通过该字段来重新渲染新的加载数据
            replyData: [],           //已经加载的数据
        };

        this.showReplyModal = true;
    }

    //开关下拉列表
    toggleReplySpinner = (bool, index) => {
        this.setState({
            index: index,
            showReplyModal: bool
        });

    }
    toggleCommentSortSpinner = () => {
        this.commentSortRef.measure((ox, oy, width, height, px, py) => {
            this.setState({
                commentSortRect: new Rect(px, py - height * 3 / 2, width, height),
                showCommentSortPopover: !this.state.showCommentSortPopover
            });
        });

    }


    //2个问题：1、无法获得遍历后每个元素的measure（解决）
    //2、无法打开下拉列表（源代码还有问题）(解决)

    //item就是data传进去的，index就是list中每个元素的key属性
    _renderItem = ({ item, index }) => {

        // return (<></>);
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
                        {/* 2.2层 评论内容 */}
                        <View style={{ paddingTop: 10, paddingBottom: 10, marginRight: 10 }}>
                            <Text>content</Text>
                        </View>
                        {/* 2.3层 回复点击 */}
                        <View>
                            <TouchableOpacity activeOpacity={0.6}
                                onPress={() => { this.toggleReplySpinner(true, index) }}
                            >
                                <Text style={{ fontSize: 12, color: topicTrends[topicTrendsNum].color.color_num + "e6" }}>更多回复 {">"}</Text>
                            </TouchableOpacity>
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
                    photoPath: require("../../../../../../../res/img/photo.jpg"),
                    nickName: "qgao",
                    publishTime: 1630584687000,//时间戳形式,ms
                    title: i % 4 != 0 ? "论如何渲染flatlist" : "23333333333",
                    type: type,
                    posterPath: require("../../../../../../../res/img/snow.jpg"),
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
        if (hasMorePage && page >= 2) {
            return (
                <View style={{ flexDirection: 'row', height: 30, alignItems: 'center', justifyContent: 'center', }}>
                    <ActivityIndicator animating={true}
                        color={topicTrends[topicTrendsNum].color.color_num}
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

    renderInitLoadIndicator= ()=> {
        return (
            <View style={styles.container}>
                <ActivityIndicator animating={true}
                    color={topicTrends[topicTrendsNum].color.color_num}
                    size="large" />
            </View>
        )
    }

    componentDidMount() {
        this.getShowData(1);
    }

    _renderHeader = () => {

        return (
            <View style={{ padding: 10, backgroundColor: "#fff" }}>
                {/* 第1层，排序方式 */}
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <View>
                        <Text>全部评论(30)</Text>
                    </View>
                    <View>
                        <TouchableOpacity
                            ref={ref => this.commentSortRef = ref}
                            onPress={this.toggleCommentSortSpinner}
                            activeOpacity={0.6} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <FontAwesomeIcon5 name="sort-amount-down" size={15} />
                            <Text>最热</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }

    renderFlatList = () => {
        const { isRefresh, isReplyRefresh } = this.state;
        return (
            <View style={{ position: "relative" }}>
                <FlatList
                    data={this.state.data}
                    renderItem={this._renderItem}
                    ListHeaderComponent={this._renderHeader}


                    refreshControl={
                        <RefreshControl
                            refreshing={isRefresh}
                            onRefresh={this._onRefresh}//上拉刷新
                            colors={[topicTrends[topicTrendsNum].color.color_num, "#ec1a0a", "#ffc051"]}
                            progressBackgroundColor="#fff"
                        />
                    }

                    onEndReached={() => this._onLoadMore()}//下拉加载
                    onEndReachedThreshold={0.3}
                    ListFooterComponent={this._renderFooter}
                    ListEmptyComponent={this._renderEmptyer}
                />
                {/* 回复框 */}
                <View style={{
                    backgroundColor: "#fff", borderTopWidth: 0.5, borderTopColor: "#eee", width: screenWidth,
                    position: "absolute", bottom: 0,
                    flexDirection: "row", justifyContent: "space-evenly", alignItems: "center"
                }}>
                    <InputBox
                        inputWidth={340}
                        inputHeight={40}
                        inputFontSize={15}
                        inputIconName="pencil"
                        inputPlaceholder="心有猛虎，细嗅蔷薇"
                        inputTopicColor="#ffffff"
                        inputButtonText="提交"
                        inputMultiline={true}
                        inputShowFontColor="#ccc"
                    />
                    <TouchableOpacity>
                        <FontAwesomeIcon5 name='grin-wink' size={30} color='#0007' />
                    </TouchableOpacity>
                </View>
                {/* reply模态框 */}
                <Modalbox
                    isOpen={this.state.showReplyModal}
                    onOpened={() => {
                        if (this.showReplyModal) {//解决onOpened会调2次的bug
                            this.showReplyModal = false;
                            this.getReplyShowData(1,'refresh')
                        }
                    }}
                    onClosed={() => {
                        this.toggleReplySpinner(false);
                        this.showReplyModal = true;
                    }}
                    position="bottom"
                    // style={{height:1000}}
                    style={{ position: "relative" }}

                >
                    <View style={{}}>
                        {/* 1层，显示回复个数 */}
                        <View style={{ paddingTop: 5, paddingBottom: 5, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                            <FontAwesomeIcon5 name='angle-double-down' size={20} color='#5c5c5c' style={{ paddingLeft: 5, paddingRight: 5 }} />
                            <Text style={{ paddingLeft: 5, paddingRight: 5, fontSize: 15 }}>收起</Text>
                        </View>
                        {/* 使用flatlist */}
                        {/* 2层，显示回复的某条评论 renderHeader*/}
                        {/* 3层，某条评论的回复 renderItem*/}
                        <FlatList
                            data={this.state.replyData}
                            renderItem={this._renderReplyItem}
                            ListHeaderComponent={this._renderReplyHeader}
                            // keyExtractor={(item)=>{return new Date().getTime()+item.key}}

                            refreshControl={
                                <RefreshControl
                                    refreshing={isReplyRefresh}
                                    onRefresh={this._onReplyRefresh}//上拉刷新
                                    colors={[topicTrends[topicTrendsNum].color.color_num, "#ec1a0a", "#ffc051"]}
                                    progressBackgroundColor="#fff"
                                />
                            }

                            onEndReached={() => this._onReplyLoadMore()}//下拉加载
                            onEndReachedThreshold={0.3}
                            ListFooterComponent={this._renderFooter}
                            ListEmptyComponent={this._renderEmptyer}
                        />
                    </View>
                    {/* 回复框 */}
                    <View style={{
                        backgroundColor: "#fff", borderTopWidth: 0.5, borderTopColor: "#eee", width: screenWidth,
                        position: "absolute", bottom: 0,
                        flexDirection: "row", justifyContent: "space-evenly", alignItems: "center"
                    }}>
                        <InputBox
                            inputWidth={340}
                            inputHeight={40}
                            inputFontSize={15}
                            inputIconName="pencil"
                            inputPlaceholder="心有猛虎，细嗅蔷薇"
                            inputTopicColor="#ffffff"
                            inputButtonText="提交"
                            inputMultiline={true}
                            inputShowFontColor="#ccc"
                        />
                        <TouchableOpacity>
                            <FontAwesomeIcon5 name='grin-wink' size={30} color='#0007' />
                        </TouchableOpacity>
                    </View>
                </Modalbox>
                {/* 评论排序弹框 */}
                <Popover from={this.state.commentSortRect}
                    isVisible={this.state.showCommentSortPopover}
                    onRequestClose={() => this.setState({ showCommentSortPopover: false })}
                    backgroundStyle={{ backgroundColor: "#000", opacity: 0.1 }}
                    animationConfig={{ duration: 200 }}
                    popoverStyle={{ borderRadius: 5 }}
                >
                    {spinnerSortArray.map((v, i) => {
                        return <TouchableHighlight key={i} onPress={() => { alert(v, ",index:", i) }}
                            underlayColor='#ddd'>
                            <Text style={{ padding: 5, paddingLeft: 10, paddingRight: 10, color: '#5c5c5c' }}>
                                {v}
                            </Text>
                        </TouchableHighlight>
                    })
                    }
                </Popover>
            </View>


        );
    }

    _renderReplyHeader = () => {

        return (
            <View>
                <View style={{
                    paddingTop: 10, paddingBottom: 10, backgroundColor: "#fff",
                    flexDirection: "row",
                }}>
                    {/**第1列 头像*/}
                    <View style={{ flex: 1.5, alignItems: "center" }}>
                        <TouchableOpacity onPress={() => { }} style={{ flexDirection: "row", alignItems: "center" }}>
                            <Image style={{ ...styles.profilePhoto }} source={this.videoInfo.photoPath} />
                        </TouchableOpacity>
                    </View>
                    {/* 第2列 */}
                    <View style={{ flex: 8.5 }}>
                        {/* 2.1层 用户信息 */}
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <View style={{}}>
                                <Text style={{ fontSize: 15, color: "#5a5a5a" }}>
                                    {this.videoInfo.nickName}
                                </Text>
                                <Text style={{ fontSize: 12, color: "#0004" }}>
                                    {dateDiff(this.videoInfo.publishTime)}
                                </Text>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "flex-start" }}>
                                <TouchableOpacity style={{ marginRight: 10 }}>
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <FontAwesomeIcon name="thumbs-o-up" size={12} color="#0007" />
                                        <Text style={{ fontSize: 15, color: "#0007", paddingLeft: 6, paddingRight: 6 }}>
                                            {this.videoInfo.good}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <FontAwesomeIcon name="thumbs-o-down" size={12} color="#0007" />
                                        <Text style={{ fontSize: 15, color: "#0007", paddingLeft: 6, paddingRight: 6 }}>
                                            {this.videoInfo.bad}
                                        </Text>
                                    </View>
                                </TouchableOpacity>

                            </View>
                        </View>
                        {/* 2.2层 评论内容 */}
                        <View style={{ paddingTop: 10, paddingBottom: 10, marginRight: 10 }}>
                            <Text >{this.videoInfo.content}</Text>
                        </View>
                    </View>

                </View>
                <View style={{ paddingTop: 5, paddingLeft: 10, paddingRight: 10, alignItems: "flex-start", borderTopWidth: 8, borderTopColor: "#eeee" }}>
                    <Text style={{ fontSize: 15, color: "#5c5c5c" }}>全部回复(5)：</Text>
                </View>
            </View>

        );
    }
    //item就是data传进去的，index就是list中每个元素的key属性
    _renderReplyItem = ({ item, index }) => {

        // return (<></>);
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
                            <Image style={{ ...styles.profilePhoto }} source={this.videoInfo.photoPath} />
                        </TouchableOpacity>
                    </View>
                    {/* 第2列 */}
                    <View style={{ flex: 8.5 }}>
                        {/* 2.1层 用户信息 */}
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <View style={{}}>
                                <Text style={{ fontSize: 15, color: "#5a5a5a" }}>
                                    {this.videoInfo.nickName}
                                </Text>
                                <Text style={{ fontSize: 12, color: "#0004" }}>
                                    {dateDiff(this.videoInfo.publishTime)}
                                </Text>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "flex-start" }}>
                                <TouchableOpacity style={{ marginRight: 10 }}>
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <FontAwesomeIcon name="thumbs-o-up" size={12} color="#0007" />
                                        <Text style={{ fontSize: 15, color: "#0007", paddingLeft: 6, paddingRight: 6 }}>
                                            {this.videoInfo.good}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <FontAwesomeIcon name="thumbs-o-down" size={12} color="#0007" />
                                        <Text style={{ fontSize: 15, color: "#0007", paddingLeft: 6, paddingRight: 6 }}>
                                            {this.videoInfo.bad}
                                        </Text>
                                    </View>
                                </TouchableOpacity>

                            </View>
                        </View>
                        {/* 2.2层 回复内容 */}
                        <View style={{ paddingTop: 10, paddingBottom: 10, marginRight: 10 }}>
                            <Text >{this.videoInfo.content}</Text>
                        </View>
                        {/* 2.3层 回复的谁的内容 */}
                        <View style={{
                            borderLeftWidth: 2, borderLeftColor: topicTrends[topicTrendsNum].color.color_num,
                            backgroundColor: "#eee5", padding: 10
                        }}>
                            <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                                <Text>回复</Text>
                                <Text style={{ paddingLeft: 5, color: topicTrends[topicTrendsNum].color.color_num, }}>{this.videoInfo.nickName}</Text>
                                <Text style={{ paddingLeft: 5, }}>：</Text>
                            </View>
                            <View style={{ marginTop: 10 }}>
                                <Text>{this.videoInfo.content}</Text>
                            </View>
                        </View>
                    </View>

                </View>
            </TouchableOpacity>
        );
    }

    _onReplyRefresh = () => {
        this.setState({
            isReplyRefresh: true,
            replyPage: 1
        }, () => {
            this.getReplyShowData(1, 'refresh')
        })
    }

    _onReplyLoadMore = () => {
        if ((this.state.replyPage - 1) * this.state.sizePerPage < this.state.totalReplyDataSize && !this.state.loadingReplyMore) {
            this.setState({
                loadingReplyMore: true,
                hasReplyMorePage: true
            }, () => {
                this.getReplyShowData(this.state.replyPage);
            })
        } else if ((this.state.replyPage - 1) * this.state.sizePerPage >= this.state.totalReplyDataSize && !this.state.loadingReplyMore) {
            this.setState({
                hasReplyMorePage: false
            })
        }
    }

    getReplyShowData = (page, type) => {
        const { sizePerPage, totalReplyDataSize } = this.state;
        new Promise((resolve, reject) => {
            let array = [];
            for (let i = (page - 1) * sizePerPage + totalReplyDataSize, j = 0; i < totalReplyDataSize * 2 && j < sizePerPage; i++, j++) {
                let type = i % 4 == 0 ? "原" : i % 4 == 1 ? "转" : i % 4 == 2 ? "翻" : "志";
                let obj = {
                    key: i,
                    photoPath: require("../../../../../../../res/img/photo.jpg"),
                    nickName: "qgao",
                    publishTime: 1630584687000,//时间戳形式,ms
                    title: i % 4 != 0 ? "论如何渲染flatlist" : "23333333333",
                    type: type,
                    posterPath: require("../../../../../../../res/img/snow.jpg"),
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
                        replyData: [...data],
                        replyPage: this.state.replyPage + 1,
                        isReplyRefresh: false,
                        // isFirstLoad: false,
                        loadingReplyMore: false,
                    })
                } else {
                    this.setState({
                        replyData: [...this.state.replyData, ...data],
                        replyPage: this.state.replyPage + 1,
                        isReplyRefresh: false,
                        // isFirstLoad: false,
                        loadingReplyMore: false,
                    })
                }
            } else {
                this.setState({
                    replyData: [...this.state.replyData, ...data],
                    isReplyRefresh: false,
                    // isFirstLoad: false,
                    loadingReplyMore: false,
                })
            }

        })

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
export default Index;

const styles = StyleSheet.create({
    titleViewStyle: {
        flexDirection: "row",
        // alignItems: "center",
        padding: 5,
        paddingLeft: 10,
        paddingRight: 10,
    },
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
        width: screenWidth / 2.2,
        height: screenWidth / 2.2 * 9 / 16,
        resizeMode: 'contain',
        borderRadius: 20
    },
    widget: {
        fontSize: 12,
        paddingLeft: 2,
        paddingRight: 6,
        color: "#ffffffe6"
    }
})