import React from 'react';
import { View, Text, TouchableOpacity, StatusBar, NativeModules,StyleSheet,ImageBackground } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import { screenWidth, topicTrends } from '../../../../../../utils/stylesKits';
import { useSelector } from 'react-redux';
import { selectTopicTrendsNum } from '../../../../../../utils/slice/topicTrendsNumSlice'
import { selectTopicTrends } from '../../../../../../utils/slice/topicTrendsSlice'

import { useNavigation } from '@react-navigation/native';

const statusBarPadFontColor = ["light-content", "dark-content"]
const backgroundImage = require('../../../../../../res/img/rainbow.jpeg');

function TabBar(props) {

    const {
        color,
        fontSize,
        leftIconName,
        leftName,
        middleName,
        rightComponent,
        headerHeight,
        isShowStatusBarPad,
        statusBarPadFontColorIndex,
        statusBarPadBackgroundColor,

        style,
    } = props;

    const topicTrendsNum = useSelector(selectTopicTrendsNum);
    const topicTrends = useSelector(selectTopicTrends);

    const navigation = useNavigation();

    const { goToPage, tabs, activeTab } = props;

    return (
        <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            colors={
                [topicTrends[topicTrendsNum].style_desc.gradient_start,
                topicTrends[topicTrendsNum].style_desc.gradient_end]
            }
            style={{ ...style }}
        >
            <StatusBar backgroundColor="transparent" barStyle={isShowStatusBarPad ? statusBarPadFontColor[statusBarPadFontColorIndex] : "light-content"} translucent={true} hidden={false} />
            <View style={{ height: NativeModules.StatusBarManager.HEIGHT, backgroundColor: isShowStatusBarPad ? statusBarPadBackgroundColor : "transparent", width: screenWidth }}></View>

            <View style={{ position: "relative", alignItems: "center", height: headerHeight, justifyContent: "center" }}>
                <TouchableOpacity
                    onPress={() => { navigation.goBack() }}
                    activeOpacity={0.8} style={{ position: "absolute", left: 15, flexDirection: "row", alignItems: "center" }}
                >
                    <Feather name={leftIconName} size={fontSize} color={color} />
                    <Text style={{ fontSize: fontSize, color: color }}>{leftName}</Text>
                </TouchableOpacity>

                <View style={{ ...styles.titleViewStyle, marginTop: 5, flexDirection: "row", justifyContent: "center" }}>
                    {tabs.map((v, i) =>
                        <TouchableOpacity
                            key={i}
                            onPress={() => {
                                goToPage(i)
                            }}
                            style={{
                                alignItems: "center"
                            }}
                        >
                            <View style={{ padding: 10 }}>
                                <Text style={{ fontSize: 18, color: activeTab === i ? "#fff" : "#eee", }} >{v}</Text>
                            </View>
                            <ImageBackground
                                source={activeTab === i ? backgroundImage : 0}
                                style={{
                                    height: 5,
                                    width: 18 * 2
                                }}
                                imageStyle={{
                                    borderRadius: 10,
                                    resizeMode: "cover",
                                    // opacity: 0.8
                                }}
                            />
                        </TouchableOpacity>
                    )}
                </View>
                <View style={{ position: "absolute", right: 15 }}>
                    {rightComponent(props)}
                </View>
            </View>
        </LinearGradient>
    )
}

TabBar.defaultProps = {
    color: "#eee",
    fontSize: 20,
    leftIconName: "chevron-left",
    leftName: "返回",
    middleName: "",
    rightComponent: (props) => { },
    headerHeight: 50,
    isShowStatusBarPad: false,
    statusBarPadFontColorIndex: 1,
    statusBarPadBackgroundColor: "#fff",

}

export default TabBar;


const styles = StyleSheet.create({
    titleViewStyle: {
        flexDirection: "row",
        alignItems: "center",
        padding: 5,
        paddingLeft: 10,
        paddingRight: 10,
    }
})