import React from 'react';
import { View, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Popover from 'react-native-popover-view';


import Dialog, {
    DialogTitle,
    DialogContent,
    DialogFooter,
    DialogButton,
    SlideAnimation,
    ScaleAnimation,
} from 'react-native-popup-dialog';



class Index extends React.Component {

    constructor(props) {//构造函数
        super(props);

        this.state = {
            //默认不弹dialog
            showCustomDialog: false,
            //默认不弹dialog
            showScaleDialog: false
        };
    }

    render() {
        return (

            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <Popover
                    from={(
                        <TouchableOpacity>
                            <Text>Press here to open popover!</Text>
                        </TouchableOpacity>
                    )}>
                    <Text>This is the contents of the popover</Text>
                </Popover>
                <TouchableOpacity onPress={() => {
                    this.setState({
                        showCustomDialog: true
                    });
                }}>
                    <Text>click</Text>
                </TouchableOpacity>
                <Dialog
                    onDismiss={() => {
                        this.setState({ showCustomDialog: false });
                    }}
                    width={0.85}
                    visible={this.state.showCustomDialog}
                    rounded
                    actionsBordered
                    dialogAnimation={new SlideAnimation({ slideFrom: 'bottom' })}
                    dialogTitle={
                        <DialogTitle
                            title="标题"
                            textStyle={{
                                fontSize: 17,
                            }}
                            style={{
                                backgroundColor: '#ffffff',
                            }}
                            hasTitleBar={false}
                            align="center" />
                    }
                    footer={
                        <DialogFooter>
                            <DialogButton
                                text="取消"
                                textStyle={{
                                    fontSize: 15,
                                }}
                                bordered
                                onPress={() => {
                                    this.setState({ showCustomDialog: false });
                                }}
                                key="button-1" />
                            <DialogButton
                                text="确定"
                                textStyle={{
                                    fontSize: 15,
                                }}
                                bordered
                                onPress={() => {
                                    this.setState({ showCustomDialog: false });
                                }}
                                key="button-2" />
                        </DialogFooter>
                    }>
                    <DialogContent
                        style={{
                            backgroundColor: '#ffffff',
                            justifyContent: 'center', alignItems: 'center',
                        }}>
                        <Text>是否确定退出登录？</Text>
                    </DialogContent>
                </Dialog>

                <Dialog
                    onTouchOutside={() => {
                        this.setState({ showScaleDialog: false });
                    }}
                    width={0.9}
                    visible={this.state.showScaleDialog}
                    dialogAnimation={new ScaleAnimation()}
                    dialogTitle={
                        <DialogTitle
                            title="标题"
                            hasTitleBar={false} />}
                    footer={
                        <DialogFooter>
                            <DialogButton
                                text="取消"
                                textStyle={{
                                    fontSize: 15,
                                }}
                                bordered
                                onPress={() => {
                                    this.setState({ showScaleDialog: false });
                                }}
                                key="button-1" />
                        </DialogFooter>}>


                    <DialogContent
                        style={{
                            backgroundColor: '#ffffff',
                            justifyContent: 'center', alignItems: 'center',
                        }}>
                        <Text>是否确定退出登录？</Text>
                    </DialogContent>
                </Dialog>
            </View>
        );
    }
}
export default Index;