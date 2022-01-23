import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
// import { Makiko } from 'react-native-textinput-effects';


const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

class Index extends React.Component {

    static defaultProps = {
        inputWidth: 400,
        inputHeight: 100,
        inputBorderColor: "transparent",
        inputFontColor: "#5a5a5a",//输入的字体颜色
        inputTopicColor: "#3c8cd2",
        inputColorOpacity: "22", //2位十六进制数
        inputIconName: "search",
        inputFontSize: 16,
        inputPlaceholder: "Search",
        inputIconFontSize: 25,
        inputPlaceholderBackgroundColor:"#f6f7f9",
        inputMultiline: false,
        inputButtonText: "Search",
        inputShowFontColor: "#CFD6DB",
        inputShowIconColor: "#E5E8EA",
        onPressSubmit: () => { },
        isInputButtonShow: true,
    }

    constructor() {
        super();
        this.state = {
            backOpacity: new Animated.Value(1),
            barWidth: new Animated.Value(0),
            barHeight: new Animated.Value(0),
            barLeft: new Animated.Value(0),
            barTop: new Animated.Value(0),
            barOpacity: new Animated.Value(1),
            inputZindex: new Animated.Value(0),
            inputOpacity: new Animated.Value(0),
            buttonZindex: new Animated.Value(0),
            buttonOpacity: new Animated.Value(0),

            textValue: ""
        }
        this.ref = null;
    }


    openInput = () => {
        //同步执行
        Animated.parallel([
            Animated.timing(this.state.backOpacity, {
                toValue: 0,
                duration: 500,
                easing: Easing.linear,
                useNativeDriver: false,//消除警告，但这里不能设置为true,true时有些属性不支持
            }),
            Animated.timing(this.state.barWidth, {
                toValue: 1,
                duration: 500,
                easing: Easing.linear,
                useNativeDriver: false,
            }),
            Animated.timing(this.state.barHeight, {
                toValue: 1,
                duration: 500,
                easing: Easing.linear,
                useNativeDriver: false,
            }),
            Animated.timing(this.state.barLeft, {
                toValue: 1,
                duration: 500,
                easing: Easing.linear,
                useNativeDriver: false,
            }),
            Animated.timing(this.state.barTop, {
                toValue: 1,
                duration: 500,
                easing: Easing.linear,
                useNativeDriver: false,
            }),
            Animated.timing(this.state.barOpacity, {
                toValue: 0,
                duration: 500,
                easing: Easing.linear,
                useNativeDriver: false,
            }),
            Animated.timing(this.state.inputZindex, {
                toValue: 1,
                duration: 500,
                easing: Easing.linear,
                useNativeDriver: false,
            }),
            Animated.timing(this.state.inputOpacity, {
                toValue: 1,
                duration: 500,
                easing: Easing.linear,
                useNativeDriver: false,
            }),
            Animated.timing(this.state.buttonZindex, {
                toValue: 1,
                duration: 500,
                easing: Easing.linear,
                useNativeDriver: false,
            }),
            Animated.timing(this.state.buttonOpacity, {
                toValue: 1,
                duration: 500,
                easing: Easing.linear,
                useNativeDriver: false,
            }),
        ]).start();

        //让input获得焦点
        if (!this.inputRef.isFocused()) {
            this.inputRef.focus();
        }
    }

