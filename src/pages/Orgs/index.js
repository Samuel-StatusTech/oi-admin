import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Grid, Button, CircularProgress } from '@material-ui/core';
import SettingsIcon from '../../assets/icons/ic_config.svg';
import EaseGrid from '../../components/EaseGrid';
import ButtonRound from '../../components/ButtonRound';
import { Check, Close } from '@material-ui/icons';
const Settings = () => {
  const history = useHistory();
  const [data, setData] = useState([]);
  const [statusData, setStatusData] = useState({});
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);

  const columns = [
    { title: 'Cliente', field: 'name' },
    { title: 'Usuário', field: 'username' },
    {
      filter: true,

      title: 'Status',
      field: 'status',
      render: ({ id, status }) => {
        return status;
      },
    },
    {
      title: 'Permissões',
      render: ({ id }) => (
        <Button onClick={handleGotoEdit(id)} variant='outlined' size='small' color='primary'>
          Editar
        </Button>
      ),
    },
  ];
  const handleGotoCreate = () => {
    history.push(`/dashboard/organization/new`);
  };

  const handleGotoEdit = (id) => () => {
    history.push(`/dashboard/organization/${id}`);
  };

  if (loading) {
    return (
      <Grid container spacing={2} justify='center'>
        <Grid item>
          <CircularProgress />
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container spacing={2}>
      <Grid item lg={12} md={12} sm={12} xs={12}>
        {/* <EaseGrid
          columns={columns}
          data={data}
          toolbar={() => (
            <ButtonRound variant='contained' color='primary' onClick={handleGotoCreate}>
              Cadastrar cliente
            </ButtonRound>
          )}
        /> */}
      </Grid>
    </Grid>
  );
};

export const Icon = () => {
  return <img src={SettingsIcon} alt='Ícone configurações' />;
};

export default Settings;
