import React from 'react';
import { View, Text, Image, TouchableOpacity, StatusBar } from 'react-native';
import { screenWidth, screenHeight } from "../../utils/stylesKits";
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Toast, {DURATION} from 'react-native-easy-toast'

class Index extends React.Component {

    constructor() {
        super();

        this.state = {
            isAdsPlay: true,
            countdownWatch: 5,
        }
        this.timer = 0;
    }

    //1秒后跳转到除封面之外的app内部
    componentDidMount() {
        this.timer = setInterval(() => {
            if (this.state.countdownWatch - 1 == 0) {
                clearInterval(this.timer);
                this.props.navigation.navigate('AppContentNav');
            }
            this.setState({ countdownWatch: this.state.countdownWatch - 1 })

        }, 1000);

    }

    togglePlay = () => {
        if (this.state.isAdsPlay) {
            clearInterval(this.timer);
            this.setState({ isAdsPlay: !this.state.isAdsPlay })

        } else {
            if (this.state.countdownWatch > 0) {
                this.timer = setInterval(() => {
                    if (this.state.countdownWatch - 1 == 0) {
                        clearInterval(this.timer);
                        this.props.navigation.navigate('AppContentNav');
                    }
                    this.setState({ countdownWatch: this.state.countdownWatch - 1 })

                }, 1000);
                this.setState({ isAdsPlay: !this.state.isAdsPlay })
            }


        }
    }

    jump = () => {
        clearInterval(this.timer);
        this.props.navigation.navigate('AppContentNav');
    }

    render() {
        return (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center", position: "relative" }}>
                <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent={true} hidden={true} />
                <Image style={{ width: screenWidth, height: screenHeight }}
                    source={require("../../res/img/landscape.png")} />
                <TouchableOpacity style={{ padding: 5, position: "absolute", top: 20, right: 20, backgroundColor: "#ccc5", borderRadius: 10 }} activeOpacity={0.6} onPress={() => { this.jump() }}>
                    <Text style={{ color: "#fff" }}>剩余{this.state.countdownWatch}秒，点击跳过</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ position: "absolute", bottom: 30, left: screenWidth / 2 - 25 }} activeOpacity={0.6} onPress={() => { this.togglePlay() }}>
                    <FontAwesomeIcon name={this.state.isAdsPlay ? 'pause-circle-o' : 'play-circle-o'} size={50} color='#fffe' />
                </TouchableOpacity>
            </View>
        );
    }
}
export default Index;