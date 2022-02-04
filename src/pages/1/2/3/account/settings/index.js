import React from 'react';
import { View, Text, StatusBar, TouchableOpacity, Image, ScrollView, Vibration } from 'react-native';
import FullPageHeader from '../../../../../../utils/components/fullPageHeader';
import Feather from 'react-native-vector-icons/Feather'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useDispatch, useSelector } from 'react-redux';
import { changeLoginStatus, selectLoginStatus } from '../../utils/slice/loginStatusSlice'
import { SafeAreaView } from 'react-native-safe-area-context';


export default (props) => {

    const dispatch = useDispatch();
    const loginStatus = useSelector(selectLoginStatus)

    return (
        <SafeAreaView
            edges={['left', 'right']}
            style={{ flex: 1, backgroundColor: "#eee" }}>
            {/* <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent={true} hidden={false} /> */}
            {/* 第1层 返回头部 */}
            <FullPageHeader style={{}} middleName="设置" rightComponent={(props) =>
                <TouchableOpacity activeOpacity={0.8}>
                    <Image style={{ width: 40, height: 40, borderRadius: 20 }} source={require("../../../../../../res/img/photo.jpg")} />
                </TouchableOpacity>
            } />
            {/* 第2层 设置列表 */}
            <ScrollView overScrollMode='always'>
                <View style={{ padding: 5, backgroundColor: "#eee", }}>
                    <TouchableOpacity
                        onPress={() => { props.navigation.navigate("ToggleTopic") }}
                        activeOpacity={0.6}
                        style={{
                            borderRadius: 10,
                            flexDirection: "row", alignItems: "center", justifyContent: "space-between",
                            backgroundColor: "#fff", paddingTop: 15, paddingBottom: 15, padding: 20, paddingRight: 20
                        }}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <AntDesign name='skin' size={25} color='#000b' />
                            <Text style={{ fontSize: 16, paddingLeft: 20, color: "#000b" }}>切换主题</Text>
                        </View>
                        <View>
                            <FontAwesomeIcon name='angle-right' size={25} color='#000b' />
                        </View>
                    </TouchableOpacity>
                    <View style={{ height: 5, backgroundColor: "transparent" }}></View>

                    <TouchableOpacity activeOpacity={0.6} style={{
                        borderRadius: 10,
                        borderTopColor: "#eee", borderTopWidth: 0.5,
                        flexDirection: "row", alignItems: "center", justifyContent: "space-between",
                        backgroundColor: "#fff", paddingTop: 15, paddingBottom: 15, padding: 20, paddingRight: 20
                    }}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Feather name='trash-2' size={25} color='#000b' />
                            <Text style={{ fontSize: 16, paddingLeft: 20, color: "#000b" }}>清除缓存</Text>
                        </View>
                        <View>
                            <FontAwesomeIcon name='angle-right' size={25} color='#000b' />
                        </View>
                    </TouchableOpacity>

                    <View style={{ height: 5, backgroundColor: "transparent" }}></View>
                    <TouchableOpacity
                        onPress={() => { props.navigation.navigate("Suggestion") }}
                        activeOpacity={0.6}
                        style={{
                            borderTopLeftRadius: 10, borderTopRightRadius: 10,
                            flexDirection: "row", alignItems: "center", justifyContent: "space-between",
                            backgroundColor: "#fff", paddingTop: 15, paddingBottom: 15, padding: 20, paddingRight: 20
                        }}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Feather name='edit' size={25} color='#000b' />
                            <Text style={{ fontSize: 16, paddingLeft: 20, color: "#000b" }}>{"建议&bug 反馈"}</Text>
                        </View>
                        <View>
                            <FontAwesomeIcon name='angle-right' size={25} color='#000b' />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => { props.navigation.navigate("Disclaimer") }}

                        activeOpacity={0.6}
                        style={{
                            borderTopColor: "#eee", borderTopWidth: 0.5,
                            flexDirection: "row", alignItems: "center", justifyContent: "space-between",
                            backgroundColor: "#fff", paddingTop: 15, paddingBottom: 15, padding: 20, paddingRight: 20
                        }}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <MaterialCommunityIcons name='shield-check-outline' size={25} color='#000b' />
                            <Text style={{ fontSize: 16, paddingLeft: 20, color: "#000b" }}>免责声明</Text>
                        </View>
                        <View>
                            <FontAwesomeIcon name='angle-right' size={25} color='#000b' />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => { props.navigation.navigate("AboutMe") }}

                        activeOpacity={0.6}
                        style={{
                            borderBottomLeftRadius: 10, borderBottomRightRadius: 10,
                            borderTopColor: "#eee", borderTopWidth: 0.5,
                            flexDirection: "row", alignItems: "center", justifyContent: "space-between",
                            backgroundColor: "#fff", paddingTop: 15, paddingBottom: 15, padding: 20, paddingRight: 20
                        }}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Feather name='info' size={25} color='#000b' />
                            <Text style={{ fontSize: 16, paddingLeft: 20, color: "#000b" }}>关于我</Text>
                        </View>
                        <View>
                            <FontAwesomeIcon name='angle-right' size={25} color='#000b' />
                        </View>
                    </TouchableOpacity>

                    <View style={{ height: 5, backgroundColor: "transparent" }}></View>

                    {
                        loginStatus
                            ? <TouchableOpacity
                                onPress={() => {
                                    Vibration.vibrate([0, 50], false);//震动提示
                                    dispatch(changeLoginStatus(false))
                                    props.navigation.goBack();
                                }}

                                activeOpacity={0.6}
                                style={{
                                    borderRadius: 10,
                                    borderTopColor: "#eee", borderTopWidth: 0.5,
                                    flexDirection: "row", alignItems: "center", justifyContent: "center",
                                    backgroundColor: "#fff", paddingTop: 15, paddingBottom: 15, padding: 20, paddingRight: 20
                                }}>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Feather name='alert-circle' size={25} color='#FF496C' />
                                    <Text style={{ fontSize: 16, paddingLeft: 20, color: "#FF496C" }}>退出登录</Text>
                                </View>
                            </TouchableOpacity>
                            : <></>
                    }

                </View>
            </ScrollView>
        </SafeAreaView>
    )
}
