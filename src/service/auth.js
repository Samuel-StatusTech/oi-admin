import { useEffect, useState } from 'react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
const Authentication = (firebase) => {
  const [authUser, setAuthUser] = useState(null);
  useEffect(() => {
    onAuthStateChanged(firebase.auth, (user) => {
      setAuthUser(user ?? null);
    });
  }, []);
  const authenticate = (email, password) => {
    return signInWithEmailAndPassword(firebase.auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setAuthUser(user);
        return [user, false];
      })
      .catch((error) => {
        const errorCode = error.code;
        setAuthUser(null);
        return [errorCode, true];
      });
  };
  const logout = () => {
    return signOut(firebase.auth)
      .then(() => {
        setAuthUser(null);
        return [null, false];
      })
      .catch((error) => {
        return [error.message, true];
      });
  };
  return { authenticate, authUser, logout };
};

export default Authentication;
