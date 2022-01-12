import React from 'react';
import { View, Text } from 'react-native';
import { Provider } from 'react-redux';
import store from '../redux/store';
import AppNav from './appNav'

class Index extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <AppNav />
            </Provider>
        );
    }
}
export default Index;