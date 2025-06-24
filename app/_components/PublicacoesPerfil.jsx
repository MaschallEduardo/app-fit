// PublicacoesPerfil.jsx
import React, { useState } from 'react';
import {
  FlatList,
  ImageBackground,
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { auth } from '../../firebase';
import { deletarPublicacao } from '../scripts/publicacao';
import { useNavigation } from '@react-navigation/native';

const SERVER_URL = Platform.OS === 'android'
  ? 'http://10.0.2.2:3000'
  : 'http://localhost:3000';

export default function PublicacoesPerfil({ publicacoes, onRefresh }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const me = auth.currentUser?.uid;
  const navigation = useNavigation()

  function openModal(item) {
    setSelected(item);
    setModalVisible(true);
  }
  function closeModal() {
    setModalVisible(false);
    setSelected(null);
  }
console.log('Itemmmm', publicacoes);

  async function handleDelete() {
    try {
      await deletarPublicacao(selected.id);
      Alert.alert('Sucesso', 'Publicação excluída');
      
      closeModal();
      onRefresh?.();
    } catch (e) {
      Alert.alert('Erro', e.message);
    }
  }

  return (
    <>
      <FlatList
        data={publicacoes}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => openModal(item)}>
            <ImageBackground
              source={{ uri: SERVER_URL + item.urlImagem }}
              style={styles.card}
              imageStyle={styles.backgroundImage}
            >
              <View style={styles.overlay}/>
              <View style={styles.header}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.title}>{item.titulo}</Text>
                  <Text style={styles.subtitle}>{item.localizacao}</Text>
                </View>
                <View style={styles.duration}>
                  <Ionicons name="time-outline" size={20} color="#fff" />
                  <Text style={styles.durationText}>{item.tempo}</Text>
                </View>
              </View>
              <View style={styles.likesBadge}>
                <Ionicons name="flash-outline" size={16} color="#fff" />
                <Text style={styles.likesText}>{item.curtidas} curtidas</Text>
              </View>
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
            </ImageBackground>
          </TouchableOpacity>
        )}
      />

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selected && (
              <>
                <Text style={styles.modalTitle}>{selected.titulo}</Text>
                <Text style={styles.modalText}>{selected.descricao}</Text>
                {selected.idUsuario === me && (
                  <TouchableOpacity
                    onPress={handleDelete}
                    style={styles.deleteButton}
                  >
                    <Text style={styles.deleteText}>Excluir</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                  <Text style={styles.closeText}>Fechar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  list: { padding: 20, gap: 20 },
  card: {
    height: 200,
    borderRadius: 24,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    padding: 16,
  },
  backgroundImage: { resizeMode: 'cover' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  subtitle: { color: '#fff', fontSize: 14, marginTop: 4 },
  duration: { flexDirection: 'row', alignItems: 'center' },
  durationText: { color: '#fff', marginLeft: 4, fontSize: 14 },
  likesBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 12,
  },
  likesText: { color: '#fff', marginLeft: 4, fontSize: 12 },
  intensity: { marginTop: 16 },
  intensityLabel: { color: '#ccc', marginBottom: 4 },
  barBackground: { width: '100%', height: 8, backgroundColor: '#333', borderRadius: 4 },
  barFill: { height: 8, backgroundColor: '#5C5CE6', borderRadius: 4 },

  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center', alignItems: 'center'
  },
  modalContent: {
    width: '80%', padding: 20,
    backgroundColor: '#222', borderRadius: 8
  },
  modalTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  modalText: { color: '#fff', fontSize: 14, marginBottom: 16 },
  deleteButton: {
    backgroundColor: '#c00', padding: 10,
    borderRadius: 6, marginBottom: 12
  },
  deleteText: { color: '#fff', textAlign: 'center', fontWeight: '600' },
  closeButton: { backgroundColor: '#444', padding: 10, borderRadius: 6 },
  closeText: { color: '#fff', textAlign: 'center' },
});
