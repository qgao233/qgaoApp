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
            currIndex: 0,
            withinCurrTab: true,
            tabView:<></>
        }
        this.tabRef = React.createRef();
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

    initialWithinCurrTab = () => {
        this.setState({ withinCurrTab: true });
    }

    componentDidUpdate() {
        if (!this.props.locked && this.state.withinCurrTab) {
            this.props.toggleScrollableTabViewLock(true);
            this.tabRef._initialTouchPhase();
        }
        if (this.state.withinCurrTab) {
            this.setState({ withinCurrTab: false });
        }
    }

    componentDidMount(){
        this.dynamicRenderTabPage();
    }

    render() {


        return (
            <View style={{ flex: 1 }}>
                {/* tab标签栏,外层一定是弹性容器（flex:1)才会显示 */}
                <ScrollableTabView
                    ref={ref=>this.tabRef=ref}
                    initialPage={0}
                    locked={false}
                    onChangeTab={obj => {
                        this.setState({ currIndex: obj.i })
                    }}
                    onScrollExtra={(offset, offsetLast) => {
                        if (this.state.currIndex == 0) {
                            //在索引为0，滑向左页面时，offset不会发生改变
                            if (offset == 0) {
                                // console.log("意图切换到 左边的 页面");
                                this.props.toggleScrollableTabViewLock(false);
                            } else if (offset > offsetLast) {
                                // console.log("意图切换到 右边的 页面");
                            }
                        } else if (this.state.currIndex == this.tabLabel.list.length - 1) {
                            //在索引为0，滑向右页面时，offset不会发生改变
                            if (offset == 0) {
                                // console.log("意图切换到 右边的 页面");
                                this.props.toggleScrollableTabViewLock(false);
                            } else if (offset < offsetLast) {
                                // console.log("意图切换到 左边的 页面");
                            }
                        }
                    }}
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