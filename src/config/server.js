
import Constants from 'expo-constants';
import { Platform } from 'react-native';

export function getServerBaseUrl() {
    const manifest = Constants.manifest;
    const manifest2 = Constants.manifest2;
    const expoConfig = Constants.expoConfig;
    const debuggerHost =
        manifest?.debuggerHost ||
        manifest2?.debuggerHost ||
        expoConfig?.hostUri ||
        null;

    const host = debuggerHost
        ? debuggerHost.split(':')[0]
        : 'localhost';
    return `http://${host}:3000`;
}