    closeInput = () => {
        //同步执行
        Animated.parallel([
            Animated.timing(this.state.backOpacity, {
                toValue: 1,
                duration: 500,
                easing: Easing.linear,
                useNativeDriver: false,
            }),
            Animated.timing(this.state.barWidth, {
                toValue: 0,
                duration: 500,
                easing: Easing.linear,
                useNativeDriver: false,
            }),
            Animated.timing(this.state.barHeight, {
                toValue: 0,
                duration: 500,
                easing: Easing.linear,
                useNativeDriver: false,
            }),
            Animated.timing(this.state.barLeft, {
                toValue: 0,
                duration: 500,
                easing: Easing.linear,
                useNativeDriver: false,
            }),
            Animated.timing(this.state.barTop, {
                toValue: 0,
                duration: 500,
                easing: Easing.linear,
                useNativeDriver: false,
            }),
            Animated.timing(this.state.barOpacity, {
                toValue: 1,
                duration: 500,
                easing: Easing.linear,
                useNativeDriver: false,
            }),
            Animated.timing(this.state.inputZindex, {
                toValue: 0,
                duration: 500,
                easing: Easing.linear,
                useNativeDriver: false,
            }),
            Animated.timing(this.state.inputOpacity, {
                toValue: 0,
                duration: 500,
                easing: Easing.linear,
                useNativeDriver: false,
            }),
            Animated.timing(this.state.buttonZindex, {
                toValue: 0,
                duration: 500,
                easing: Easing.linear,
                useNativeDriver: false,
            }),
            Animated.timing(this.state.buttonOpacity, {
                toValue: 0,
                duration: 500,
                easing: Easing.linear,
                useNativeDriver: false,
            }),
        ]).start();
    }

