import firebase from '../firebase';
import { ref, onValue, set, push, child } from 'firebase/database';
import { useState, useEffect } from 'react';
import Clients from '../models/Clients';

const ClientsService = () => {
  const table = 'Clients';
  const [data, setData] = useState([]);
  const load = ref(firebase.db, table);

  useEffect(() => {
    onValue(load, (snapshot) => {
      let clients = [];
      const snapshotVal = snapshot.val();
      for (let i in snapshotVal) {
        const clientObj = Clients();
        clients.push(clientObj.fromJson({ uid: i, ...snapshotVal[i] }));
      }
      setData(clients);
    });
    return () => {
      setData([]);
    };
  }, []);
  const save = (data, uid = null) => {
    let key = uid;
    if (!uid) {
      key = push(child(ref(firebase.db), table)).key;
    }
    return set(ref(firebase.db, `${table}/${key}`), data)
      .then(() => true)
      .catch(() => false);
  };
  return { data, save };
};
export default ClientsService;
