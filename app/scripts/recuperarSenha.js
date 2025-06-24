

/**
 * @param {string} email 
 */

import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase";

export async function recuperarSenha(email) {
    console.log("Email", email);
    
    if (!email) throw { code: 'empty-email' };
    return sendPasswordResetEmail(auth, email);
}
