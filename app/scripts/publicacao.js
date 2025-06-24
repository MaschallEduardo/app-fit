import { Platform } from 'react-native';
import { auth, db } from '../../firebase';
import { collection, addDoc, updateDoc, serverTimestamp, getDocs, query, where, orderBy, doc, getDoc, increment, deleteDoc } from 'firebase/firestore';
import * as Network from 'expo-network';

function getServerUrl() {
  return Platform.OS === 'android'
    ? 'http://10.0.2.2:3000'
    : 'http://localhost:3000';
}

async function uploadPublicacaoImage(userId, pubId, localUri) {
  const server = getServerUrl();
  const form = new FormData();
  form.append('userId', userId);
  form.append('pubId', pubId);
  form.append('photo', { uri: localUri, name: 'publicacao.jpg', type: 'image/jpeg' });

  const resp = await fetch(`${server}/uploadPublicacao`, { method: 'POST', body: form });
  if (!resp.ok) throw new Error(`Upload falhou: ${resp.statusText}`);
  const { url } = await resp.json();
  return url;
}

/**
 * @param {{ titulo: string, descricao: string, localizacao: string, intensidade: string, tempo: string, imagemUri?: string }} params
 * @returns {Promise<string>} ID da publicação
 */

/**
 * @param {string} pubId 
 */

/**
 * @param {string} userId
 * @returns {Promise<Array>}
 */
export async function criarPublicacao({
  titulo,
  descricao,
  localizacao,
  intensidade,
  tempo,
  imagemUri
}) {
  const user = auth.currentUser
  if (!user) throw new Error('Usuário não autenticado')

  const userRef = doc(db, 'appFit_usuarios', user.uid)
  const userSnap = await getDoc(userRef)
  if (!userSnap.exists()) {
    throw new Error('Dados do usuário não encontrados em appFit_usuarios')
  }
  const { nome } = userSnap.data()

  const pubRef = await addDoc(
    collection(db, 'appFit_publicacoes'),
    {
      idUsuario: user.uid,
      nomeUsuario: nome,
      titulo,
      descricao,
      localizacao,
      urlImagem: null,
      curtidas: 0,
      intensidade,
      tempo,
      criadoEm: serverTimestamp()
    }
  )

  if (imagemUri) {
    const url = await uploadPublicacaoImage(user.uid, pubRef.id, imagemUri)
    await updateDoc(pubRef, { urlImagem: url })
  }

  return pubRef.id
}

export async function fetchPublicacoesUsuario() {
  const user = auth.currentUser;
  if (!user) throw new Error('Usuário não autenticado');

  const col = collection(db, 'appFit_publicacoes');
  const q = query(
    col,
    where('idUsuario', '==', user.uid),
    orderBy('criadoEm', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function fetchTodasPublicacoes() {
  const col = collection(db, 'appFit_publicacoes');
  const q = query(col, orderBy('criadoEm', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function curtirPublicacao(pubId) {
  const user = auth.currentUser;
  if (!user) throw new Error('Usuário não autenticado');
  const ref = doc(db, 'appFit_publicacoes', pubId);
  await updateDoc(ref, { curtidas: increment(1) });
}

export async function fetchPublicacoesPorUsuario(userId) {
  const col = collection(db, 'appFit_publicacoes');
  const q = query(
    col,
    where('idUsuario', '==', userId),
    orderBy('criadoEm', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function deletarPublicacao(pubId) {
  const ref = doc(db, 'appFit_publicacoes', pubId);
  await deleteDoc(ref);
}