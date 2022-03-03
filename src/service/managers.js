import firebase from '../firebase';
import { ref, onValue, set, push, child } from 'firebase/database';
import { useState, useEffect } from 'react';
import Managers from '../models/Managers';

const ManagersService = () => {
  const table = 'Managers';
  const [data, setData] = useState([]);
  const load = ref(firebase.db, table);

  useEffect(() => {
    onValue(load, (snapshot) => {
      let managers = [];
      const snapshotVal = snapshot.val();
      for (let i in snapshotVal) {
        const managersObj = Managers();
        managers.push(managersObj.fromJson({ uid: i, ...snapshotVal[i] }));
      }
      setData(managers);
    });
    return () => {
      setData([]);
    };
  }, []);
  const save = (data, uid = null) => {
    let key = uid;
    if (!uid) {
      throw new Error('Necessário uid do usuário!');
    }
    return set(ref(firebase.db, `${table}/${key}`), data)
      .then(() => [key, false])
      .catch(() => [null, true]);
  };
  return { data, save };
};
export default ManagersService;
