import React, { useEffect, useState } from 'react';
import { View, Text, Alert, Image, FlatList, StyleSheet, ImageBackground, Modal } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { auth } from '../../../firebase';
import { useNavigation } from '@react-navigation/native';
import { fetchPerfilUsuario } from '../../scripts/perfil';
import ImagePerfil from '../../_components/ImagePerfil';
import Button from '../../_components/Button';
import { curtirPublicacao, fetchTodasPublicacoes } from '../../scripts/publicacao';
import { Platform } from 'react-native';
import { RawButton } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

const SERVER_URL = Platform.OS === 'android'
  ? 'http://10.0.2.2:3000'
  : 'http://localhost:3000';

export default function HomePage() {
  const navigation = useNavigation();
  const [perfil, setPerfil] = useState(null)
  const [publicacoes, setPublicacoes] = useState([])
  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchPerfilUsuario();
        setPerfil(data);
      } catch (e) {
        console.error(e);
        Alert.alert("Erro", e.message);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const todas = await fetchTodasPublicacoes();
      setPublicacoes(todas);
    })();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Login');
    } catch (error) {
      console.log('Erro ao deslogar: ', error.message);
    }
  };

  const openModal = item => {
    setSelected(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelected(null);
  };

  const handleCurtir = async () => {
    setLoading(true)
    try {
      setLoading(true)
      await curtirPublicacao(selected.id);
      setSelected(s => ({ ...s, curtidas: s.curtidas + 1 }));
      setPublicacoes(ps =>
        ps.map(p => p.id === selected.id
          ? { ...p, curtidas: p.curtidas + 1 }
          : p
        )
      );
      setLoading(false)
      closeModal()
    } catch (e) {
      Alert.alert('Erro', e.message);
      setLoading(false)
    }
  };

  if (!perfil) {
    return (
      <View style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#161819"
      }}>
      </View>
    );
  }
  console.log("publicacoes.urlImagem ", publicacoes);


  return (
    <View style={{ flex: 1, paddingTop: 80, paddingLeft: 20, paddingRight: 20 }}>
      <View style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <View>
          <Text style={{ color: 'white', fontSize: 20 }}>{perfil.nome}</Text>
          <Text style={{ color: '#bbb' }}>{perfil.cidade} - {perfil.estado}</Text>
        </View>
        <View>
          <ImagePerfil size={80} />
        </View>
      </View>

      <View style={{
        marginTop: 20
      }}>
        <Button title="Sair" onPress={handleLogout} />
      </View>

      <View style={{
        marginTop: 20,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Button title="Minhas atividades" variant='info' onPress={() => navigation.navigate('Perfil')} />
        <Button title="Nova Atividade" onPress={() => navigation.navigate('NovaAtividade')} />
      </View>

      <View style={{
        flex: 1,
        marginTop: 50,
        marginBottom: 70,
        marginTop: 30
      }}>
        <Text style={{ color: 'white', fontSize: 22 }}>Atividades da comunidade</Text>
        <View>
          <FlatList
            contentContainerStyle={{ paddingBottom: 20 }}
            data={publicacoes}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => openModal(item)}>
                <View style={{
                  borderWidth: 1,
                  borderColor: '#aaa',
                  borderRadius: 10,
                  padding: 10,
                  marginTop: 20,
                  display: 'flex',
                  flexDirection: 'row',
                }}>
                  <ImageBackground
                    source={{ uri: SERVER_URL + item.urlImagem }}
                    resizeMode="cover"
                    style={{
                      width: '67%',
                      height: 100,
                      borderRadius: 20,
                      marginTop: 20
                    }}
                  />

                  <View style={{
                    marginLeft: -50
                  }}>
                    <View>
                      <Text style={{ color: 'white', fontSize: 20 }}>{item.titulo}</Text>
                      <Text style={{ color: '#bbb' }}>{item.nomeUsuario}</Text>
                      <Text style={{ color: '#bbb', fontSize: 12 }}>{item.localizacao}</Text>

                      <View style={styles.intensity}>
                        <Text style={styles.intensityLabel}>Intensidade</Text>
                        <View style={styles.barBackground}>
                          <View
                            style={[
                              styles.barFill,
                              { width: `${item.intensidade}%` }
                            ]}
                          />
                        </View>
                      </View>
                      <View style={{
                        display: 'flex',
                        justifyContent: 'center',
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 10
                      }}>
                        <Ionicons name="flash-outline" size={13} color="#464EBA" />
                        <Text style={{ color: '#464EBA', fontSize: 12, marginLeft: 3 }}>{item.curtidas} Curtidas</Text>
                      </View>
                    </View>
                  </View>

                  <Modal
                    visible={modalVisible}
                    transparent
                    animationType="slide"
                    onRequestClose={closeModal}
                  >
                    <View style={styles.modalOverlay}>
                      <View style={styles.modalContent}>
                        {selected && (
                          <>
                            <ImageBackground
                              source={{ uri: SERVER_URL + selected.urlImagem }}
                              resizeMode="cover"
                              style={{
                                width: '100%',
                                height: 200,
                                borderRadius: 20,
                                marginTop: 20
                              }}
                            />
                            <Text style={{ color: 'white', fontSize: 20, marginTop: 20 }}>{selected.titulo}</Text>
                            <Text style={{ color: 'white', fontSize: 17 }}>{selected.descricao}</Text>
                            <View style={{
                              display: 'flex',
                              flexDirection: 'row',
                              alignItems: 'center'
                            }}>
                              <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold' }}>Autor:</Text>
                              <Text style={{ color: 'white', fontSize: 15 }}> {selected.nomeUsuario}</Text>
                            </View>

                            <TouchableOpacity onPress={() => {
                              closeModal();
                              navigation.navigate('PerfilUsuario', { userId: selected.idUsuario });
                            }}>
                              <Text style={{ color: 'white', fontSize: 15, marginTop: 15, textAlign: 'center' }}>
                                Ver perfil
                              </Text>
                            </TouchableOpacity>



                            <Button style={{ marginTop: 20 }} title={loading ? "Curtindo" : "🤍 Curtir"} onPress={handleCurtir} variant='info' />

                            <Button style={{ marginTop: 10 }} title="Fechar" onPress={closeModal} />
                          </>
                        )}
                      </View>
                    </View>
                  </Modal>
                </View>
              </TouchableOpacity>
            )} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  intensity: {
    marginTop: 16,
  },
  intensityLabel: {
    color: '#ccc',
    marginBottom: 4,
  },
  barBackground: {
    width: '100%',
    height: 8,
    backgroundColor: '#333',
    borderRadius: 4,
  },
  barFill: {
    height: 8,
    backgroundColor: '#5C5CE6',
    borderRadius: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#222',
    borderRadius: 8
  },
})
