import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StatusBar, TextInput } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { screenHeight, screenWidth } from '../../../../../../utils/stylesKits';
import { Card } from 'react-native-shadow-cards';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';
import { selectTopicTrendsNum } from '../../../../../../utils/slice/topicTrendsNumSlice'
import { selectTopicTrends } from '../../../../../../utils/slice/topicTrendsSlice'

const imgSource = require("../../../../../../res/img/back.jpg")
const headImgSource = require("../../../../../../res/img/girl.jpg")

export default (props) => {

    const topicTrendsNum = useSelector(selectTopicTrendsNum);
    const topicTrends = useSelector(selectTopicTrends);

    const { navigation } = props;

    const [isShowMainBody, setIsShowMainBody] = useState(false);//default false

    const renderRegisterOptions = () => {
        return (
            <View style={{ position: "relative", flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-evenly" }}>
                <StatusBar backgroundColor="transparent" barStyle="light-content" translucent={true} hidden={true} />

                <Image source={imgSource} style={{ position: "absolute", left: 0, top: 0, width: screenWidth, height: screenHeight }} />

                <TouchableOpacity
                    onPress={() => {
                        setRegisterType("mail");
                        setIsShowMainBody(true);
                    }}
                    activeOpacity={0.9}
                    style={{
                        alignItems: "center", justifyContent: "center",
                    }}>
                    <View style={{
                        alignItems: "center", justifyContent: "center",
                        width: 100, height: 100, borderRadius: 50,
                        backgroundColor: "#DD5508",
                        marginBottom: 10,

                    }}>
                        <Feather name='mail' size={40} color='#fcf5ef' />
                    </View>
                    <Card
                        cornerRadius={0} elevation={5} opacity={0.5}
                        style={{ width: "auto", borderRadius: 100, backgroundColor: "transparent" }}>
                        <Text style={{ fontSize: 20, color: '#fcf5ef', fontWeight: "bold" }}>邮箱注册</Text>
                    </Card>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => {
                        setRegisterType("phone");
                        setIsShowMainBody(true);
                    }}
                    activeOpacity={0.9}
                    style={{
                        alignItems: "center", justifyContent: "center",
                    }}>
                    <View style={{
                        alignItems: "center", justifyContent: "center",
                        width: 100, height: 100, borderRadius: 50,
                        backgroundColor: "#0C9EF2",
                        marginBottom: 10,

                    }}>
                        <Feather name='phone' size={40} color='#fcf5ef' />
                    </View>
                    <Card
                        cornerRadius={0} elevation={5} opacity={0.5}
                        style={{ width: "auto", borderRadius: 100, backgroundColor: "transparent" }}>
                        <Text style={{ fontSize: 20, color: '#fcf5ef', fontWeight: "bold" }}>手机注册</Text>
                    </Card>

                </TouchableOpacity>
            </View>
        );
    }


    const [registerType, setRegisterType] = useState("");//default ""

    const [mail, setMail] = useState("");
    const [phone, setPhone] = useState("");

    const renderRegisterByMail = () => {

        return (
            <View style={{backgroundColor:"#fff",flex:1}}>
                <StatusBar backgroundColor="transparent" barStyle="light-content" translucent={true} hidden={false} />
                <Image source={headImgSource} style={{ width: screenWidth, height: screenHeight / 3.5, resizeMode: "cover" }} />

                <View style={{ padding: 30, paddingTop: 20, paddingBottom: 20 }}>
                    <Text style={{ fontSize: 20, color: "#000b" }}>邮箱注册</Text>
                </View>
                <View style={{ alignItems: "center", paddingBottom: 20 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", borderBottomWidth: 1, borderBottomColor: "#ccc" }}>
                        <View style={{ padding: 10 }}>
                            <Feather name='mail' size={20} color='#ccc' />
                        </View>
                        <TextInput style={{ backgroundColor: "transparent", width: screenWidth - 100, padding: 5, fontSize: 18 }}
                            placeholder='请输入邮箱'
                            onSubmitEditing={() => { }}
                            onChangeText={(value) => setMail(value)}
                            value={mail}
                            multiline={false}
                        ></TextInput>
                    </View>
                </View>
                <View style={{ alignItems: "center", paddingTop: 10 }}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => { navigation.navigate("ReceiveCode", { registerType: "mail",mail:mail }) }}
                    >
                        <LinearGradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            colors={[topicTrends[topicTrendsNum].style_desc.gradient_start,
                            topicTrends[topicTrendsNum].style_desc.gradient_end]}
                            style={{
                                alignItems: "center", justifyContent: "center", borderRadius: 10,
                                padding: 15,
                                width: screenWidth / 1.5,
                                borderRadius: 30
                            }}
                        >
                            <Text style={{ fontSize: 18, color: "#fcf5ef" }}>获取验证码</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    const renderRegisterByPhone = () => {
        return (
            <View>
                <StatusBar backgroundColor="transparent" barStyle="light-content" translucent={true} hidden={false} />
                <Image source={headImgSource} style={{ width: screenWidth, height: screenHeight / 3.5, resizeMode: "cover" }} />

                <View style={{ padding: 30, paddingTop: 20, paddingBottom: 20 }}>
                    <Text style={{ fontSize: 20, color: "#000b" }}>手机注册</Text>
                </View>
                <View style={{ alignItems: "center", paddingBottom: 20 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", borderBottomWidth: 1, borderBottomColor: "#ccc" }}>
                        <View style={{ padding: 10 }}>
                            <Feather name='phone' size={20} color='#ccc' />
                        </View>
                        <TextInput style={{ backgroundColor: "transparent", width: screenWidth - 100, padding: 5, fontSize: 18 }}
                            placeholder='请输入手机号码'
                            onSubmitEditing={() => { }}
                            onChangeText={(value) => setPhone(value)}
                            value={phone}
                            multiline={false}
                        ></TextInput>
                    </View>
                </View>
                <View style={{ alignItems: "center", paddingTop: 10 }}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => { navigation.navigate("ReceiveCode", { registerType: "phone",phone:phone }) }}
                    >
                        <LinearGradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            colors={[topicTrends[topicTrendsNum].style_desc.gradient_start,
                            topicTrends[topicTrendsNum].style_desc.gradient_end]}
                            style={{
                                alignItems: "center", justifyContent: "center", borderRadius: 10,
                                padding: 15,
                                width: screenWidth / 1.5,
                                borderRadius: 30
                            }}
                        >
                            <Text style={{ fontSize: 18, color: "#fcf5ef" }}>获取验证码</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    const renderRegister = () => {
        return (
            <View style={{ flex: 1 }}>

                {
                    registerType == "mail"
                        ? renderRegisterByMail()
                        : renderRegisterByPhone()
                }
            </View>

        );

    }

    return (
        isShowMainBody
            ? renderRegister()
            : renderRegisterOptions()
    );
}