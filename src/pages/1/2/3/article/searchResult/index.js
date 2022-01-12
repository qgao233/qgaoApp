import React from 'react';
import {
    View, Text, StatusBar, Animated, Easing, ScrollView, StyleSheet,
    TouchableOpacity,
} from 'react-native';
import SearchFrame from '../../utils/components/searchFrame'
import FontAwesomeIcon5 from 'react-native-vector-icons/FontAwesome5';
import { createSelector } from '@reduxjs/toolkit';
import { connect } from 'react-redux';
import moment from 'moment'
import ShowList from './showList'

const getYear = () => {
    let year = moment().year()

    let years = [];
    for (let i = year; i > 2010; i--) {
        years.push(i);
    }
    return years;
}

class Index extends React.Component {

    constructor() {
        super();
        this.classficationRef = React.createRef();
        this.rankRef = React.createRef();

        this.state = {

            translateY: new Animated.Value(1),//0,
            scale: new Animated.Value(1),//1,
            height: new Animated.Value(1),//40
            opacity: new Animated.Value(1),//1

            type: {
                curr: 0,
                list: [
                    "全部", "原创", "转载", "翻译", "开发日志"
                ],
            },
            category: {
                curr: 0,
                list: [
                    "全部", "Java", "人工智能", "面试", "redis", "nacos", "feign", "shiro", "mysql", "rocketMQ",
                ],
            },
            tag: {
                curr: 0,
                list: [
                    "全部", "react-native", "es6", "commonJS"
                ],
            },
            year: {
                curr: 0,
                list: getYear(),
            },
            order: {
                curr: 0,
                list: [
                    "最新发布", "最多浏览", "最多收藏", "最多评论", "最多点赞",
                ],
            },

            isShowSearchFrame: true,

        }
    }

