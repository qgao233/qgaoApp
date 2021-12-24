import React from 'react';
import { View, Text } from 'react-native';
import { Provider } from 'react-redux';
import { store, AppWithNavigationState } from '../store/index';
class Index extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <AppWithNavigationState />
            </Provider>
        );
    }
}
export default Index;