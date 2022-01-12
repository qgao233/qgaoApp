import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createSelector } from '@reduxjs/toolkit';
import { connect } from 'react-redux';

class Index extends React.Component {
    render() {
        // goToPage 函数 负责跳转页面
        // tabs 标题数组 
        // activeTab 当前激活选中的索引
        const { goToPage, tabs, activeTab } = this.props;
        const {topicTrends,topicTrendsNum} = this.props;
        const {navigation} = this.props;

        return (
            <View style={{ flexDirection: "row", height: 40, justifyContent: "space-between" }}>
                <View style={{...styles.titleViewStyle}}>
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
                <View style={{...styles.titleViewStyle}}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("ArticleResult")}
                        style={{
                            justifyContent: "center",
                            paddingLeft: 5,
                            paddingRight: 5,
                        }}
                    ><Text style={{ color: "#ccc", fontSize: 15 }} >所有文章</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
//使用reselect机制，防止不避要的re-render
const getTopicTrends = createSelector(
    [state=>state.topicTrends],
    topicTrends=>topicTrends
  )
  const getTopicTrendsNum = createSelector(
    [state=>state.topicTrendsNum],
    topicTrendsNum=>topicTrendsNum.value
  )
  const mapStateToProps = (state)=>{
    return {
        topicTrends:getTopicTrends(state),
        topicTrendsNum:getTopicTrendsNum(state),
    }
  }
  
  
  export default connect(mapStateToProps,null)(Index);

const styles = StyleSheet.create({
    titleViewStyle: {
        flexDirection: "row",
        alignItems: "center",
        padding: 5,
        paddingLeft: 10,
        paddingRight: 10,
    }
})