    toggleSearchFrame = (bool) => {
        if (bool == undefined) bool = !this.state.isShowSearchFrame;
        if(bool == false && this.state.isShowSearchFrame == false) return;
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
        ]).start(() => {
            this.setState({ isShowSearchFrame: !this.state.isShowSearchFrame })
        });
    }


    render() {

        let { translateY, scale, height, opacity } = this.state;
        translateY = translateY.interpolate({
            inputRange: [0, 1],
            outputRange: [-100, 0]
        })
        scale = scale.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1]
        })
        height = height.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 245]
        })
        opacity = opacity.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1]
        })

        const { topicTrends, topicTrendsNum } = this.props;

        return (
            <View style={{ flex: 1, paddingTop: 30, backgroundColor: "#fff" }}>
                <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent={true} hidden={false} />
                {/* 搜索框 */}
                <Animated.View
                    style={{
                        transform: [{ translateY: translateY },],
                        height: height,
                        opacity: opacity,
                    }}
                >
                    <SearchFrame searchBoxStyle={{ width: 320, height: 40 }} photoStyle={{ width: 40, height: 40 }} />
                    <View style={{
                        flexDirection: "row", alignItems: "center",
                        paddingLeft: 10, paddingRight: 10,
                    }}>
                        <Text style={{ color: "#5c5c5c", paddingRight: 10 }}>类型</Text>
                        <ScrollView
                            horizontal={true} showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ flexDirection: "row", alignItems: 'center' }}
                            style={{ ...styles.titleViewStyle }}
                        >
                            {this.state.type.list.map((v, i) =>
                                <TouchableOpacity
                                    activeOpacity={0.6}
                                    key={i}
                                    onPress={() => {
                                    }}
                                    style={{
                                        justifyContent: "center",
                                        alignItems: "center",
                                        padding: 10,
                                        paddingTop: 5, paddingBottom: 5,
                                        borderRadius: 10,
                                        backgroundColor: this.state.type.curr === i ? topicTrends[topicTrendsNum].style_desc.background : "transparent"
                                    }}
                                >
                                    <Text style={{
                                        color: this.state.type.curr === i ? topicTrends[topicTrendsNum].style_desc.gradient_start : "#ccc",
                                        fontSize: this.state.type.curr === i ? 15 : 14
                                    }} >
                                        {v}
                                    </Text>
                                </TouchableOpacity>
                            )}

                        </ScrollView>
                    </View>
                    <View style={{
                        flexDirection: "row", alignItems: "center",
                        paddingLeft: 10, paddingRight: 10,
                    }}>
                        <Text style={{ color: "#5c5c5c", paddingRight: 10 }}>分类</Text>
                        <ScrollView
                            horizontal={true} showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ flexDirection: "row", alignItems: 'center' }}
                            style={{ ...styles.titleViewStyle }}
                        >
                            {this.state.category.list.map((v, i) =>
                                <TouchableOpacity
                                    activeOpacity={0.6}
                                    key={i}
                                    onPress={() => {
                                    }}
                                    style={{
                                        justifyContent: "center",
                                        alignItems: "center",
                                        padding: 10,
                                        paddingTop: 5, paddingBottom: 5,
                                        borderRadius: 10,
                                        backgroundColor: this.state.category.curr === i ? topicTrends[topicTrendsNum].style_desc.background : "transparent"
                                    }}
                                >
                                    <Text style={{
                                        color: this.state.category.curr === i ? topicTrends[topicTrendsNum].style_desc.gradient_start : "#ccc",
                                        fontSize: this.state.category.curr === i ? 15 : 14
                                    }} >
                                        {v}
                                    </Text>
                                </TouchableOpacity>
                            )}

                        </ScrollView>
                    </View>
                    <View style={{
                        flexDirection: "row", alignItems: "center",
                        paddingLeft: 10, paddingRight: 10,
                    }}>
                        <Text style={{ color: "#5c5c5c", paddingRight: 10 }}>标签</Text>
                        <ScrollView
                            horizontal={true} showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ flexDirection: "row", alignItems: 'center' }}
                            style={{ ...styles.titleViewStyle }}
                        >
                            {this.state.tag.list.map((v, i) =>
                                <TouchableOpacity
                                    activeOpacity={0.6}
                                    key={i}
                                    onPress={() => {
                                    }}
                                    style={{
                                        justifyContent: "center",
                                        alignItems: "center",
                                        padding: 10,
                                        paddingTop: 5, paddingBottom: 5,
                                        borderRadius: 10,
                                        backgroundColor: this.state.tag.curr === i ? topicTrends[topicTrendsNum].style_desc.background : "transparent"
                                    }}
                                >
                                    <Text style={{
                                        color: this.state.tag.curr === i ? topicTrends[topicTrendsNum].style_desc.gradient_start : "#ccc",
                                        fontSize: this.state.tag.curr === i ? 15 : 14
                                    }} >
                                        {v}
                                    </Text>
                                </TouchableOpacity>
                            )}

                        </ScrollView>
                    </View>
                    <View style={{
                        flexDirection: "row", alignItems: "center",
                        paddingLeft: 10, paddingRight: 10,
                    }}>
                        <Text style={{ color: "#5c5c5c", paddingRight: 10 }}>年份</Text>
                        <ScrollView
                            horizontal={true} showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ flexDirection: "row", alignItems: 'center' }}
                            style={{ ...styles.titleViewStyle }}
                        >
                            {this.state.year.list.map((v, i) =>
                                <TouchableOpacity
                                    activeOpacity={0.6}
                                    key={i}
                                    onPress={() => {
                                    }}
                                    style={{
                                        justifyContent: "center",
                                        alignItems: "center",
                                        padding: 10,
                                        paddingTop: 5, paddingBottom: 5,
                                        borderRadius: 10,
                                        backgroundColor: this.state.year.curr === i ? topicTrends[topicTrendsNum].style_desc.background : "transparent"
                                    }}
                                >
                                    <Text style={{
                                        color: this.state.year.curr === i ? topicTrends[topicTrendsNum].style_desc.gradient_start : "#ccc",
                                        fontSize: this.state.year.curr === i ? 15 : 14
                                    }} >
                                        {v}
                                    </Text>
                                </TouchableOpacity>
                            )}

                        </ScrollView>
                    </View>
                    <View style={{
                        flexDirection: "row", alignItems: "center",
                        paddingLeft: 10, paddingRight: 10,
                    }}>
                        <Text style={{ color: "#5c5c5c", paddingRight: 10 }}>排序</Text>
                        <ScrollView
                            horizontal={true} showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ flexDirection: "row", alignItems: 'center' }}
                            style={{ ...styles.titleViewStyle }}
                        >
                            {this.state.order.list.map((v, i) =>
                                <TouchableOpacity
                                    activeOpacity={0.6}
                                    key={i}
                                    onPress={() => {
                                    }}
                                    style={{
                                        justifyContent: "center",
                                        alignItems: "center",
                                        padding: 10,
                                        paddingTop: 5, paddingBottom: 5,
                                        borderRadius: 10,
                                        backgroundColor: this.state.order.curr === i ? topicTrends[topicTrendsNum].style_desc.background : "transparent"
                                    }}
                                >
                                    <Text style={{
                                        color: this.state.order.curr === i ? topicTrends[topicTrendsNum].style_desc.gradient_start : "#ccc",
                                        fontSize: this.state.order.curr === i ? 15 : 14
                                    }} >
                                        {v}
                                    </Text>
                                </TouchableOpacity>
                            )}

                        </ScrollView>
                    </View>
                </Animated.View>
                <TouchableOpacity
                    onPress={() => { this.toggleSearchFrame() }}
                    activeOpacity={0.7}
                    style={{
                        paddingTop: 5, paddingBottom: 5,
                        flexDirection: "row", justifyContent: "center", alignItems: "center",
                        borderBottomColor: "#eee", borderBottomWidth: 1,
                    }}>
                    <FontAwesomeIcon5 name={this.state.isShowSearchFrame ? 'angle-double-up' : 'angle-double-down'} size={20} color='#ccc' style={{ paddingLeft: 5, paddingRight: 5 }} />
                    <Text style={{ paddingLeft: 5, paddingRight: 5, fontSize: 15, color: "#ccc" }}>{this.state.isShowSearchFrame ? "收起" : "展开"}</Text>
                </TouchableOpacity>
                <ShowList 
                    toggleSearchFrame={this.toggleSearchFrame}
                    {...this.props}
                />
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
const mapStateToProps = (state) => {
    return {
        topicTrends: getTopicTrends(state),
        topicTrendsNum: getTopicTrendsNum(state),
    }
}


export default connect(mapStateToProps, null)(Index);

const styles = StyleSheet.create({
    titleViewStyle: {
        flexDirection: "row",
        // alignItems: "center",
        padding: 5,
    },
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",//// 解决二级导航的bug加上marginTop:screenHeight/3

    },
})