import React from 'react';
import { View, Text, StatusBar, TouchableOpacity, Image, ScrollView } from 'react-native';
import FullPageHeader from '../../../../../../../utils/components/fullPageHeader';
import Feather from 'react-native-vector-icons/Feather'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useDispatch, useSelector } from 'react-redux';
import { selectTopicTrends } from '../../../../../../../utils/slice/topicTrendsSlice'
import { selectTopicTrendsNum,changeTopicTrendsNum } from '../../../../../../../utils/slice/topicTrendsNumSlice'

export default (props) => {

    const topicTrends = useSelector(selectTopicTrends);
    const topicTrendsNum = useSelector(selectTopicTrendsNum);

    const dispatch = useDispatch();

    return (
        <View style={{ flex: 1, backgroundColor: "#eee" }}>
            {/* <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent={true} hidden={false} /> */}
            {/* 第1层 返回头部 */}
            <FullPageHeader style={{}} middleName="切换主题" rightComponent={(props) =>
                <TouchableOpacity activeOpacity={0.8}>
                    <Text style={{ fontSize: props.fontSize, color: props.color }}>新增</Text>
                </TouchableOpacity>
            } />
            {/* 第2层 主题列表 */}
            <ScrollView overScrollMode='always'>
                <View style={{ padding: 5, backgroundColor: "#eee", }}>

                    {topicTrends.map((v, i) => {
                        return (
                            <>
                                <TouchableOpacity
                                    key={i}
                                    onPress={() => { dispatch(changeTopicTrendsNum(i)) }}
                                    activeOpacity={0.6}
                                    style={{
                                        borderRadius: 10,
                                        flexDirection: "row", alignItems: "center", justifyContent: "space-between",
                                        backgroundColor: "#fff", paddingTop: 15, paddingBottom: 15, padding: 20, paddingRight: 20
                                    }}>
                                    <View style={{ flexDirection: "row" }}>
                                        <View style={{ width: 25, height: 25, borderRadius: 12.5, backgroundColor: v.style_desc.gradient_start }}></View>
                                        <Text style={{ fontSize: 16, paddingLeft: 20, color: "#000b" }}>{v.style_name}</Text>
                                    </View>
                                    <View>
                                        {
                                            i==topicTrendsNum
                                            ?<FontAwesomeIcon name='toggle-on' size={25} color={topicTrends[topicTrendsNum].style_desc.gradient_start} />
                                            :<FontAwesomeIcon name='toggle-off' size={25} color="#eee" />
                                        }
                                    </View>
                                </TouchableOpacity>
                                <View style={{ height: 5, backgroundColor: "transparent" }}></View>
                            </>
                        );
                    })}



                </View>
            </ScrollView>
        </View>
    )
}
