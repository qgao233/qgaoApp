import React from 'react';
import { View, Text, StatusBar, PanResponder, Animated, Easing, ActivityIndicator } from 'react-native';
import SearchFrame from '../../utils/components/searchFrame'
import ShowList from './showList';
import { createSelector } from '@reduxjs/toolkit';
import { connect } from 'react-redux';

class Index extends React.Component {

    constructor() {
        super();

        this.state = {

            translateY: new Animated.Value(1),//0,
            scale: new Animated.Value(1),//1,
            height: new Animated.Value(1),//40
            opacity: new Animated.Value(1),//1

            isLoadingIndicatorShow: false,
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

    toggleScrollableTabViewLock = (bool = false) => {
        this.setState({ isScrollableTabViewLocked: bool });
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

        const { topicTrends, topicTrendsNum } = this.props;

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
                    <SearchFrame onPressSubmit={(keyTxt) => {
                        this.setState({ keyWord: keyTxt });
                        this.setState({isLoadingIndicatorShow:true})
                    }} searchBoxStyle={{ width: 320, height: 40 }} photoStyle={{ width: 40, height: 40 }} />
                </Animated.View>
                <View style={{ paddingLeft: 5 }}>
                    <Text style={{ fontSize: 20, color: "#5c5c5c" }}>搜索结果：</Text>
                </View>
                {this.state.isLoadingIndicatorShow
                    ? <ActivityIndicator animating={true}
                        color={topicTrends[topicTrendsNum].style_desc.gradient_start}
                        size="large" />
                    : <></>
                }

                <ShowList ref={(ref) => { this.showListRef = ref }}
                    closeLoadingIndicator={()=>{this.setState({isLoadingIndicatorShow:false})}}
                    showSearchFrame={this.toggleSearchFrame}
                    keyWord={this.state.keyWord || this.props.route.params.keyWord}
                    {...this.props}
                />

            </View>
        );
    }

    componentDidUpdate() {
        this.showListRef.getShowData(1, "refresh")
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
export default connect(mapStateToProps, null)(Index);