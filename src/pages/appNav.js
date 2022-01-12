import React, { useEffect } from 'react';
import { View, Text, } from 'react-native';
import { NavigationContainer, useNavigationState } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppAds from './1/appAds';
import AppContentNav from './1/appContentNav';
import SplashScreen from 'react-native-splash-screen'

const Stack = createNativeStackNavigator();

export default () => {

    useEffect(() => {
        SplashScreen.hide();//关闭启动页显示
    }, [])

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="AppContentNav">{/* 更改了路由页面后，要reload才能使页面发生改变 */}
                <Stack.Screen name="AppAds" component={AppAds} />
                <Stack.Screen name="AppContentNav" component={AppContentNav} />
            </Stack.Navigator>
        </NavigationContainer>

    );
}
