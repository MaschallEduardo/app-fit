import React, { useEffect, useState } from 'react';
import {
    View,
    Image,
    ActivityIndicator,
    StyleSheet,
    Platform,
} from 'react-native';
import { fetchFotoPerfilUrl } from '../scripts/perfil';

export default function ImagePerfil({ size = 92 }) {
    const [uri, setUri] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const url = await fetchFotoPerfilUrl();
                if (url) setUri(url);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    console.log("uri", uri);


    if (loading) {
        return (
            <View style={[styles.placeholder, { width: size, height: size }]}>
                <ActivityIndicator color="#fff" />
            </View>
        );
    }

    if (!uri) {
        return (
            <View style={[styles.placeholder, { width: size, height: size }]} />
        );
    }

    return (
        <Image
            source={{ uri }}
            style={{ width: size, height: size, borderRadius: 10 }}
            resizeMode="cover"
        />
    );
}

const styles = StyleSheet.create({
    placeholder: {
        backgroundColor: '#373B3D',
        borderRadius: 999,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
