import firebase from '../firebase';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
const auth = getAuth();
const user = auth.currentUser;
function authenticate(email, password) {
  return signInWithEmailAndPassword(auth, email, password)
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
  return signOut(auth)
    .then(() => {
      return [user, true];
    })
    .catch((error) => {
      return [error.message, false];
    });
}
export default { authenticate, logout, user };
