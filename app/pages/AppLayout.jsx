import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Sidebar from '../_components/Sidebar';

export default function AppLayout({ children, currentRoute }) {
    console.log("currentRoute", currentRoute);
    
    return (
        <View style={{
            flex: 1,
            backgroundColor: '#161819'
        }}>
            <View style={{
                flex: 1,
            }}>
                {children}
            </View>
            <View style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: -160,
                height: 200
            }}>
                <Sidebar rota={currentRoute}/>
            </View>
        </View>
    );
}

