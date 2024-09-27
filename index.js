/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { Buffer } from 'buffer';

// Make Buffer available globally
global.Buffer = Buffer;

AppRegistry.registerComponent(appName, () => App);
