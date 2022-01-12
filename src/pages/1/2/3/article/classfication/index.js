import React from 'react';
import { View, Text } from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import SubTabBar from '../components/subTabBar'
import ShowList from './showList'

class Index extends React.Component {
    constructor() {
        super();
        this.tabLabel = {
            list: [
                { id: 1, text: "java" },
                { id: 2, text: "html" },
                { id: 3, text: "css" },
                { id: 4, text: "react-native" },
            ]
        }
    }


    dynamicRenderTabPage = () => {
        const views = [];
        this.tabLabel.list.forEach((v, i) => {
            views.push(
                <View key={i} tabLabel={v.text} >
                    <ShowList cid={v.id} {...this.props} />
                </View>
            );
        })
        return views;
    }



    render() {


        return (
            <View style={{ flex: 1 }}>
                {/* tab标签栏,外层一定是弹性容器（flex:1)才会显示 */}
                <ScrollableTabView
                    initialPage={0}
                    renderTabBar={() => < SubTabBar />}
                >
                    {this.dynamicRenderTabPage()}
                </ScrollableTabView>

            </View>
        );
    }
}
export default Index;