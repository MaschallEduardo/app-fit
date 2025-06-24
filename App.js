import React, { useEffect, useRef, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import HomePage from './app/pages/home/HomePage';
import Login from './app/pages/auth/Login';
import Cadastrar from './app/pages/auth/Cadastrar';
import RecuperarSenha from './app/pages/auth/RecuperarSenha';
import AppLayout from './app/pages/AppLayout';

import NovaAtividade from './app/pages/home/perfil/NovaAtividade';
import Perfil from './app/pages/home/perfil/Perfil';
import EditarPerfil from './app/pages/home/perfil/EditarPerfil';
import PerfilUsuario from './app/pages/home/perfil/PerfilUsuario';

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true)
  const navigationRef = useRef();
  const [currentRoute, setCurrentRoute] = useState();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setChecking(false);
    });

    return unsubscribe;
  }, []);

  if (checking) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        setCurrentRoute(navigationRef.current.getCurrentRoute().name);
      }}
      onStateChange={() => {
        setCurrentRoute(navigationRef.current.getCurrentRoute().name);
      }}
    >
      <AppLayout currentRoute={currentRoute}>
        <Stack.Navigator
          initialRouteName={user ? 'HomePage' : 'Login'}
          screenOptions={{
            cardStyle: { backgroundColor: '#161819' },
          }}
        >
          <Stack.Screen name="HomePage" component={HomePage} options={{ headerShown: false }}/>
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          <Stack.Screen name="Cadastrar" component={Cadastrar} options={{ headerShown: false }} />
          <Stack.Screen name="RecuperarSenha" component={RecuperarSenha} options={{ headerShown: false }} />
          <Stack.Screen name="Perfil" component={Perfil} options={{ headerShown: false }} />
          <Stack.Screen name="EditarPerfil" component={EditarPerfil} options={{ headerShown: false }} />
          <Stack.Screen name="NovaAtividade" component={NovaAtividade} options={{ headerShown: false }} />
          <Stack.Screen name="PerfilUsuario" component={PerfilUsuario} options={{ headerShown: false }} />
        </Stack.Navigator>
      </AppLayout>
    </NavigationContainer>
  );
}
