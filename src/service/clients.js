import firebase from '../firebase';
import { ref, onValue } from 'firebase/database';
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
        clients.push(clientObj.fromJson(snapshotVal[i]));
      }
      setData(clients);
    });
    return () => {
      setData([]);
    };
  }, []);

  return { data };
};
export default ClientsService;
