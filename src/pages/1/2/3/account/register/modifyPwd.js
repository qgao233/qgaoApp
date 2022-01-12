import React, { useState } from 'react';
import { SafeAreaView, View, Text, StatusBar, Image, TouchableOpacity, TextInput, StyleSheet, Vibration } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { screenHeight, screenWidth, statusBarHeight } from '../../../../../../utils/stylesKits';
import { useTopicTrends } from '../../utils/hooks';
import Feather from 'react-native-vector-icons/Feather'

const headImgSource = require("../../../../../../res/img/girl.jpg")


export default (props) => {

    const { topicTrends, topicTrendsNum } = useTopicTrends();

    const [pwd, setPwd] = useState("");
    const [rePwd, setRePwd] = useState("");
    const [secureTextEntry, setSecureTextEntry] = useState(true);

    const {navigation} = props;

    const validatePwd = ()=>{
        //验证密码，存储并跳转
        navigation.navigate("ModifyInfo");
    }

    return (
        <SafeAreaView style={{backgroundColor:"#fff",flex:1}}>
            <StatusBar backgroundColor="transparent" barStyle="light-content" translucent={true} hidden={false} />
            <Image source={headImgSource} style={{ width: screenWidth, height: screenHeight / 3.5, resizeMode: "cover" }} />

            <View style={{ padding: 30, paddingTop: 20, paddingBottom: 0, flexDirection: "row", justifyContent: "space-between" }}>
                <View>
                    <Text style={{ fontSize: 20, color: "#000b" }}>设置密码</Text>
                    <Text style={{ fontSize: 15, color: "#0005", paddingTop: 10, paddingBottom: 10 }}>提高安全性</Text>
                </View>
                <TouchableOpacity 
                onPress={()=>{validatePwd()}}
                activeOpacity={0.6}>
                    <Text style={{ fontSize: 15, color: "#0005",}}>跳过</Text>
                </TouchableOpacity>
            </View>

            <View style={{ padding: 30, paddingTop: 10, paddingBottom: 10 }}>
                <Text style={{ color: "#000b", fontSize: 18 }}>新密码</Text>
            </View>
            <View style={{
                flexDirection: "row", alignItems: "center", justifyContent: "center",
                padding: 30, paddingTop: 10, paddingBottom: 10
            }}>
                <TextInput
                    style={{ backgroundColor: "transparent", width: screenWidth - 100, padding: 5, fontSize: 18 }}
                    placeholder='请输入新密码'
                    onSubmitEditing={() => { }}
                    onChangeText={(value) => setPwd(value)}
                    value={pwd}
                    multiline={false}
                    secureTextEntry={secureTextEntry}
                    autoComplete="off"
                />
                <TouchableOpacity
                    onPress={() => {
                        setSecureTextEntry(pre => !pre);
                    }}
                    activeOpacity={0.7}
                    style={{ padding: 10 }}>
                    <Feather name={secureTextEntry ? "eye-off" : 'eye'} size={20} color='#ccc' />
                </TouchableOpacity>
            </View>
            <View style={{ padding: 30, paddingTop: 10, paddingBottom: 10 }}>
                <Text style={{ color: "#000b", fontSize: 18 }}>确认密码</Text>
            </View>
            <View style={{
                flexDirection: "row", alignItems: "center", justifyContent: "center",
                padding: 30, paddingTop: 10, paddingBottom: 10
            }}>
                <TextInput
                    style={{ backgroundColor: "transparent", width: screenWidth - 100, padding: 5, fontSize: 18 }}
                    placeholder='再次输入密码'
                    onSubmitEditing={() => { }}
                    onChangeText={(value) => setRePwd(value)}
                    value={rePwd}
                    multiline={false}
                    secureTextEntry={secureTextEntry}
                    autoComplete="off"
                />
                <TouchableOpacity
                    onPress={() => {
                        setSecureTextEntry(pre => !pre);
                    }}
                    activeOpacity={0.7}
                    style={{ padding: 10 }}>
                    <Feather name={secureTextEntry ? "eye-off" : 'eye'} size={20} color='#ccc' />
                </TouchableOpacity>
            </View>
            <View style={{ alignItems: "center", paddingTop: 20 }}>
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                        validatePwd();
                    }}
                >
                    <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        colors={[topicTrends[topicTrendsNum].style_desc.gradient_start,
                        topicTrends[topicTrendsNum].style_desc.gradient_end]}
                        style={{
                            alignItems: "center", borderRadius: 10,
                            padding: 15,
                            width: screenWidth / 1.5,
                            borderRadius: 30,
                            flexDirection: "row",
                            justifyContent: "center", alignItems: "center"
                        }}
                    >
                        <Text style={{ fontSize: 18, color: "#fcf5ef" }}>确定</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}