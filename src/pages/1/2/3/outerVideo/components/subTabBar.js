import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import {topicTrends,topicTrendsNum} from '../../../../../../utils/stylesKits'

class Index extends React.Component {
    render() {
        // goToPage 函数 负责跳转页面
        // tabs 标题数组 
        // activeTab 当前激活选中的索引
        const { goToPage, tabs, activeTab } = this.props;

        return (
            <View style={{ flexDirection: "row", height: 30 }}>
                <ScrollView
                    horizontal={true} showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ flexDirection: "row", alignItems: 'center' }}
                    style={{ ...styles.titleViewStyle }}
                >
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
                            }}
                        >
                            <Text style={{ color: activeTab === i ? topicTrends[topicTrendsNum].color.color_num : "#ccc", fontSize: activeTab === i ? 15 : 12 }} >{v}</Text>
                        </TouchableOpacity>
                    )}

                </ScrollView>

            </View>
        );
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
    }
})