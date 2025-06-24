import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, Alert } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../firebase'
import { useNavigation } from '@react-navigation/native';
import Input from '../../_components/Input';
import Button from '../../_components/Button';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation()
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (email === '' || password === '') {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate("HomePage")
    } catch (error) {
      let errorMessage = 'Erro ao realizar login.';
      if (error.code === 'auth/invalid-email') {
        errorMessage = 'Email inválido!';
        setLoading(false)
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Senha incorreta!';
        setLoading(false)
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
      }}>Login</Text>
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
        <Input
          placeholder='Senha'
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          keyboardType="password"
        />
        <Text style={{
          color: "white",
          textAlign: 'right',
          marginTop: -15,
          fontSize: 17
        }}
          onPress={() => navigation.navigate('RecuperarSenha')}
        >
          Esqueci a senha
        </Text>
      </View>
      <View style={{
        marginTop: 20,
        width: '100%',
        display: 'flex',
        gap: 27
      }}>
        <Button title={loading ? "Entrando..." : "Entrar"} onPress={handleLogin} fullWidth />
        <Button title="Registrar-se" onPress={() => navigation.navigate('Cadastrar')} variant="secondary" />
      </View>
    </View>
  );
}


