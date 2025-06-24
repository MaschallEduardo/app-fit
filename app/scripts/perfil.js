import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { Platform } from 'react-native';

const SERVER_URL = Platform.OS === 'android'
  ? 'http://10.0.2.2:3000'
  : 'http://localhost:3000';

export async function fetchPerfilUsuario() {
  const user = auth.currentUser;
  if (!user) throw new Error('Usuário não autenticado');

  const ref = doc(db, 'appFit_usuarios', user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error('Perfil não encontrado no Firestore');

  return snap.data();
}

export async function fetchFotoPerfilUrl() {
  const data = await fetchPerfilUsuario();

  if (!data.fotoPerfil) return null;
  return SERVER_URL + data.fotoPerfil;
}

async function uploadProfilePhoto(userId, localUri) {
  const form = new FormData();
  form.append('userId', userId);
  form.append('photo', {
    uri: localUri,
    name: 'fotoPerfil/fotoPerfil.jpg',
    type: 'image/jpeg',
  });

  const resp = await fetch(`${SERVER_URL}/uploadPerfil`, {
    method: 'POST',
    body: form,
  });
  if (!resp.ok) throw new Error(`Upload falhou: ${resp.statusText}`);
  const { url } = await resp.json();
  return url;
}

export async function updatePerfilUsuario({ nome, telefone, imagemUri }) {
  const user = auth.currentUser;
  if (!user) throw new Error('Usuário não autenticado');

  const refDoc = doc(db, 'appFit_usuarios', user.uid);
  const dataToUpdate = { nome, telefone };

  if (imagemUri) {
    const photoPath = await uploadProfilePhoto(user.uid, imagemUri);
    dataToUpdate.fotoPerfil = photoPath;
  }

  await updateDoc(refDoc, dataToUpdate);
}
