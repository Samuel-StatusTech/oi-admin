import firebase from '../firebase';
import { signInWithEmailAndPassword, signOut, getIdToken } from 'firebase/auth';
function authenticate(email, password) {
  return signInWithEmailAndPassword(firebase.auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      return [user, false];
    })
    .catch((error) => {
      const errorCode = error.code;
      return [errorCode, true];
    });
}
function logout() {
  return signOut(firebase.auth)
    .then(() => {
      return [null, false];
    })
    .catch((error) => {
      return [error.message, true];
    });
}
function getUser() {
  return getIdToken();
}
export default { authenticate, logout };
