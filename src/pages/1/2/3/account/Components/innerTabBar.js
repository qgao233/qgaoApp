import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { useSelector } from 'react-redux';
import { selectTopicTrendsNum } from '../../../../../../utils/slice/topicTrendsNumSlice'
import { selectTopicTrends } from '../../../../../../utils/slice/topicTrendsSlice'

const backgroundImage = require('../../../../../../res/img/rainbow.jpeg');

export default (props) => {

    const topicTrendsNum = useSelector(selectTopicTrendsNum);
    const topicTrends = useSelector(selectTopicTrends);

    const { goToPage, tabs, activeTab } = props;
    return (

        <View style={{ backgroundColor: "#fff", flexDirection: "row", justifyContent: "space-between" }}>
            <View style={{ flexDirection: "row",alignItems:"center" }}>
                <Text style={{marginLeft:10,fontSize:18,}}>动态</Text>
                <Text style={{ 
                    marginLeft:10,
                    height:20,fontSize:15,
                    color: "#fff", fontWeight: "bold", paddingLeft: 5, paddingRight: 5, borderRadius: 10, backgroundColor: "#FF496C", }}>9</Text>
            </View>
            <View style={{ ...styles.titleViewStyle, marginTop: 5, flexDirection: "row", justifyContent: "center" }}>
                {tabs.map((v, i) =>
                    <TouchableOpacity
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
                        <View style={{ padding: 10 }}>
                            <Text style={{ fontSize: 18, color: activeTab === i ? topicTrends[topicTrendsNum].style_desc.gradient_start : "#ccc", }} >{v}</Text>
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
                                opacity: 0.5
                            }}
                        />
                    </TouchableOpacity>
                )}
            </View>
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