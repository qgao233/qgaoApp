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


    return (
        <View style={{ flex: 1, backgroundColor: "#eee" }}>
            {/* <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent={true} hidden={false} /> */}
            {/* 第1层 返回头部 */}
            <FullPageHeader style={{}} middleName={"建议&bug 反馈"}  />
            {/* 第2层 主题列表 */}
            <ScrollView overScrollMode='always'>
            </ScrollView>
        </View>
    )
}
