import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppAds from './1/appAds';
import AppContentNav from './1/appContentNav';
import SplashScreen from 'react-native-splash-screen'

const Stack = createNativeStackNavigator();

class Index extends React.Component {

    componentDidMount(){
        SplashScreen.hide();
    }

    render(){
        return (
            <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="AppContentNav">{/* 更改了路由页面后，要reload才能使页面发生改变 */}
                    <Stack.Screen name="AppAds" component={AppAds} />
                    <Stack.Screen name="AppContentNav" component={AppContentNav} />
                </Stack.Navigator>
            </NavigationContainer>
    
        );
    }
}

function Nav() {

    
}

export default Index;