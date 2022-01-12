import React from 'react';
import { View, Text, Image } from 'react-native';
import FullPageHeader from '../../../../../../utils/components/fullPageHeader';

export default (props) => {
    return (
        <View style={{ flex: 1,}}>
            <FullPageHeader middleName="分享应用" />
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Image style={{ borderRadius: 10 }} source={require("../../../../../../res/img/apk/apk_v0.1.1.png")} />
            </View>
        </View>

    )
}