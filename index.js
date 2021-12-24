/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/pages/appNav';
import {name as appName} from './app.json';

GLOBAL.XMLHttpRequest = GLOBAL.originalXMLHttpRequest || GLOBAL.XMLHttpRequest;
AppRegistry.registerComponent(appName, () => App);