    render() {
        const { inputWidth, inputHeight, inputBorderColor,
            inputFontColor, inputTopicColor, inputColorOpacity,
            inputIconName, inputFontSize, inputPlaceholder,
            inputMultiline, inputButtonText, inputShowFontColor,
            isInputButtonShow,inputPlaceholderBackgroundColor,inputShowIconColor,
            inputIconFontSize } = this.props;


        const { backOpacity, barOpacity, inputOpacity, buttonOpacity } = this.state;
        const barWidth = this.state.barWidth.interpolate({
            inputRange: [0, 1],
            outputRange: [0, inputWidth * 2]
        })
        const barHeight = this.state.barHeight.interpolate({
            inputRange: [0, 1],
            outputRange: [0, inputHeight * 2]
        })
        const barLeft = this.state.barLeft.interpolate({
            inputRange: [0, 1],
            outputRange: [inputWidth * 0.5, -inputWidth * 0.5]
        })
        const barTop = this.state.barTop.interpolate({
            inputRange: [0, 1],
            outputRange: [inputHeight * 0.5, -inputHeight * 0.5]
        })
        const inputZindex = this.state.inputZindex.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 3]
        })
        const buttonZindex = this.state.buttonZindex.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 3]
        })


        return (
            <>
                {/* <View> <TextInput style={{ width: 300, height: 140, borderColor: 'gray', borderWidth: 1, color: 'red', fontSize: 35 }} returnKeyType='search' keyboardAppearance='dark' multiline={true} placeholderTextColor='green' placeholder='请输入' editable={true} keyboardType='numeric' clearButtonMode='while-editing' maxLength={10} onChangeText={()=>{}} /> </View> */}
                <TouchableOpacity
                    class="container"
                    style={{
                        ...style.defaultContainer,
                        borderColor: inputBorderColor,
                        width: inputWidth,
                        height: inputHeight,
                        borderRadius: inputWidth > inputHeight ? inputWidth / 10 : inputHeight / 10,
                    }}
                    onPress={this.openInput} >
                    <Animated.View class="back" style={{
                        ...style.defaultBack,
                        opacity: backOpacity,
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: inputPlaceholderBackgroundColor ,
                    }}>
                        <FontAwesomeIcon
                            name={inputIconName}
                            size={inputIconFontSize}
                            color={inputShowIconColor}
                            style={{ paddingLeft: inputWidth > inputHeight ? inputWidth / 20 : inputHeight / 20 }} />
                        <Text style={{
                            color: inputShowFontColor,
                            fontSize: inputFontSize,
                            paddingLeft: 10
                        }}>
                            {this.state.textValue || inputPlaceholder}
                        </Text>
                    </Animated.View>
                    <Animated.View class="bar" style={{
                        ...style.defaultBar,

                        borderRadius: inputWidth > inputHeight ? inputWidth : inputHeight,
                        width: barWidth,
                        height: barHeight,
                        left: barLeft,
                        top: barTop,
                        opacity: barOpacity
                    }}></Animated.View>
                    <AnimatedTextInput class="input"
                        style={{
                            ...style.defaultInput,
                            zIndex: inputZindex,
                            opacity: inputOpacity,
                            borderBottomWidth: 1,
                            borderBottomColor: inputTopicColor + inputColorOpacity,
                            color: inputFontColor,
                            fontSize: inputFontSize,
                            paddingLeft: inputWidth > inputHeight ? inputWidth / 20 : inputHeight / 20,
                            paddingRight: inputWidth > inputHeight ? inputWidth / 4.5 : inputHeight / 4.5
                        }}
                        onSubmitEditing={() => { this.props.onPressSubmit(this.state.textValue) }}
                        onChangeText={(value) => {
                            this.props.onChangeText && this.props.onChangeText(value)
                            this.setState({ textValue: value })
                        }}
                        value={this.state.textValue}
                        onBlur={this.closeInput}
                        returnKeyType="go"
                        selectionColor={inputTopicColor}//光标颜色
                        multiline={inputMultiline}
                        ref={(ref) => this.inputRef = ref}
                    />
                    {isInputButtonShow
                        ? <Animated.View style={{
                            position: "absolute",
                            right: 0,
                            width: inputWidth > inputHeight ? inputWidth / 4 : inputHeight / 4,
                            height: "100%",
                            alignItems: "flex-end",
                            justifyContent: "center",
                            opacity: buttonOpacity,
                            zIndex: buttonZindex,
                        }}>
                            {/* button */}
                            <TouchableOpacity
                                onPress={() => { this.props.onPressSubmit(this.state.textValue) }}
                                activeOpacity={0.6}
                                style={{
                                    paddingTop: inputHeight * 0.2,
                                    paddingBottom: inputHeight * 0.2,
                                    paddingLeft: inputWidth > inputHeight ? inputWidth / 25 : inputHeight / 25,
                                    paddingRight: inputWidth > inputHeight ? inputWidth / 25 : inputHeight / 25,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundColor: inputTopicColor,
                                    borderRadius: inputWidth > inputHeight ? inputWidth / 10 : inputHeight / 10,
                                }}
                            >
                                <Text style={{ color: "#fff", fontSize: inputFontSize ? inputFontSize / 1.5 : 10, }}>
                                    {inputButtonText}
                                </Text>
                            </TouchableOpacity>
                        </Animated.View>
                        : <></>}


                </TouchableOpacity>
            </>
        );
    }
}
export default Index;

const style = StyleSheet.create({
    defaultContainer: {
        // width: 400,
        // height: 100,
        borderWidth: 1,
        borderColor: "red",
        overflow: "hidden",
        position: "relative"
    },
    defaultBack: {
        position: "absolute",
        width: "100%",
        height: "100%",
        backgroundColor: "#ef5621",
        // transition: 0.5s all linear;
        zIndex: 3,
    },
    defaultBar: {
        position: "absolute",

        // borderRadius: 200,
        // transition: 0.5s all linear;
        backgroundColor: "#fff",
        width: 0,
        height: 0,
        left: "50%",
        top: "50%",
        zIndex: 3,
    },
    defaultInput: {
        position: "absolute",
        // transition: 0.5s all linear;
        width: "100%",
        height: "100%",
        padding: 0,
        backgroundColor: "#fff",
        // outline: none,
        // border: 0,
        zIndex: 1,
        opacity: 0,
    },
    transitionBack: {
        opacity: 0
    },
    transitionBar: {
        width: "200%",
        height: "200%",
        left: "-50%",
        top: "-50%",
        opacity: 0
    },
    transitionInput: {
        zIndex: 3,
        opacity: 1
    }
})