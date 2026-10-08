import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.example.app',
    appName: 'example_app',
    webDir: 'dist',
    android: {
        backgroundColor: "#1f1d2e"
    },
    ios: {
        backgroundColor: "#1f1d2e"
    }
};

export default config;
