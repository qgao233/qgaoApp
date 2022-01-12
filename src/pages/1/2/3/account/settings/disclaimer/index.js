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

export default (props) => {


    return (
        <View style={{ flex: 1, backgroundColor: "#eee" }}>
            {/* <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent={true} hidden={false} /> */}
            {/* 第1层 返回头部 */}
            <FullPageHeader style={{}} middleName={"免责声明"} />
            {/* 第2层 主题列表 */}
            <ScrollView overScrollMode='always'>
                <View style={{ padding: 5 }}>
                    <Text style={{ paddingTop: 10, paddingBottom: 10, }}>你可以选择不使用该软件，但一旦使用了，那就表示你认可本声明的全部内容。</Text>
                    <Text style={{ paddingTop: 10, paddingBottom: 10, }}>该处所有视频均来自于互联网，只支持在线观看，不支持随意下载、转载、流转以及任何不法的商业使用行为，一经发现，平台将会严肃处理，如有任何侵犯到第三方权益的，可通过邮件方式反馈给我，我会及时进行处理。</Text>
                    <Text style={{ paddingTop: 10, paddingBottom: 10, color: "red" }}>注意：</Text>
                    <Text style={{ paddingTop: 10, paddingBottom: 10, }}>退出全屏时，请一定点击屏幕上的“缩小全屏”按钮，否则将会返回上一页，并同时保持横屏方向。</Text>
                </View>
            </ScrollView>
        </View>
    )
}
