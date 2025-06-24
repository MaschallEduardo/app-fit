import React, { useEffect, useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { registrarUsuario } from '../../scripts/cadastrar';
import { useNavigation } from '@react-navigation/native';
import Input from '../../_components/Input';
import Button from '../../_components/Button';
import * as Location from 'expo-location';

export default function Cadastrar() {
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [telefone, setTelefone] = useState('')
    const [password, setPassword] = useState('')
    const navigation = useNavigation()
    const [loading, setLoading] = useState(false)
    const [location, setLocation] = useState(null)
    const [address, setAddress] = useState(null)

    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permissão negada', 'Precisamos da sua permissão para acessar a localização.');
                return;
            }

            const { coords } = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Highest,
            });
            setLocation(coords);

            try {
                const [place] = await Location.reverseGeocodeAsync({
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                });
                setAddress(place);
            } catch (e) {
                console.error('Erro no reverseGeocode:', e);
            }
        })();
    }, []);


    const handleRegister = async () => {
        if (!nome || !email || !telefone || !password) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos.');
            return;
        }
        setLoading(true)
        try {
            await registrarUsuario(nome, email, telefone, password, address);
            navigation.navigate("HomePage")
        } catch (error) {
            let errorMessage = 'Erro ao realizar cadastro.';
            switch (error.code) {
                case 'auth/invalid-email':
                    errorMessage = 'Email inválido!';
                    setLoading(false)
                    break;
                case 'auth/weak-password':
                    errorMessage = 'Senha muito fraca!';
                    setLoading(false)
                    break;
                case 'auth/network-request-failed':
                    errorMessage = 'Erro de rede. Verifique sua conexão.';
                    setLoading(false)
                    break;
            }
            Alert.alert('Erro', errorMessage);
        }
    };

    return (
        <View style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingLeft: 10,
            paddingRight: 10
        }}>
            <Text style={{
                color: "white",
                fontSize: 40,
                fontWeight: "bold"
            }}>Registrar</Text>

            <View style={{
                marginTop: 60,
                width: '100%',
                display: 'flex',
                gap: 27
            }}>
                <Input
                    placeholder="Nome"
                    value={nome}
                    onChangeText={setNome}
                />
                <Input
                    placeholder="E-mail"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />
                <Input
                    placeholder="Telefone"
                    value={telefone}
                    onChangeText={setTelefone}
                    keyboardType="phone-pad"
                />
                <Input
                    placeholder="Senha"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <Button title={loading ? "Cadastrando..." : "Cadastrar"} onPress={handleRegister} />
                <Button title="Voltar para Login" variant='secondary' onPress={() => navigation.navigate('Login')} />
            </View>
        </View>
    );
}
