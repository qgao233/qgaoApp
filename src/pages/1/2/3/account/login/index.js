import React, { useState } from 'react';
import { SafeAreaView, View, Text, StatusBar, Image, TouchableOpacity, TextInput, StyleSheet, Vibration } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { screenHeight, screenWidth, statusBarHeight } from '../../../../../../utils/stylesKits';
import { useTopicTrends } from '../../utils/hooks';
import Feather from 'react-native-vector-icons/Feather'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import { useDispatch } from 'react-redux';
import { changeLoginStatus, selectLoginStatus } from '../../utils/slice/loginStatusSlice'


const headImgSource = require("../../../../../../res/img/girl.jpg")


const TabBar = (props) => {

    const { topicTrends, topicTrendsNum } = useTopicTrends();

    const { goToPage, tabs, activeTab } = props;
    return (

        <View style={{ backgroundColor: "#fff", flexDirection: "row", justifyContent: "center" }}>
            <View style={{ ...styles.titleViewStyle, marginTop: 5, flexDirection: "row", justifyContent: "center" }}>
                {tabs.map((v, i) => {
                    return <View key={i} style={{flexDirection: "row", justifyContent: "center",alignItems:"center"}}>
                        {i > 0
                            ? <View style={{ height: 18, width: 1, backgroundColor: "#ccc" }}></View>
                            : <></>
                        }
                        <TouchableOpacity
                            onPress={() => {
                                goToPage(i)
                            }}
                            style={{
                                alignItems: "center"
                            }}
                        >
                            <View style={{ padding: 10 }}>
                                <Text style={{ fontSize: 18, color: activeTab === i ? topicTrends[topicTrendsNum].style_desc.gradient_start : "#ccc", }} >{v}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                }

                )}
            </View>
        </View>


    );
}

export default (props) => {

    const { topicTrends, topicTrendsNum } = useTopicTrends();

    const dispatch = useDispatch();

    const { navigation } = props;

    const [mail, setMail] = useState("")
    const [mailPwd, setMailPwd] = useState("");
    const [mailSecureTextEntry, setMailSecureTextEntry] = useState(true);

    const [phone, setPhone] = useState("");
    const [phonePwd, setPhonePwd] = useState("");
    const [phoneSecureTextEntry, setPhoneSecureTextEntry] = useState(true);

    const authenticateUser = (type)=>{
        if(type=="mail"){

        }else{

        }
        dispatch(changeLoginStatus(true))
        navigation.goBack();
    }

    const mailLogin = (label) => {
        return (
            <View tabLabel={label}>
                <View style={{
                    flexDirection: "row", alignItems: "center", justifyContent: "center",
                    padding: 30, paddingTop: 10, paddingBottom: 10,
                }}>
                    <TextInput
                        style={{ backgroundColor: "transparent", width: screenWidth - 100, padding: 5, fontSize: 18 }}
                        placeholder='邮箱'
                        onSubmitEditing={() => { }}
                        onChangeText={(value) => setMail(value)}
                        value={mail}
                        multiline={false}
                        autoComplete="off"
                    />
                    <View style={{ padding: 10 }}>
                        <Feather name="mail" size={20} color='#ccc' />
                    </View>
                </View>
                <View style={{
                    flexDirection: "row", alignItems: "center", justifyContent: "center",
                    padding: 30, paddingTop: 10, paddingBottom: 10
                }}>
                    <TextInput
                        style={{ backgroundColor: "transparent", width: screenWidth - 100, padding: 5, fontSize: 18 }}
                        placeholder='密码'
                        onSubmitEditing={() => { }}
                        onChangeText={(value) => setMailPwd(value)}
                        value={mailPwd}
                        multiline={false}
                        secureTextEntry={mailSecureTextEntry}
                        autoComplete="off"
                    />
                    <TouchableOpacity
                        onPress={() => {
                            setMailSecureTextEntry(pre => !pre);
                        }}
                        activeOpacity={0.7}
                        style={{ padding: 10 }}>
                        <Feather name={mailSecureTextEntry ? "eye-off" : 'eye'} size={20} color='#ccc' />
                    </TouchableOpacity>
                </View>
                <View style={{ alignItems: "center", marginTop: 20 }}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => {
                            authenticateUser("mail");
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
                            <Text style={{ fontSize: 18, color: "#fcf5ef" }}>登录</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    const phoneLogin = (label) => {
        return (
            <View tabLabel={label}>
                <View style={{
                    flexDirection: "row", alignItems: "center", justifyContent: "center",
                    padding: 30, paddingTop: 10, paddingBottom: 10,
                }}>
                    <TextInput
                        style={{ backgroundColor: "transparent", width: screenWidth - 100, padding: 5, fontSize: 18 }}
                        placeholder='手机号码'
                        onSubmitEditing={() => { }}
                        onChangeText={(value) => setPhone(value)}
                        value={phone}
                        multiline={false}
                        autoComplete="off"
                    />
                    <View style={{ padding: 10 }}>
                        <Feather name="phone" size={20} color='#ccc' />
                    </View>
                </View>
                <View style={{
                    flexDirection: "row", alignItems: "center", justifyContent: "center",
                    padding: 30, paddingTop: 10, paddingBottom: 10
                }}>
                    <TextInput
                        style={{ backgroundColor: "transparent", width: screenWidth - 100, padding: 5, fontSize: 18 }}
                        placeholder='密码'
                        onSubmitEditing={() => { }}
                        onChangeText={(value) => setPhonePwd(value)}
                        value={phonePwd}
                        multiline={false}
                        secureTextEntry={phoneSecureTextEntry}
                        autoComplete="off"
                    />
                    <TouchableOpacity
                        onPress={() => {
                            setPhoneSecureTextEntry(pre => !pre);
                        }}
                        activeOpacity={0.7}
                        style={{ padding: 10 }}>
                        <Feather name={phoneSecureTextEntry ? "eye-off" : 'eye'} size={20} color='#ccc' />
                    </TouchableOpacity>
                </View>
                <View style={{ alignItems: "center", marginTop: 20 }}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => {
                            authenticateUser("phone");
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
                            <Text style={{ fontSize: 18, color: "#fcf5ef" }}>登录</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    return (
        <SafeAreaView style={{ backgroundColor: "#fff", flex: 1 }}>
            <StatusBar backgroundColor="transparent" barStyle="light-content" translucent={true} hidden={false} />
            <Image source={headImgSource} style={{ width: screenWidth, height: screenHeight / 1.5, resizeMode: "cover" }} />

            {/* tab标签栏,外层一定是弹性容器（flex:1)才会显示 */}
            <ScrollableTabView
                initialPage={props.route.params ? props.route.params.index : 0}
                renderTabBar={() => < TabBar />}
            >
                {mailLogin("邮箱登录")}
                {phoneLogin("手机登录")}
            </ScrollableTabView>

        </SafeAreaView>
    )
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