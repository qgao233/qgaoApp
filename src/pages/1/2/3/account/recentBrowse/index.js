import React, { useState } from 'react';
import { View, Text, StatusBar, Animated } from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view'
import TabBar from '../Components/TabBar'
import { useSelector } from 'react-redux';
import { selectTopicTrendsNum } from '../../../../../../utils/slice/topicTrendsNumSlice'
import { selectTopicTrends } from '../../../../../../utils/slice/topicTrendsSlice'
import ShowList from './ShowList'
import { screenWidth } from '../../../../../../utils/stylesKits';

const tabList = [
    { id: 0, text: "文章" },
    { id: 1, text: "视频" },
]

export default (props) => {

    const topicTrendsNum = useSelector(selectTopicTrendsNum);
    const topicTrends = useSelector(selectTopicTrends);


    const dynamicRenderTabPage = () => {
        const views = [];
        tabList.forEach((v, i) => {
            views.push(
                <View key={i} tabLabel={v.text} >
                    <ShowList cid={v.id} {...props} />
                </View>
            );
        })
        return views;
    }

    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            {/* tab标签栏,外层一定是弹性容器（flex:1)才会显示 */}
            <ScrollableTabView
                initialPage={props.route.params.index}
                renderTabBar={() => < TabBar leftName="" />}
            >
                {dynamicRenderTabPage()}
            </ScrollableTabView>

        </View>

    );
}
