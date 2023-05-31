import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Grid, Button, CircularProgress } from '@material-ui/core';
import SettingsIcon from '../../assets/icons/ic_config.svg';
import EaseGrid from '../../components/EaseGrid';
import DevicesService from '../../service/devices';
const Settings = () => {
  const history = useHistory();
  const { data, reload, unlink } = DevicesService();
  useEffect(() => {
    if (data.length) setLoading(false);
  }, [data]);
  const [loading, setLoading] = useState(true);
  
  const columns = [
    { title: 'IMEI', field: 'imei' },
    {
      title: 'Cliente',
      field: 'client'
    },
    {
      title: 'Ações',
      render: (dados) => (
        <Grid direction='row'>
          <Button onClick={() => handleUnlink(dados.imei)} style={{marginLeft: 10}} variant='outlined' size='small' color='secondary'>
            Desvincular
          </Button>

        </Grid>
      ),
    },
  ];
  const handleUnlink = async(imei) => {
    if(await window.confirm('Deseja realmente desvincular?')){
      await unlink(imei);
      setLoading(true);
      await reload();
    }
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
        />
      </Grid>
    </Grid>
  );
};

export const Icon = () => {
  return <img src={SettingsIcon} alt='Ícone configurações' />;
};

export default Settings;
