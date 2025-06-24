import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Alert, Platform, Image, ImageBackground, StyleSheet } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../firebase'; // ajuste o caminho
import ImagePerfil from '../../../_components/ImagePerfil';
import Back from '../../../_components/Back';
import { fetchPublicacoesPorUsuario } from '../../../scripts/publicacao';
import { FlatList } from 'react-native-gesture-handler';
import PublicacoesPerfil from '../../../_components/PublicacoesPerfil';

const SERVER_URL = Platform.OS === 'android'
  ? 'http://10.0.2.2:3000'
  : 'http://localhost:3000';

export default function PerfilUsuario({ route }) {
  const { userId } = route.params;
  const [perfil, setPerfil] = useState(null);
  const [publicacoes, setPublicacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingPubs, setLoadingPubs] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const ref = doc(db, 'appFit_usuarios', userId);
        const snap = await getDoc(ref);
        if (!snap.exists()) throw new Error('Usuário não encontrado');
        setPerfil(snap.data());
      } catch (e) {
        Alert.alert('Erro', e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  useEffect(() => {
    (async () => {
      try {
        const pubs = await fetchPublicacoesPorUsuario(userId);
        setPublicacoes(pubs);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingPubs(false);
      }
    })();
  }, [userId]);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  console.log("perfil", perfil.fotoPerfil);
  console.log("userId", userId);


  return (
    <View style={{ flex: 1, paddingTop: 60, alignItems: 'center', backgroundColor: '#161819' }}>
      <Back />
      <Image
        source={{ uri: SERVER_URL + perfil.fotoPerfil }}
        style={{ width: 120, height: 120, borderRadius: 60 }}
        resizeMode="cover"
      />
      <Text style={{ color: 'white', fontSize: 24, marginTop: 12 }}>{perfil.nome}</Text>
      <Text style={{ color: '#bbb', fontSize: 16 }}>{perfil.cidade} - {perfil.estado}</Text>

      {loadingPubs ? (
          <ActivityIndicator color="#1DB954" style={{ marginTop: 20 }} />
        ) : (
           <View style={{
            flex: 1,
            width: '100%'
           }}>
            <PublicacoesPerfil publicacoes={publicacoes} />
           </View>
        )}
    </View>
  );
}
