import React from 'react';
import { View, Text } from 'react-native';
import SvgUri from '../../../../../utils/components/svg/svgUri';
import {article,articleSelect} from '../../../../../res/img/svg/customSvg';
class Index extends React.Component {
    render() {

        return (
            <View style={{flex:1}}>
                <SvgUri width="40" height="40" fill="red" svgXmlData={article} />
                <Text>22</Text>
            </View>
        );
    }
}
export default Index;