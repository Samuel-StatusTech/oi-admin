import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Grid, Button, CircularProgress } from '@material-ui/core';
import SettingsIcon from '../../assets/icons/ic_config.svg';
import EaseGrid from '../../components/EaseGrid';
import ButtonRound from '../../components/ButtonRound';
import { Check, Close } from '@material-ui/icons';
import ClientsService from './../../service/clients';
import { formatCNPJ } from './../../utils/utils';
const Settings = () => {
  const history = useHistory();
  const { data } = ClientsService();
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
      render: ({ uid, CNPJ, cashless, createdAt, devices, expireAt, name, status }) => (
        <Button
          onClick={() => handleGotoEdit({ uid, CNPJ, cashless, createdAt, devices, expireAt, name, status })}
          variant='outlined'
          size='small'
          color='primary'
        >
          Editar
        </Button>
      ),
    },
  ];
  const handleGotoCreate = () => {
    history.push(`/dashboard/organization/new`);
  };

  const handleGotoEdit = (dados) => {
    history.push({ pathname: `/dashboard/organization/${dados.uid}`, state: dados });
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
            <ButtonRound variant='contained' color='primary' onClick={() => handleGotoCreate()}>
              Cadastrar cliente
            </ButtonRound>
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
