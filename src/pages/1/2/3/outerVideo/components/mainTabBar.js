import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {topicTrends,topicTrendsNum} from '../../../../../../utils/stylesKits'


class Index extends React.Component {
    render() {
        // goToPage 函数 负责跳转页面
        // tabs 标题数组 
        // activeTab 当前激活选中的索引
        const { goToPage, tabs, activeTab } = this.props;

        return (
            <View style={{ flexDirection: "row", height: 40, justifyContent: "space-between", }}>
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
                                borderBottomColor: topicTrends[topicTrendsNum].color.color_num,
                                borderBottomWidth: activeTab === i ? 2 : 0
                            }}
                        ><Text style={{ color: activeTab === i ? "#000" : "#ccc", fontSize: activeTab === i ? 18 : 15 }} >{v}</Text>
                        </TouchableOpacity>
                    )}
                </View>
                <View style={{...styles.titleViewStyle}}>
                    <TouchableOpacity
                        onPress={() => {}}
                        style={{
                            justifyContent: "center",
                            paddingLeft: 5,
                            paddingRight: 5,
                        }}
                    ><Text style={{ color: "#ccc", fontSize: 15 }} >所有视频</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
export default Index;

const styles = StyleSheet.create({
    titleViewStyle: {
        flexDirection: "row",
        alignItems: "center",
        padding: 5,
        paddingLeft: 10,
        paddingRight: 10,
    }
})