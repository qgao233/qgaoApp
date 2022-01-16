import React, { useState } from 'react';
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
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import Popover, { Rect } from 'react-native-popover-view';
import { createSelector } from '@reduxjs/toolkit';
import { connect } from 'react-redux';
import { Card } from 'react-native-shadow-cards';
import RenderHtml, { useInternalRenderer,defaultHTMLElementModels  } from 'react-native-render-html';
import AntDesign from 'react-native-vector-icons/AntDesign'
import ImageViewer from 'react-native-image-zoom-viewer';
import { imgs } from '../htmlSource';

const spinnerTextArray = ["关注", "私聊", "拉黑", "举报"];

function CustomImageRenderer(props) {
    const { Renderer, rendererProps } = useInternalRenderer('img', props);
    const [showAlbum,setShowAlbum] = useState(false);
    return (
      <View style={{ alignItems: 'center' }}>
        <Renderer {...rendererProps} source={rendererProps.source} width={screenWidth-50} onPress={()=>{
            setShowAlbum(true)
        }} />
        <Modal visible={showAlbum} onRequestClose={() => setShowAlbum(false)} transparent={true} 
        // style={{backgroundColor:"#000"}}
        >
          <ImageViewer
            style={{backgroundColor:"#000"}}
            enableSwipeDown={true}
            swipeDownThreshold={80}//0-100
            onSwipeDown={() => setShowAlbum(false)}
            imageUrls={imgs}
            index={parseInt(rendererProps.containerProps.index)}
            // loadingRender={this.renderInitLoadIndicator}
            menuContext={{ saveToLocal: '保存到本地', cancel: '取消' }}
            onSave={() => alert("点击了保存图片")}
          />
        </Modal>
      </View>
    );
  }

const renderers = {
    img: CustomImageRenderer
};

const customHTMLElementModels = {
    img: defaultHTMLElementModels.img.extend({
        getReactNativeProps(tnode) {
            const attributes = tnode.attributes;
            return {
                native: {
                    index: attributes["index"]
                },
            };
        },
    })
};


class Index extends React.Component {

