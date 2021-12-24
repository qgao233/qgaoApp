import React from 'react';
import { View, Text, StatusBar, PanResponder, Animated, Easing } from 'react-native';
import SearchFrame from '../../components/searchFrame'
import ShowList from './showList';

class Index extends React.Component {

    constructor() {
        super();
        this.classficationRef = React.createRef();
        this.rankRef = React.createRef();

        this.state = {
            isScrollableTabViewLocked: false,//是否锁住主tab的左右滑动，只允许次级tab的左右滑动

            translateY:new Animated.Value(1),//0,
            scale:new Animated.Value(1),//1,
            height:new Animated.Value(1),//40
            opacity:new Animated.Value(1),//1
        }
    }

    toggleSearchFrame = (bool) =>{
        const config = bool 
        ? {
            toValue:1,
            duration: 250,
            easing: Easing.linear,
            useNativeDriver: false,//消除警告，但这里不能设置为true
        }
        :{
            toValue:0,
            duration: 250,
            easing: Easing.linear,
            useNativeDriver: false,//消除警告，但这里不能设置为true
        };
        Animated.parallel([
            Animated.timing(this.state.translateY, {...config,}),
            Animated.timing(this.state.scale, {...config,}),
            Animated.timing(this.state.height, {...config,}),
            Animated.timing(this.state.opacity, {...config,}),
        ]).start();
    }

    toggleScrollableTabViewLock = (bool = false) => {
        this.setState({ isScrollableTabViewLocked: bool });
    }

    render() {

        let { translateY, scale, height, opacity } = this.state;
        translateY = translateY.interpolate({
            inputRange: [0, 1],
            outputRange: [-10, 0]
        })
        scale = scale.interpolate({
            inputRange: [0, 1],
            outputRange: [0.5, 1]
        })
        height = height.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 40]
        })
        opacity = opacity.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1]
        })

        return (
            <View style={{ flex: 1, paddingTop: 30 }}>
                <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent={true} hidden={false} />
                {/* 搜索框 */}
                <Animated.View
                    style={{
                        transform:[{translateY:translateY},{scale:scale}],
                        height:height,
                        opacity:opacity,
                    }}
                    >
                    <SearchFrame onPressSubmit={(keyTxt)=>{
                        this.setState({keyWord:keyTxt});
                        
                        }} searchBoxStyle={{ width: 320, height: 40 }} photoStyle={{ width: 40, height: 40 }} />
                </Animated.View>
                <View>
                    <Text>搜索结果：</Text>
                </View>
                <ShowList ref={(ref)=>{this.showListRef = ref}} 
                showSearchFrame={this.toggleSearchFrame} 
                keyWord={this.state.keyWord || this.props.route.params.keyWord}
                {...this.props}
                />

            </View>
        );
    }

    componentDidUpdate(){
        this.showListRef.getShowData(1,"refresh")
    }
}
export default Index;