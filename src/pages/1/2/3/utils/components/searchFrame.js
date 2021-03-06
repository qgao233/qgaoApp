import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import SearchBox from '../../../../../../utils/components/inputBox';
import { createSelector } from '@reduxjs/toolkit';
import { connect } from 'react-redux';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

class Index extends React.Component {

    static defaultProps = {
        searchBoxStyle: {
            width: 350,
            height: 50,
        },
        photoStyle: {
            width: 40,
            height: 40
        }
    }

    render() {
        const { topicTrends, topicTrendsNum } = this.props;

        return (
            <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "center" }}>
                <SearchBox
                    onPressSubmit={(inputTxt) => { this.props.onPressSubmit(inputTxt) }}
                    inputColorOpacity="22"
                    inputTopicColor={topicTrends[topicTrendsNum].style_desc.gradient_start}
                    inputWidth={this.props.searchBoxStyle.width}
                    inputHeight={this.props.searchBoxStyle.height}
                    // inputFontSize={20}
                    inputPlaceholder="搜索"
                    inputButtonText="搜索"
                />
                <TouchableOpacity activeOpacity={0.7} onPress={()=>{
                    this.props.toggleArticleAndVideo(this.props.resIndex==0?1:0);
                }}>
                    {/* <Image style={{ ...this.props.photoStyle, borderRadius: this.props.photoStyle.width / 2 }} source={require("../../../../../../res/img/apk/appLogo.png")}></Image> */}
                    <FontAwesome5Icon name="exchange-alt" size={20} color={topicTrends[topicTrendsNum].style_desc.gradient_start} />
                </TouchableOpacity>
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