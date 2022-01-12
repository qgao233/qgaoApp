import React from 'react';
import { View, Text, StatusBar, TouchableOpacity, Image, ScrollView } from 'react-native';
import FullPageHeader from '../../../../../../../utils/components/fullPageHeader';
import Feather from 'react-native-vector-icons/Feather'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useDispatch, useSelector } from 'react-redux';
import { selectTopicTrends } from '../../../../../../../utils/slice/topicTrendsSlice'
import { selectTopicTrendsNum, changeTopicTrendsNum } from '../../../../../../../utils/slice/topicTrendsNumSlice'
import { screenWidth } from '../../../../../../../utils/stylesKits';

export default (props) => {


    return (
        <View style={{ flex: 1, backgroundColor: "#eee" }}>
            {/* <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent={true} hidden={false} /> */}
            {/* 第1层 返回头部 */}
            <FullPageHeader style={{}} middleName={"关于我"} />
            {/* 第2层 主题列表 */}
            <ScrollView overScrollMode='always'>
                <View style={{ padding: 5, alignItems: "center" }}>
                    {/* creator信息 */}
                    <Image style={{ width: screenWidth / 2, height: screenWidth / 2, borderRadius: screenWidth / 4 }} source={require("../../../../../../../res/img/mine.jpg")} />
                    <View style={{ flexDirection: "row", paddingTop: 20, paddingBottom: 20 }}>
                        <Text style={{ paddingRight: 84 }}>Creator:</Text>
                        <Text style={{ paddingLeft: 10 }}>qgao233</Text>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                        <Text style={{ paddingRight: 10 }}>Contact:</Text>
                        <Text style={{ paddingLeft: 10 }}>qgao233@163.com</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}
