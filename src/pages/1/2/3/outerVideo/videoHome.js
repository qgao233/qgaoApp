import React from 'react';
import { View, Text, StatusBar, PanResponder, Animated, Easing } from 'react-native';
import SearchFrame from '../components/searchFrame'
import Icon from 'react-native-vector-icons/FontAwesome';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import MainTabBar from './components/mainTabBar';
import Latest from './latest';
import Classfication from './classfication';
import Rank from './rank';

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
                    <SearchFrame onPressSubmit={(keyTxt)=>{this.props.navigation.navigate("SearchResult",{keyWord:keyTxt})}} searchBoxStyle={{ width: 320, height: 40 }} photoStyle={{ width: 40, height: 40 }} />
                </Animated.View>
                {/* tab标签栏,外层一定是弹性容器（flex:1)才会显示 */}
                <ScrollableTabView
                    initialPage={0}
                    onChangeTab={obj => {
                        this.setState({ currIndex: obj.i, isScrollableTabViewLocked: false })
                        if (obj.i == 1) {
                            this.classficationRef.initialWithinCurrTab();
                        } else if (obj.i == 2) {
                            this.rankRef.initialWithinCurrTab();
                        }
                    }}
                    locked={this.state.isScrollableTabViewLocked}
                    renderTabBar={() => < MainTabBar />}
                >
                    <Latest tabLabel='最新' showSearchFrame={this.toggleSearchFrame} navigation={this.props.navigation} />
                    <Classfication showSearchFrame={this.toggleSearchFrame} navigation={this.props.navigation} locked={this.state.isScrollableTabViewLocked} ref={ref => this.classficationRef = ref} toggleScrollableTabViewLock={this.toggleScrollableTabViewLock} tabLabel='分类' />
                    <Rank showSearchFrame={this.toggleSearchFrame} navigation={this.props.navigation} locked={this.state.isScrollableTabViewLocked} ref={ref => this.rankRef = ref} toggleScrollableTabViewLock={this.toggleScrollableTabViewLock} tabLabel='排行榜' />
                </ScrollableTabView>

            </View>
        );
    }
}
export default Index;