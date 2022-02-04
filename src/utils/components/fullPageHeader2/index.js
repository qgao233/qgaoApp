import React from 'react';
import { View, Text, TouchableOpacity, StatusBar, NativeModules } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { screenWidth, statusBarHeight } from '../../../utils/stylesKits';
import { useSelector } from 'react-redux';
import { selectTopicTrendsNum } from '../../../utils/slice/topicTrendsNumSlice'
import { selectTopicTrends } from '../../../utils/slice/topicTrendsSlice'

import { useNavigation } from '@react-navigation/native';

const statusBarPadFontColor = ["light-content", "dark-content"]

function fullPageHeader(props) {

    const {
        color,
        fontSize,
        leftIconName,
        leftName,
        middleName,
        rightComponent,
        headerHeight,

        style,

    } = props;

    const topicTrendsNum = useSelector(selectTopicTrendsNum);
    const topicTrends = useSelector(selectTopicTrends);

    const navigation = useNavigation();

    return (
        <View style={{
            height: headerHeight, flexDirection: "row", justifyContent: "center", alignItems: "center", ...style,
            position: "relative",zIndex:2
        }}>
            <TouchableOpacity
                onPress={() => { navigation.goBack() }}
                activeOpacity={0.8} style={{ position: "absolute",zIndex:3, left: 10, flexDirection: "row", alignItems: "center" }}
            >
                <Feather name={leftIconName} size={fontSize} color={color} />
                <Text style={{ fontSize: fontSize, color: color }}>{leftName}</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: fontSize, color: color }}>{middleName}</Text>
            <View style={{ position: "absolute", right: 10, }}>
                {rightComponent?rightComponent(props):<></>}
            </View>
        </View>
    )
}

fullPageHeader.defaultProps = {
    color: "#eee",
    fontSize: 20,
    leftIconName: "chevron-left",
    leftName: "返回",
    middleName: "",
    headerHeight: statusBarHeight,
}

export default fullPageHeader;