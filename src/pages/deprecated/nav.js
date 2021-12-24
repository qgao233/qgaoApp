import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MyTabs from './tab'


const Stack = createNativeStackNavigator();

function Nav() {
  
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{headerShown:false}} initialRouteName="MyTabs">{/* 更改了路由页面后，要reload才能使页面发生改变 */}
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="MyTabs" component={MyTabs} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default Nav;