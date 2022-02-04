import React from 'react';
import { View, Text, StatusBar, Animated, Easing, } from 'react-native';
import SearchFrame from '../../utils/components/searchFrame'
import Icon from 'react-native-vector-icons/FontAwesome';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import MainTabBar from '../../utils/components/mainTabBar';
import Recommend from './recommend';
import Classfication from './classfication';
import Rank from './rank';
import { SafeAreaView } from 'react-native-safe-area-context';
import { statusBarHeight } from '../../../../../../utils/stylesKits'


class Index extends React.Component {

    constructor() {
        super();
        this.classficationRef = React.createRef();
        this.rankRef = React.createRef();

        this.state = {

            translateY: new Animated.Value(1),//0,
            scale: new Animated.Value(1),//1,
            height: new Animated.Value(1),//40
            opacity: new Animated.Value(1),//1
        }
    }


    toggleSearchFrame = (bool) => {
        const config = bool
            ? {
                toValue: 1,
                duration: 250,
                easing: Easing.linear,
                useNativeDriver: false,//消除警告，但这里不能设置为true
            }
            : {
                toValue: 0,
                duration: 250,
                easing: Easing.linear,
                useNativeDriver: false,//消除警告，但这里不能设置为true
            };
        Animated.parallel([
            Animated.timing(this.state.translateY, { ...config, }),
            Animated.timing(this.state.scale, { ...config, }),
            Animated.timing(this.state.height, { ...config, }),
            Animated.timing(this.state.opacity, { ...config, }),
        ]).start();
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
            <SafeAreaView
                style={{ flex: 1, backgroundColor: "#fff" }}>
                <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent={true} hidden={false} />
                {/* 搜索框 */}
                <Animated.View
                    style={{
                        transform: [{ translateY: translateY }, { scale: scale }],
                        height: height,
                        opacity: opacity,
                    }}
                >
                    <SearchFrame {...this.props} searchBoxStyle={{ width: 320, height: 40 }} photoStyle={{ width: 35, height: 35 }} />
                </Animated.View>
                {/* tab标签栏,外层一定是弹性容器（flex:1)才会显示 */}
                <ScrollableTabView
                    initialPage={0}
                    renderTabBar={() => < MainTabBar navigation={this.props.navigation} />}
                >
                    <Recommend tabLabel='推荐' showSearchFrame={this.toggleSearchFrame} {...this.props} />
                    <Classfication tabLabel='分类' />
                    <Rank tabLabel='排行榜' />
                </ScrollableTabView>

            </SafeAreaView>
        );
    }
}
export default Index;