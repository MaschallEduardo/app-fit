import { Alert, Text, View } from "react-native";
import Input from "../../_components/Input";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import Button from "../../_components/Button";
import { recuperarSenha } from "../../scripts/recuperarSenha";

export default function RecuperarSenha() {
    const [email, setEmail] = useState('')
    const navigation = useNavigation()

    const handleEnviar = async () => {
        try {
            await recuperarSenha(email);
            Alert.alert(
                'Sucesso',
                'Enviamos um link de recuperação para seu e-mail.'
            );
            navigation.navigate('Login');
        } catch (error) {
            let msg = 'Erro ao solicitar recuperação.';
            if (error.code === 'auth/invalid-email') msg = 'Email inválido.';
            else if (error.code === 'auth/user-not-found') msg = 'Usuário não encontrado.';
            else if (error.code === 'empty-email') msg = 'Informe seu e-mail.';
            Alert.alert('Erro', msg);
        }
    }
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
            }}>Recuperar Senha</Text>
            <View style={{
                marginTop: 60,
                width: '100%',
                display: 'flex',
                gap: 27
            }}>
                <Input
                    placeholder='E-mail'
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />
            </View>
            <View style={{
                marginTop: 20,
                width: '100%',
                display: 'flex',
                gap: 27
            }}>
                <Button title="Enviar" onPress={handleEnviar}/>
                <Button title="Voltar" onPress={() => navigation.navigate('Login')} variant="secondary" />
            </View>
        </View>
    )
}