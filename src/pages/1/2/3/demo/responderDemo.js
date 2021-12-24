import React from 'react';
import { View, Text, PanResponder, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
class Index extends React.Component {

    constructor() {
        super();

        this._panResponder = PanResponder.create({
            // 要求成为响应者：

            // onStartShouldSetPanResponderCapture: (evt, gestureState) => {
            //     this.props.navigation.navigate("ResponderDemo");
            //     console.log(1);
            //     return false;
            // },
            // onStartShouldSetPanResponder: (evt, gestureState) => {
            //     console.log(2);

            //     return true;
            // },
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
                console.log(3);
                return false;//false会进入onMoveShouldSetPanResponder，true则跳过这个方法
            },
            onMoveShouldSetPanResponder: (evt, gestureState) => {
                console.log(4)

                let { dx, dy } = gestureState;
                if ((Math.abs(dx) > 5) || (Math.abs(dy) > 5)) {
                    return true
                } else {
                    return false
                }
            },
            onPanResponderGrant: (evt, gestureState) => {
                // 开始手势操作。给用户一些视觉反馈，让他们知道发生了什么事情！
                console.log(5)
                // gestureState.{x,y} 现在会被设置为0
            },
            onPanResponderMove: (evt, gestureState) => {
                // 最近一次的移动距离为gestureState.move{X,Y}
                console.log(6)
                // 从成为响应者开始时的累计手势移动距离为gestureState.d{x,y}
            },
            onPanResponderTerminationRequest: (evt, gestureState) => {
                console.log(7);
                return true;
            },
            onPanResponderRelease: (evt, gestureState) => {
                // 用户放开了所有的触摸点，且此时视图已经成为了响应者。
                // 一般来说这意味着一个手势操作已经成功完成。
                console.log(8);

            },
            onPanResponderTerminate: (evt, gestureState) => {
                console.log(9)
                // 另一个组件已经成为了新的响应者，所以当前手势将被取消。
            },
            onShouldBlockNativeResponder: (evt, gestureState) => {
                console.log(10)
                // 返回一个布尔值，决定当前组件是否应该阻止原生组件成为JS响应者
                // 默认返回true。目前暂时只支持android。
                return true;
            },
        });

        this._panResponder1 = PanResponder.create({
            // 要求成为响应者：

            onStartShouldSetPanResponderCapture: (evt, gestureState) => {
                this.props.navigation.navigate("ResponderDemo");
                console.log("1#");
                return true;
            },
            onStartShouldSetPanResponder: (evt, gestureState) => {
                console.log(2 + "#");
                return true;
            },
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
                console.log(3 + "#");
                return true;
            },
            onMoveShouldSetPanResponder: (evt, gestureState) => {
                console.log(4 + "#")

                let { dx, dy } = gestureState;
                if ((Math.abs(dx) > 5) || (Math.abs(dy) > 5)) {
                    return true
                } else {
                    return false
                }
            },
            onPanResponderGrant: (evt, gestureState) => {
                // 开始手势操作。给用户一些视觉反馈，让他们知道发生了什么事情！
                console.log(5 + "#")
                // gestureState.{x,y} 现在会被设置为0
            },
            onPanResponderMove: (evt, gestureState) => {
                // 最近一次的移动距离为gestureState.move{X,Y}
                console.log(6 + "#")
                // 从成为响应者开始时的累计手势移动距离为gestureState.d{x,y}
            },
            onPanResponderTerminationRequest: (evt, gestureState) => {
                console.log(7 + "#");
                return true;
            },
            onPanResponderRelease: (evt, gestureState) => {
                // 用户放开了所有的触摸点，且此时视图已经成为了响应者。
                // 一般来说这意味着一个手势操作已经成功完成。
                console.log(8 + "#");

            },
            onPanResponderTerminate: (evt, gestureState) => {
                console.log(9 + "#")
                // 另一个组件已经成为了新的响应者，所以当前手势将被取消。
            },
            onShouldBlockNativeResponder: (evt, gestureState) => {
                console.log(10 + "#")
                // 返回一个布尔值，决定当前组件是否应该阻止原生组件成为JS响应者
                // 默认返回true。目前暂时只支持android。
                return true;
            },
        });

        this.gestureHandlers = {
            /**
             * 在手指触摸开始时申请成为响应者
             */
            onStartShouldSetResponder: (evt) => {
                console.log('onStartShouldSetResponder');
                return true;
            },
            /**
             * 在手指在屏幕移动时申请成为响应者
             */
            onMoveShouldSetResponder: (evt) => {
                console.log('onMoveShouldSetResponder');
                return true;
            },
            /**
             * 申请成功，组件成为了事件处理响应者，这时组件就开始接收后序的触摸事件输入。
             * 一般情况下，这时开始，组件进入了激活状态，并进行一些事件处理或者手势识别的初始化
             */
            onResponderGrant: (evt) => {
                console.log('onResponderGrant');
            },

            /**
             * 表示申请失败了，这意味者其他组件正在进行事件处理，
             * 并且它不想放弃事件处理，所以你的申请被拒绝了，后续输入事件不会传递给本组件进行处理。
             */
            onResponderReject: (evt) => {
                console.log('onResponderReject');
            },

            /**
             * 表示手指按下时，成功申请为事件响应者的回调
             */
            onResponderStart: (evt) => {
                console.log('onResponderStart');
            },

            /**
             * 表示触摸手指移动的事件，这个回调可能非常频繁，所以这个回调函数的内容需要尽量简单
             */
            onResponderMove: (evt) => {
                console.log('onResponderMove');
            },

            /**
             * 表示触摸完成（touchUp）的时候的回调，表示用户完成了本次的触摸交互，这里应该完成手势识别的处理，
             * 这以后，组件不再是事件响应者，组件取消激活
             */
            onResponderRelease: (evt) => {
                console.log('onResponderRelease');
            },

            /**
             * 组件结束事件响应的回调
             */
            onResponderEnd: (evt) => {
                console.log('onResponderEnd');
            },

            /**
             * 当其他组件申请成为响应者时，询问你是否可以释放响应者角色让给其他组件
             */
            onResponderTerminationRequest: (evt) => {
                console.log('onResponderTerminationRequest');
                return true;
            },

            /**
             * 如果 onResponderTerminationRequest 回调函数返回为 true，
             * 则表示同意释放响应者角色，同时会回调如下函数，通知组件事件响应处理被终止
             * 这可能是由于其他View通过onResponderTerminationRequest请求的，也可能是由操作系统强制夺权（比如iOS上的控制中心或是通知中心）。
             */
            onResponderTerminate: (evt) => {
                console.log('onResponderTerminate');
            }
        }
    }

    render() {
        return (
            <View style={{ position: "absolute", backgroundColor: "red", width: 300, height: 400 }}
                {...this._panResponder.panHandlers} >
                <TouchableOpacity style={{ position: "absolute", marginTop: 20 }} onPress={() => { console.log("press") }}>
                    <View style={{ width: 300, height: 400, backgroundColor: "#ccc5" }} >
                        <Text style={{ fontSize: 40, color: "#fff" }}>push</Text>
                    </View>
                </TouchableOpacity>
            </View>

            // <TouchableOpacity onPress={() => { console.log("touch") }} style={{position: "absolute", marginTop: 50 }}>
            //     <View {...this.gestureHandlers} style={{ backgroundColor: "#ccc5", width: 300, height: 400 }} ></View>
            //     <View style={{position:"absolute",}}>
            //         <Text style={{ fontSize: 40, color: "black" }}>push</Text>
            //     </View>

            // </TouchableOpacity>
        );
    }
}
export default Index;