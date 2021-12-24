import React from 'react';
import { View, Text } from 'react-native';

import { PanGestureHandler, State } from 'react-native-gesture-handler'

class Index extends React.Component {
    render() {
        return (
            <PanGestureHandler
                onHadlerStateChange={({ nativeEvent }) => {
                    switch (nativeEvent.state) {
                        case State.UNDETERMINED:
                            console.log('等待手势')
                            break;
                        case State.BEGAN:
                            console.log('手势开始')
                            break;
                        case State.CANCELLED:
                            console.log('手势取消')
                            break;
                        case State.ACTIVE:
                            console.log('手势活跃')
                            break;
                        case State.END:
                            console.log('手势结束')
                            break;
                        case State.FAILED:
                            console.log('失败')
                            break;
                        default:
                            console.log('其他')
                            break;
                    }
                }}
                onGestureEvent={({ nativeEvent }) => {
                    console.log(233)
                }}
            >
                <View style={{width:300,height:400,backgroundColor:"red",marginTop:50}}>
                    <Text>233</Text>
                </View>
            </PanGestureHandler>
        );
    }
}
export default Index;