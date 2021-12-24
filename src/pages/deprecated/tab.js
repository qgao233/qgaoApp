import React from 'react';
import { View, Text } from 'react-native';
import TabNavigator from 'react-native-tab-navigator';
import {article,articleSelect} from '../../support/svg/customSvg';
import SvgUri from '../../utils/svg/svgUri';

class Index extends React.Component {
    state={
        selectedTab:'home'
    }

    render() {
        return (
            <View style={{flex:1}}>
                <TabNavigator>
                <TabNavigator.Item
                    selected={this.state.selectedTab === 'home'}
                    title="Home"
                    renderIcon={ ()=><SvgUri width={20} height={20} svgXmlData={article} />}
                    renderSelectedIcon={ ()=><SvgUri width={20} height={20} svgXmlData={articleSelect} />}
                    onPress={() => this.setState({ selectedTab: 'home' })}>
                    <Text>11</Text>
                </TabNavigator.Item>
                <TabNavigator.Item
                    selected={this.state.selectedTab === 'profile'}
                    title="Profile"
                    renderIcon={()=><SvgUri width={20} height={20} svgXmlData={article} />}
                    renderSelectedIcon={()=><SvgUri width={20} height={20} svgXmlData={articleSelect} />}
                    onPress={() => this.setState({ selectedTab: 'profile' })}>
                    <Text>22</Text>
                </TabNavigator.Item>
            </TabNavigator>
            </View>
        );
    }
}
export default Index;