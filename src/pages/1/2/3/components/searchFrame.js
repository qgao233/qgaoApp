import React from 'react';
import { View, Text, Image } from 'react-native';
import SearchBox from '../../../../../utils/components/inputBox';
import { topicTrends, topicTrendsNum } from '../../../../../utils/stylesKits';

class Index extends React.Component {

    static defaultProps = {
        searchBoxStyle: {
            width: 350,
            height: 50,
        },
        photoStyle: {
            width: 40,
            height: 40
        }
    }

    render() {
        return (
            <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "center" }}>
                <SearchBox
                    onPressSubmit={(inputTxt) => {this.props.onPressSubmit(inputTxt)}}
                    inputColorOpacity="22"
                    inputTopicColor={topicTrends[topicTrendsNum].color.color_num}
                    inputWidth={this.props.searchBoxStyle.width}
                    inputHeight={this.props.searchBoxStyle.height}
                    inputFontSize={20}
                />
                <Image style={{ ...this.props.photoStyle, borderRadius: this.props.photoStyle.width / 2 }} source={require("../../../../../res/img/photo.jpg")}></Image>
            </View>
        );
    }
}
export default Index;