    constructor() {
        super();
        this.downArrowRef = {};

        this.state = {
            isFirstLoad: true, //是否是第1次加载
            isRefresh: false,  //是否刷新列表
            page: 1,           //数据分页展示的第1页
            totalDataSize: 30, //数据总共有30条
            hasMorePage: true, //通过比较已经加载的数据条数和总的数据条数来判断是否还有更多数据
            loadingMore: false,//通过该字段来重新渲染新的加载数据
            sizePerPage: 7,    //每一页7条数据
            data: [],           //已经加载的数据
            showAlbum: false,


            isShowInteraction: true,
            interactionIndicatorRight: new Animated.Value(1),
        };
        this.contentHeight = 0;
        this.isShowContentGlobal = true;
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

    //item就是data传进去的，index就是list中每个元素的key属性
    _renderItem = ({ item, index }) => {
        // return (<></>);
        return (
            <Card key={index}
                cornerRadius={0} elevation={5} opacity={0.2}
                style={{ width: "auto", marginTop: 10, marginLeft: 10, marginRight: 10, borderRadius: 10, padding: 10, backgroundColor: "#fff" }}>
                {/**第1层 */}
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <TouchableOpacity onPress={() => { }} style={{ flexDirection: "row", alignItems: "center" }}>
                            <Image style={{ ...styles.profilePhoto }} source={item.photoPath} />
                            <View style={{ paddingLeft: 10 }}>
                                <Text style={{ fontSize: 15, color: "#5a5a5a" }}>
                                    {item.nickName}
                                </Text>
                                <Text style={{ fontSize: 12, color: "#0004" }}>
                                    {dateDiff(item.publishTime)}
                                </Text>
                            </View>
                        </TouchableOpacity>

                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "center" }}>
                        {/* <TouchableOpacity style={{ marginRight: 10, padding: 5, paddingLeft: 10, paddingRight: 10, backgroundColor: topicTrends[topicTrendsNum].style_desc.gradient_start, borderRadius: 5 }}>
                                <Text style={{ color: "#fff" }}>关注</Text>
                            </TouchableOpacity> */}
                        <TouchableOpacity ref={(ref) => {
                            this.downArrowRef[index] = ref;
                        }} onPress={() => { this.toggleSpinner(index) }} style={{ padding: 5, paddingLeft: 10, paddingRight: 10, }}>
                            {
                                !this.state.showPopover
                                    ? <FontAwesomeIcon name="ellipsis-h" size={15} color="#ddd" />
                                    : this.state.index != index
                                        ? <FontAwesomeIcon name="ellipsis-h" size={15} color="#ddd" />
                                        : <FontAwesomeIcon name="chevron-down" size={12} color="#ddd" />
                            }
                        </TouchableOpacity>

                    </View>
                </View>
                <TouchableOpacity>
                    {/* 第2层 标题层 */}
                    <View style={{ flexDirection: "row", alignItems: "center", paddingTop: 5, paddingBottom: 5 }}>
                        <View style={{ flex: 9 }}><Text style={{ fontSize: 15 }}>{item.title}</Text></View>
                        <View style={{ flex: 1, alignItems: "center" }}>
                            <LinearGradient
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                colors={item.type == "原" ?
                                    [articleType.original.gradient_start,
                                    articleType.original.gradient_end]
                                    : item.type == "转" ?
                                        [articleType.transfer.gradient_start,
                                        articleType.transfer.gradient_end]
                                        : item.type == "翻" ?
                                            [articleType.translate.gradient_start,
                                            articleType.translate.gradient_end]
                                            : [articleType.log.gradient_start,
                                            articleType.log.gradient_end]

                                }
                                style={{
                                    alignItems: "center", justifyContent: "center", borderRadius: 10,
                                    paddingLeft: 5, paddingRight: 5, paddingTop: 2, paddingBottom: 2,
                                }}
                            >
                                <Text style={{ color: "#fff", fontSize: 10 }}>{item.type}</Text>
                            </LinearGradient>
                        </View>
                    </View>
                    {/**第3层 内容层*/}
                    <View>
                        <View><Text style={{ color: "#5c5c5c", fontSize: 10 }}>{item.content}</Text></View>
                    </View>
                </TouchableOpacity>

                {/* 第4层 图片层 */}
                <View style={{ flexDirection: "row", alignItems: "center", paddingTop: 5, paddingBottom: 5 }}>
                    {

                        item.imgPaths.map((v, i, arr) => {

                            return <TouchableOpacity key={i} onPress={() => this.handleShowAlbum(index, i)} style={{ marginRight: 5 }}>
                                <Image source={v} style={{ ...styles.img }} />
                            </TouchableOpacity>

                        })
                    }
                </View>
                {/* 第5层 标签层 */}
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-end" }}>
                    {
                        item.tags.map((v, i) => {
                            if (i == 0)
                                return <View key={i} style={{ marginLeft: 5, paddingLeft: 2, paddingRight: 2, paddingTop: 1, paddingBottom: 1, justifyContent: "center", backgroundColor: "#ffd5d3", borderRadius: 5 }}>
                                    <Text style={{ color: "#ec1a0a", fontSize: 10 }}>{v}</Text>
                                </View>
                            else return <View key={i} style={{ marginLeft: 5, paddingLeft: 2, paddingRight: 2, paddingTop: 1, paddingBottom: 1, justifyContent: "center", backgroundColor: "#eee", borderRadius: 5 }}>
                                <Text style={{ color: "#aaa", fontSize: 10 }}>{v}</Text>
                            </View>
                        })
                    }
                </View>
                {/* 第6层 交互层 */}
                <View style={{ paddingTop: 5, flexDirection: "row", alignItems: "center", justifyContent: "space-around" }}>
                    <TouchableOpacity>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <FontAwesomeIcon name="thumbs-o-up" size={20} color="#0007" />
                            <Text style={{ fontSize: 15, color: "#0007", paddingLeft: 6, paddingRight: 6 }}>
                                {item.good}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <FontAwesomeIcon name="thumbs-o-down" size={20} color="#0007" />
                            <Text style={{ fontSize: 15, color: "#0007", paddingLeft: 6, paddingRight: 6 }}>
                                {item.bad}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <FontAwesomeIcon name="star-o" size={20} color="#0007" />
                            <Text style={{ fontSize: 15, color: "#0007", paddingLeft: 6, paddingRight: 6 }}>
                                {item.store}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <FontAwesomeIcon name="commenting-o" size={20} color="#0007" />
                            <Text style={{ fontSize: 15, color: "#0007", paddingLeft: 6, paddingRight: 6 }}>
                                {item.comment}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <FontAwesomeIcon name="gift" size={20} color="#0007" />
                            <Text style={{ fontSize: 15, color: "#0007", paddingLeft: 6, paddingRight: 6 }}>
                                {item.reward}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </Card>
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
                    title: "论如何渲染flatlist",
                    type: type,
                    content: "先查阅相关组件的资料，然后查看属性的介绍，根据自己想要实现的功能，来实现自己的列表渲染",
                    imgPaths: [
                        require("../../../../../../../res/img/snow.jpg"),
                        require("../../../../../../../res/img/photo.jpg")
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
            // setTimeout(() => {
            resolve(array);
            // resolve([]);
            // }, 500);

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



    _renderHeader = () => {
        const { topicTrends, topicTrendsNum } = this.props;

        const { articleDetailData, isShowArticleLoading } = this.props;

        return (

            <View style={{ paddingTop: 5, paddingLeft: 10, paddingRight: 10, }}>
                {isShowArticleLoading
                    ? <ActivityIndicator animating={true}
                        color={topicTrends[topicTrendsNum].style_desc.gradient_start}
                        size="large" />
                    : <>
                        {/* 第2层 标题层 */}
                        <View style={{
                            flexDirection: "row", alignItems: "center",
                            paddingLeft: 10, paddingRight: 10,
                            paddingTop: 20, paddingBottom: 20,
                        }}>
                            <View style={{ flex: 9 }}>
                                <Text style={{ fontSize: 20 }}>{articleDetailData.title}</Text>
                            </View>
                            <View style={{ flex: 1, alignItems: "center" }}>
                                <LinearGradient
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    colors={articleDetailData.type == "原" ?
                                        [articleType.original.gradient_start,
                                        articleType.original.gradient_end]
                                        : articleDetailData.type == "转" ?
                                            [articleType.transfer.gradient_start,
                                            articleType.transfer.gradient_end]
                                            : articleDetailData.type == "翻" ?
                                                [articleType.translate.gradient_start,
                                                articleType.translate.gradient_end]
                                                : [articleType.log.gradient_start,
                                                articleType.log.gradient_end]

                                    }
                                    style={{
                                        alignItems: "center", justifyContent: "center", borderRadius: 10,
                                        paddingLeft: 5, paddingRight: 5, paddingTop: 2, paddingBottom: 2,
                                    }}
                                >
                                    <Text style={{ color: "#fff", fontSize: 10 }}>{articleDetailData.type}</Text>
                                </LinearGradient>
                            </View>
                        </View>
                        {/* 第4层 标签层 */}
                        <View style={{
                            flexDirection: "row", paddingLeft: 10, paddingRight: 10, alignItems: "center", justifyContent: "flex-end",
                            paddingTop: 10, paddingBottom: 10,
                        }}>
                            {
                                articleDetailData.tags.map((v, i) => {
                                    if (i == 0)
                                        return <View key={i} style={{ marginLeft: 5, paddingLeft: 2, paddingRight: 2, paddingTop: 1, paddingBottom: 1, justifyContent: "center", backgroundColor: "#ffd5d3", borderRadius: 5 }}>
                                            <Text style={{ color: "#ec1a0a", fontSize: 10 }}>{v}</Text>
                                        </View>
                                    else return <View key={i} style={{ marginLeft: 5, paddingLeft: 2, paddingRight: 2, paddingTop: 1, paddingBottom: 1, justifyContent: "center", backgroundColor: "#eee", borderRadius: 5 }}>
                                        <Text style={{ color: "#aaa", fontSize: 10 }}>{v}</Text>
                                    </View>
                                })
                            }
                        </View>
                        <View style={{ height: 1, backgroundColor: "#eee" }} />
                        <View style={{ height: 30 }} />
                        <RenderHtml
                            contentWidth={screenWidth}
                            source={articleDetailData.content}
                            customHTMLElementModels={customHTMLElementModels}
                            renderers={renderers}
                        />
                        <View style={{ height: 30 }} />
                        <View style={{ height: 1, backgroundColor: "#eee" }} />
                        <View style={{ height: 30 }} />
                    </>
                }

                <View style={{ paddingTop: 5, alignItems: "flex-start" }}>
                    <Text style={{ fontSize: 15, color: "#5c5c5c" }}>推荐</Text>
                </View>
            </View>

        );
    }

    toggleInteractionIndicator = (bool) => {
        if (bool == undefined) bool = !this.state.isShowInteraction;
        const config = bool
            ? {
                toValue: 1,
                duration: 800,
                easing: Easing.bounce,
                useNativeDriver: false,//消除警告，但这里不能设置为true
            }
            : {
                toValue: 0,
                duration: 500,
                easing: Easing.ease,
                useNativeDriver: false,//消除警告，但这里不能设置为true
            };
        Animated.parallel([
            Animated.timing(this.state.interactionIndicatorRight, { ...config, }),
        ]).start(() => {
        });
        this.setState({ isShowInteraction: !this.state.isShowInteraction })

    }

    renderFlatList = () => {
        const { isRefresh, isShowInteraction } = this.state;
        const { topicTrends, topicTrendsNum } = this.props;
        const { articleDetailData } = this.props;

        const { interactionIndicatorRight } = this.state;

        let interactionIndicatorRightOut = interactionIndicatorRight.interpolate({
            inputRange: [0, 1],
            outputRange: [0, screenWidth / 8]
        })

        let interactionIndicatorBottomOut = interactionIndicatorRight.interpolate({
            inputRange: [0, 1],
            outputRange: [screenHeight / 2, screenHeight / 4]
        })
        let interactionIndicatorHeightOut = interactionIndicatorRight.interpolate({
            inputRange: [0, 1],
            outputRange: [0, screenHeight / 2.8]
        })

        let translateY = interactionIndicatorRight.interpolate({
            inputRange: [0, 1],
            outputRange: [70, 0]
        })

        return (
            <>
                <FlatList
                    data={this.state.data}
                    renderItem={this._renderItem}
                    ListHeaderComponent={this._renderHeader}

                    onScrollBeginDrag={(evt) => {
                        this.contentOffsetY = evt.nativeEvent.contentOffset.y;
                        this.velocityY = evt.nativeEvent.velocity.y;
                    }}
                    onScrollEndDrag={(evt) => {

                        //手指从上往下
                        if (evt.nativeEvent.contentOffset.y == 0 ||
                            evt.nativeEvent.contentOffset.y < this.contentOffsetY &&
                            evt.nativeEvent.velocity.y > this.velocityY) {
                            this.props.toggleAuthorFrame(true);
                        } else {
                            this.props.toggleAuthorFrame(false);
                        }
                    }}

                    style={{ backgroundColor: "#fefefe" }}

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
                <Animated.View style={{
                    position: "absolute", right: interactionIndicatorRightOut, bottom: interactionIndicatorBottomOut,
                    alignItems: "center",

                }}>
                    <Animated.View style={{
                        height: interactionIndicatorHeightOut,
                        transform: [{ translateY: translateY },],
                        overflow: "hidden",
                        justifyContent: "flex-end",
                        width: 70,
                        alignItems: "center",
                    }}>

                        <Card
                            cornerRadius={0} elevation={5} opacity={0.2}
                            style={{ width: "auto", borderRadius: 100, marginTop: 10, marginBottom: 10, }}>
                            <TouchableOpacity style={{ borderRadius: 30, width: 60, height: 60, alignItems: "center", justifyContent: "center" }}>
                                <Text style={{ fontSize: 20, color: "#5c5c5c", paddingLeft: 6, paddingRight: 6 }}>
                                    {articleDetailData.bad}
                                </Text>
                                <FontAwesomeIcon name="thumbs-o-down" size={20} color="#5c5c5c" />
                            </TouchableOpacity>
                        </Card>
                        <Card
                            cornerRadius={0} elevation={5} opacity={0.2}
                            style={{ width: "auto", borderRadius: 100, marginTop: 10, marginBottom: 10, }}>
                            <TouchableOpacity style={{ borderRadius: 30, width: 60, height: 60, alignItems: "center", justifyContent: "center" }}>
                                <Text style={{ fontSize: 20, color: "#5c5c5c", paddingLeft: 6, paddingRight: 6 }}>
                                    {articleDetailData.reward}
                                </Text>
                                <FontAwesomeIcon name="gift" size={20} color="#5c5c5c" />
                            </TouchableOpacity>
                        </Card>
                        <Card
                            cornerRadius={0} elevation={5} opacity={0.2}
                            style={{ width: "auto", borderRadius: 100, marginTop: 10, marginBottom: 10, }}>
                            <TouchableOpacity style={{ borderRadius: 30, width: 60, height: 60, alignItems: "center", justifyContent: "center" }}>
                                <Text style={{ fontSize: 20, color: "#5c5c5c", paddingLeft: 6, paddingRight: 6 }}>
                                    {articleDetailData.store}
                                </Text>
                                <FontAwesomeIcon name="star-o" size={20} color="#5c5c5c" />
                            </TouchableOpacity>
                        </Card>
                        <Card
                            cornerRadius={0} elevation={5} opacity={0.2}
                            style={{ width: "auto", borderRadius: 100, marginTop: 10, marginBottom: 10, }}>
                            <TouchableOpacity style={{ borderRadius: 30, width: 60, height: 60, alignItems: "center", justifyContent: "center" }}>
                                <Text style={{ fontSize: 20, color: "#5c5c5c", paddingLeft: 6, paddingRight: 6 }}>
                                    {articleDetailData.good}
                                </Text>
                                <FontAwesomeIcon name="thumbs-o-up" size={20} color="#5c5c5c" />
                            </TouchableOpacity>
                        </Card>
                    </Animated.View>

                    <Card
                        cornerRadius={0} elevation={5} opacity={0.2}
                        style={{ width: "auto", borderRadius: 100, marginTop: 10, marginBottom: 10, }}>
                        <TouchableOpacity
                            onPress={() => this.toggleInteractionIndicator()}
                            style={{
                                borderRadius: 30, width: 60, height: 60,
                                alignItems: "center", justifyContent: "center"
                            }}>
                            <AntDesign name={isShowInteraction ? "minus" : "plus"} size={30} color={isShowInteraction ? "#eee" : topicTrends[topicTrendsNum].style_desc.gradient_start} />
                        </TouchableOpacity>
                    </Card>

                </Animated.View>
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
