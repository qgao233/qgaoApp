import React from 'react';
import { View, Text } from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import SubTabBar from '../components/subTabBar'
import ShowList from './showList'
import { getVideoTypes } from '../outerConfig/config';
import Toast, {DURATION} from 'react-native-easy-toast'

const ignoreList = ["电影","电视剧","综艺","动漫","体育频道","海外剧"]

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
        this.state = {
            tabView:<></>
        }
    }


    dynamicRenderTabPage = () => {
        let j = 0;
        getVideoTypes().then((data)=>{
            const views = [];
            data.class.forEach((v, i) => {
                if(v.type_name!=ignoreList[j]) {
                    views.push(
                        <View key={i} tabLabel={v.type_name} >
                            <ShowList cid={v.type_id} {...this.props} />
                        </View>
                    );
                }else{
                    j++;
                }
            })
            this.setState({
                tabView:views
            })
        }).catch((errObj)=>{
            // console.log(errObj)
            this.toast.show(JSON.stringify(errObj));
        })
        
    }



    componentDidMount(){
        this.dynamicRenderTabPage();
    }

    render() {


        return (
            <View style={{ flex: 1 }}>
                {/* tab标签栏,外层一定是弹性容器（flex:1)才会显示 */}
                <ScrollableTabView
                    initialPage={0}
                    renderTabBar={() => < SubTabBar />}
                >
                    {this.state.tabView}
                </ScrollableTabView>

                <Toast ref={(toast) => this.toast = toast}/>
            </View>
        );
    }
}
export default Index;