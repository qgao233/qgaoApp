import React, { useState } from 'react';
import { View, Text, StatusBar, Animated,StyleSheet,TouchableOpacity} from 'react-native';
import InputBox from '../../../../../../utils/components/inputBox';
import ScrollableTabView from 'react-native-scrollable-tab-view'
import Feather from 'react-native-vector-icons/Feather'
import TabBar from '../Components/TabBar'
import { useSelector } from 'react-redux';
import { selectTopicTrendsNum } from '../../../../../../utils/slice/topicTrendsNumSlice'
import { selectTopicTrends } from '../../../../../../utils/slice/topicTrendsSlice'
import ShowList from './ShowList'
import { screenWidth } from '../../../../../../utils/stylesKits';
import FullPageHeader from '../../../../../../utils/components/fullPageHeader';


const tabList = [
    { id: 1, text: "点赞" },
    { id: 2, text: "收藏" },
    { id: 2, text: "评论" },
    { id: 2, text: "打赏" },
]

const iconViewList = [
    {
        color:"#ebc969",
        component:<Feather name='thumbs-up' size={20} color='#fff' />
    },
    {
        color:"#ff5415",
        component:<Feather name='star' size={20} color='#fff' />,
    },
    {
        color:"#2fb4f9",
        component:<Feather name='message-square' size={20} color='#fff' />,
    },
    {
        color:"#1adbde",
        component:<Feather name='award' size={20} color='#fff' />,
    }
    
    
]

function CircleTabBar(props) {
    const topicTrendsNum = useSelector(selectTopicTrendsNum);
    const topicTrends = useSelector(selectTopicTrends);

    const { goToPage, tabs, activeTab } = props;
    return (

        <View style={{
            ...styles.titleViewStyle,
            backgroundColor: "#fff",
            marginTop: 5, flexDirection: "row", justifyContent: "space-evenly"
        }}>
            {tabs.map((v, i) =>
                <TouchableOpacity
                    activeOpacity={0.7}
                    key={i}
                    onPress={() => {
                        goToPage(i)
                    }}
                    style={{

                        alignItems: "center"
                        // borderBottomColor: topicTrends[topicTrendsNum].style_desc.gradient_start,
                        // borderBottomWidth: activeTab === i ? 2 : 0
                    }}
                >
                    <View style={{ backgroundColor:iconViewList[i].color,width:60,height:60,borderRadius:30,alignItems:"center",justifyContent:"center", }}>
                        {iconViewList[i].component}
                    </View>
                    <Text style={{ fontSize: 15, color: activeTab === i ? topicTrends[topicTrendsNum].style_desc.gradient_start : "#ccc", }} >{v}</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    titleViewStyle: {
        flexDirection: "row",
        alignItems: "center",
        padding: 5,
        paddingLeft: 10,
        paddingRight: 10,
    }
})

export default (props) => {



    const [isDisableTabScroll, setIsDisableTabScroll] = useState(false);

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
            <FullPageHeader style={{}} middleName={"操作记录"} />

            {/* tab标签栏,外层一定是弹性容器（flex:1)才会显示 */}
            <ScrollableTabView
                initialPage={props.route.params.index}
                renderTabBar={() => < CircleTabBar />}
            >
                {dynamicRenderTabPage()}
            </ScrollableTabView>

        </View>

    );
}
