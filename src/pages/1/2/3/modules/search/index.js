import React from 'react';
import { View, Text, StatusBar, TouchableOpacity } from 'react-native';
import { useTopicTrends } from '../../utils/hooks';
import InputBox from '../../../../../../utils/components/inputBox';
import { screenWidth } from '../../../../../../utils/stylesKits';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather'
import FullpageHeader2 from '../../../../../../utils/components/fullPageHeader2'

const history = [
    "新网球王子", "overlord", "进击的巨人"
]

const colors = [
    //Magenta品红
    {
        backgroundColor: "#fd9fc7",
        color: "#ef007b",
    },
    // 红色
    {
        backgroundColor: "#fea188",
        color: "#f50c00",
    },
    // 黄色
    {
        backgroundColor: "#fffaab",
        color: "#fff000",
    },
    // 绿色
    {
        backgroundColor: "#c5e7a9",
        color: "#00a536",
    },
    //cyan 青色
    {
        backgroundColor: "#81d1ff",
        color: "#0096dd",
    },
    // 蓝色
    {
        backgroundColor: "#9790c7",
        color: "#21097b",
    },
]

export default (props) => {

    const { topicTrends, topicTrendsNum } = useTopicTrends();

    const renderHistory = () => {
        return <View style={{ flexDirection: "row", flexWrap: 'wrap', }}>
            {history.map((v, i) => {
                return <TouchableOpacity
                    key={i}
                    style={{
                        backgroundColor: "#eee",
                        marginRight: 15,
                        paddingLeft: 5, paddingRight: 5, paddingTop: 3, paddingBottom: 3,
                        justifyContent: "center",
                        borderRadius: 5
                    }}>
                    <Text style={{ color: "#aaa", fontSize: 14 }}>{v}</Text>
                </TouchableOpacity>
            })}
        </View>
    }

    const renderRecommend = () => {
        return <View style={{ flexDirection: "row", flexWrap: 'wrap', }}>
            {history.map((v, i) => {
                let index = parseInt(Math.random() * colors.length);
                return <TouchableOpacity
                    key={i}
                    style={{
                        backgroundColor: colors[index].backgroundColor,
                        marginRight: 15,
                        paddingLeft: 5, paddingRight: 5, paddingTop: 3, paddingBottom: 3,
                        justifyContent: "center",
                        borderRadius: 5
                    }}>
                    <Text style={{ color: colors[index].color, fontSize: 14 }}>{v}</Text>
                </TouchableOpacity>
            })}
        </View>
    }

    return (
        <SafeAreaView style={{ backgroundColor: "#fff", flex: 1 }}>
            <StatusBar backgroundColor="#fff" barStyle="dark-content" translucent={true} hidden={false} />

            <FullpageHeader2 leftName="" fontSize={30} color="#0007" />
            <View style={{ alignItems: "center" }}>
                <InputBox
                    inputPlaceholder="搜索"
                    inputButtonText="go"
                    onPressSubmit={(inputTxt) => {
                        props.navigation.navigate("SearchResult")
                    }}
                    inputColorOpacity="22"
                    inputTopicColor={topicTrends[topicTrendsNum].style_desc.gradient_start}
                    inputWidth={screenWidth - 20}
                    inputHeight={40}
                    inputFontSize={15}
                />
            </View>

            <View style={{ paddingLeft: 12, paddingRight: 12, marginTop: 10 }}>
                {/* 第1行 头部 */}
                <View style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: "flex-end" }}>
                    <View>
                        <Text style={{ fontSize: 22, color: "#000b" }}>搜索历史</Text>
                    </View>
                    <View style={{ flexDirection: 'row', }}>
                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: "center", marginRight: 10 }}
                            onPress={() => {
                            }}
                        >
                            <Feather name='refresh-ccw' size={15} color='#ccc' />
                            <Text style={{ fontSize: 15, color: "#ccc" }}>刷新</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: "center" }}>
                            <Text style={{ fontSize: 15, color: "#ccc" }}>更多</Text>
                            <Feather name='chevron-right' size={15} color='#ccc' />
                        </TouchableOpacity>
                    </View>
                </View>
                {/* 第2行 */}
                {
                    // videoRefresh
                    //     ? <View>
                    //         <ActivityIndicator animating={true}
                    //             color={topicTrends[topicTrendsNum].style_desc.gradient_start}
                    //         />
                    //     </View>
                    //     : <></>
                }
                <View style={{ height: 10 }}></View>
                {renderHistory()}
            </View>

            <View style={{ paddingLeft: 12, paddingRight: 12, marginTop: 10 }}>
                {/* 第1行 头部 */}
                <View style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: "flex-end" }}>
                    <View>
                        <Text style={{ fontSize: 22, color: "#000b" }}>推荐</Text>
                    </View>
                    <View style={{ flexDirection: 'row', }}>
                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: "center", marginRight: 10 }}
                            onPress={() => {
                            }}
                        >
                            <Feather name='refresh-ccw' size={15} color='#ccc' />
                            <Text style={{ fontSize: 15, color: "#ccc" }}>刷新</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: "center" }}>
                            <Text style={{ fontSize: 15, color: "#ccc" }}>更多</Text>
                            <Feather name='chevron-right' size={15} color='#ccc' />
                        </TouchableOpacity>
                    </View>
                </View>
                {/* 第2行 */}
                {
                    // videoRefresh
                    //     ? <View>
                    //         <ActivityIndicator animating={true}
                    //             color={topicTrends[topicTrendsNum].style_desc.gradient_start}
                    //         />
                    //     </View>
                    //     : <></>
                }
                <View style={{ height: 10 }}></View>
                {renderRecommend()}
            </View>

        </SafeAreaView>
    )
}