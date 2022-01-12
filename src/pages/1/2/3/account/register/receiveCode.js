import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, View, Text, StatusBar, Image, TouchableOpacity, StyleSheet, Vibration } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';
import { selectTopicTrendsNum } from '../../../../../../utils/slice/topicTrendsNumSlice'
import { selectTopicTrends } from '../../../../../../utils/slice/topicTrendsSlice'
import { screenHeight, screenWidth } from '../../../../../../utils/stylesKits';
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
} from 'react-native-confirmation-code-field';


const headImgSource = require("../../../../../../res/img/girl.jpg")
const CELL_COUNT = 6;

const countdownTime = 5;

export default (props) => {

    const topicTrendsNum = useSelector(selectTopicTrendsNum);
    const topicTrends = useSelector(selectTopicTrends);

    const [value, setValue] = useState('');//验证码组件bug，只能命名为value，
    const ref = useBlurOnFulfill({ value: value, cellCount: CELL_COUNT });
    const [codeProps, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });
    const customFocusCellStyle = {
        borderBottomColor: topicTrends[topicTrendsNum].style_desc.gradient_start,
    }

    let { mail, phone, registerType } = props.route ? props.route.params : {};
    registerType = !registerType ? "mail" : registerType;
    mail = mail == "" || !mail ? "qgao233@gmail.com" : mail;
    phone = phone == "" || !phone? 12345678910 : phone;

    const [isCountDownShow, setIsCountDownShow] = useState(true);
    const [countdown, setCountdown] = useState(countdownTime);

    const timer = useRef(null);

    const startCountdown = () => {
        timer.current = setInterval(() => {
            setCountdown(pre => {
                pre--;
                if (pre <= 0) {
                    setIsCountDownShow(false);
                    clearInterval(timer.current);
                    return 0;
                }
                return pre;
            });

        }, 1000);
    }

    const resendMailCode = () => {
        if (countdown <= 0) {
            setCountdown(countdownTime);
            setIsCountDownShow(true);
            startCountdown();
        } else {
            Vibration.vibrate([0, 50], false);//震动提示
        }
    }

    const resendPhoneCode = () => {
        if (countdown <= 0) {
            setCountdown(countdownTime);
            setIsCountDownShow(true);
            startCountdown();
        } else {
            Vibration.vibrate([0, 50], false);//震动提示
        }
    }

    useEffect(() => {
        startCountdown();
    }, [])

    const {navigation} = props;
    
    const validateMailCode = (value)=>{
        //todo 验证并登录，然后跳转
        navigation.navigate("ModifyPwd");
    }

    const validatePhoneCode = (value)=>{
        //todo 验证并登录，然后跳转
        navigation.navigate("ModifyPwd");
    }

    const renderMailCode = () => {
        return <SafeAreaView style={{backgroundColor:"#fff",flex:1}}>
            <StatusBar backgroundColor="transparent" barStyle="light-content" translucent={true} hidden={false} />
            <Image source={headImgSource} style={{ width: screenWidth, height: screenHeight / 3.5, resizeMode: "cover" }} />

            <View style={{ padding: 30, paddingTop: 20, paddingBottom: 0 }}>
                <Text style={{ fontSize: 20, color: "#000b" }}>请输入6位验证码</Text>
            </View>
            <View style={{ padding: 30, paddingTop: 10, paddingBottom: 10 }}>
                <Text style={{ fontSize: 15, color: "#0005" }}>已发至：{mail}</Text>
            </View>
            <View style={{ padding: 30, paddingTop: 10, paddingBottom: 10 }}>

                <CodeField
                    ref={ref}
                    {...codeProps}
                    // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
                    value={value}
                    onChangeText={val => setValue(val)}
                    cellCount={CELL_COUNT}
                    rootStyle={styles.codeFieldRoot}
                    keyboardType="number-pad"
                    textContentType="oneTimeCode"
                    onBlur={() => { validateMailCode(value) }}
                    renderCell={({ index, symbol, isFocused }) => (
                        <Text
                            key={index}
                            style={[styles.cell, isFocused && styles.focusCell && customFocusCellStyle]}
                            onLayout={getCellOnLayoutHandler(index)}>
                            {symbol || (isFocused ? <Cursor /> : null)}
                        </Text>
                    )}
                />
            </View>

            <View style={{ alignItems: "center", paddingTop: 10 }}>
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                        resendMailCode();
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
                        <Text style={{ fontSize: 18, color: "#fcf5ef" }}>重新获取</Text>
                        {
                            isCountDownShow
                                ? <Text style={{ fontSize: 18, color: "#fcf5ef" }}> ({countdown}s)</Text>
                                : <></>
                        }
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    }

    const renderPhoneCode = () => {
        return <SafeAreaView style={{backgroundColor:"#fff",flex:1}}>
            <StatusBar backgroundColor="transparent" barStyle="light-content" translucent={true} hidden={false} />
            <Image source={headImgSource} style={{ width: screenWidth, height: screenHeight / 3.5, resizeMode: "cover" }} />

            <View style={{ padding: 30, paddingTop: 20, paddingBottom: 0 }}>
                <Text style={{ fontSize: 20, color: "#000b" }}>请输入6位验证码</Text>
            </View>
            <View style={{ padding: 30, paddingTop: 10, paddingBottom: 10 }}>
                <Text style={{ fontSize: 15, color: "#0005" }}>已发至：+86 {phone}</Text>
            </View>
            <View style={{ padding: 30, paddingTop: 10, paddingBottom: 10 }}>

                <CodeField
                    ref={ref}
                    {...codeProps}
                    // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
                    value={value}
                    onChangeText={val => setValue(val)}
                    cellCount={CELL_COUNT}
                    rootStyle={styles.codeFieldRoot}
                    keyboardType="number-pad"
                    textContentType="oneTimeCode"
                    onBlur={() => { validatePhoneCode(value) }}
                    renderCell={({ index, symbol, isFocused }) => (
                        <Text
                            key={index}
                            style={[styles.cell, isFocused && styles.focusCell && customFocusCellStyle]}
                            onLayout={getCellOnLayoutHandler(index)}>
                            {symbol || (isFocused ? <Cursor /> : null)}
                        </Text>
                    )}
                />
            </View>

            <View style={{ alignItems: "center", paddingTop: 10 }}>
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                        resendPhoneCode();
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
                        <Text style={{ fontSize: 18, color: "#fcf5ef" }}>重新获取</Text>
                        {
                            isCountDownShow
                                ? <Text style={{ fontSize: 18, color: "#fcf5ef" }}> ({countdown}s)</Text>
                                : <></>
                        }
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    }

    return (
        registerType == "mail"
            ? renderMailCode()
            : renderPhoneCode()
    );
}

const styles = StyleSheet.create({
    codeFieldRoot: { marginTop: 20 },
    cell: {
        width: 40,
        height: 40,
        lineHeight: 38,
        fontSize: 24,
        borderBottomWidth: 2,
        borderBottomColor: "#ccc",
        textAlign: 'center',
    },
    focusCell: {
        // borderColor: '#000',
    },
});