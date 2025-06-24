import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../firebase'

export async function registrarUsuario(nome, email, telefone, password, address) {
  console.log('>> registrarUsuario:', { nome, email, telefone, password });
  console.log('>> db é:', db);

  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const uid = userCredential.user.uid;
  console.log('>> novo uid:', uid);

  try {
    const ref = doc(db, 'appFit_usuarios', uid);
    console.log('>> gravando em:', ref.path);
    await setDoc(ref, {
      nome,
      email,
      telefone,
      cidade: address.city ?? null,
      estado: address.region ?? null,
      criadoEm: serverTimestamp()
    });
    console.log('>> setDoc OK');
  } catch (e) {
    console.error('‼️ erro no setDoc:', e);
    throw e;
  }

  return userCredential;
}
