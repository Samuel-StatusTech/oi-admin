import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Grid, Button, CircularProgress } from '@material-ui/core';
import SettingsIcon from '../../assets/icons/ic_config.svg';
import EaseGrid from '../../components/EaseGrid';
import ButtonRound from '../../components/ButtonRound';
import { Check, Close } from '@material-ui/icons';
import ClientsService from './../../service/clients';
import { formatCNPJ } from './../../utils/utils';
import firebase from '../../firebase';
import { ref, onValue } from "firebase/database";
import axios from 'axios';

const Settings = () => {
  const history = useHistory();
  const { data, reload, removeClient } = ClientsService();
  useEffect(() => {
    if (data.length) setLoading(false);
  }, [data]);
  const [loading, setLoading] = useState(true);
  const columns = [
    { title: 'Cliente', field: 'name' },
    {
      title: 'CNPJ',
      field: 'CNPJ',
      render: ({ CNPJ }) => {
        return formatCNPJ(CNPJ);
      },
    },
    { title: 'E-mail', field: 'email' },
    {
      title: 'Status',
      field: 'status',
      render: ({ status }) => {
        return status ? <Check /> : <Close />;
      },
    },
    { title: 'Dispositivos', field: 'devices' },
    {
      title: 'Cashless',
      field: 'cashless',
      render: ({ cashless }) => {
        return cashless ? <Check /> : <Close />;
      },
    },
    {
      title: 'Ações',
      render: (dados) => (
        <>
          <Button onClick={() => handleGotoEdit(dados)} variant='outlined' size='small' color='primary'>
            Editar
          </Button>
          <Button onClick={() => handleDelete(dados)} style={{marginLeft: 10}} variant='outlined' size='small' color='secondary'>
            Excluir
          </Button>
        </>
      ),
    },
  ];
  const handleGotoCreate = () => {
    history.push(`/dashboard/organization/new`);
  };

  const handleGotoEdit = (dados) => {
    history.push({ pathname: `/dashboard/organization/${dados.uid}`, state: dados.toJson() });
  };

  const handleDelete = async(dados) => {
    if(window.confirm('Tem certeza que deseja excluir esse cliente?')) {
      setLoading(true);
      await removeClient(dados.uid);
      reload();
    }
  };

  const handleUpdate = async () => {
    setLoading(true)
    onValue(ref(firebase.db, '/Clients'), async (snapshot) => {
      const clients = snapshot.val();
      for(const key in clients) {
        const { dbName } = clients[key];
        const res = await axios.post(
          'https://api-databases.oitickets.com.br/updatedatabase',
          { database: dbName },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        console.log(res.data)
      }
      setLoading(false)
    });
  };

  return loading ? (
    <Grid container spacing={2} justifyContent='center'>
      <Grid item>
        <CircularProgress />
      </Grid>
    </Grid>
  ) : (
    <Grid container spacing={2}>
      <Grid item lg={12} md={12} sm={12} xs={12}>
        <EaseGrid
          columns={columns}
          data={data}
          toolbar={() => (
            <>
              <ButtonRound variant='contained' color='primary' onClick={() => handleGotoCreate()}>
                Cadastrar cliente
              </ButtonRound>
              {/*<ButtonRound style={{marginLeft: 20}} variant='contained' color='warning' onClick={() => handleUpdate()}>
                Atualizar clientes
              </ButtonRound>*/}
            </>
          )}
        />
      </Grid>
    </Grid>
  );
};

export const Icon = () => {
  return <img src={SettingsIcon} alt='Ícone configurações' />;
};

export default Settings;
