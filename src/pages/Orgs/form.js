import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Grid,
  TextField,
  Switch,
  FormControlLabel,
  Typography,
  Divider,
  Button,
  CircularProgress,
  withStyles,
  Card,
  CardContent,
} from '@material-ui/core';
import { MenuItem } from '@material-ui/core';
import { formatDateToMysqlDate } from '../../utils/date';
import { formatCNPJ } from './../../utils/utils';
import ClientsService from './../../service/clients';
import Clients from '../../models/Clients';

const validList = [
  { key: 'global', name: 'Global' },
  { key: 'event', name: 'Por Evento' },
];
const Organization = ({ history }) => {
  const { idOrg } = useParams();
  const [errorsVerify, setErrorsVerify] = useState({});
  const [action] = useState(idOrg === 'new');
  const { state } = history.location;
  const { save } = ClientsService();
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  // Usuário comum
  const [name, setName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [devices, setDevices] = useState(0);
  const [cashless, setCashless] = useState(false);
  const [status, setStatus] = useState(false);
  const [expireAt, setExpireAt] = useState(formatDateToMysqlDate(new Date()));

  const GreenSwitch = withStyles({
    switchBase: {
      '&$checked': {
        color: '#9ACD32',
      },
      '&$checked + $track': {
        backgroundColor: '#9ACD32',
      },
    },
    checked: {},
    track: {},
  })(Switch);

  useEffect(() => {
    if (!action) getData();
    // eslint-disable-next-line
  }, []);

  const handleSave = async () => {
    try {
      setButtonLoading(true);
      if (
        await save({
          name,
          CNPJ: cnpj?.replace(/\D/g, ''),
          devices,
          cashless,
          status,
          createdAt: +new Date(),
          expireAt: +new Date(expireAt),
        })
      ) {
        history.goBack();
      }
    } catch (error) {
      alert(error?.message ?? 'Ocorreu um erro');
    } finally {
      setButtonLoading(false);
    }
  };

  const handleEdit = async () => {
    try {
      setButtonLoading(true);
      if (
        await save(
          {
            uid: state.uid,
            name,
            CNPJ: cnpj?.replace(/\D/g, ''),
            devices,
            cashless,
            status,
            createdAt: state.createdAt,
            expireAt: +new Date(expireAt),
          },
          state.uid
        )
      ) {
        history.goBack();
      }
    } catch (error) {
      alert(error?.message ?? 'Ocorreu um erro');
    } finally {
      setButtonLoading(false);
    }
  };
  const getData = () => {
    setLoading(true);
    if (state) {
      setName(state.name);
      setCnpj(formatCNPJ(state.CNPJ));
      setDevices(state.devices);
      setCashless(state.cashless);
      setStatus(state.status);
      setExpireAt(formatDateToMysqlDate(new Date(state.expireAt)));
    }
    setLoading(false);
  };
  const isEmpty = (str) => {
    return !str || str.length === 0;
  };
  const nameInputVerify = (name) => {
    if (isEmpty(name)) return (errorsVerify.name = 'É necessário preencher este campo');
    if (!/^[a-zA-Z ]*$/.test(name)) return (errorsVerify.name = 'Esse campo só aceita letras.');
    errorsVerify.name = null;
    return false;
  };
  const cnpjVerify = (cnpj) => {
    if (!/^[0-9]{14}$/.test(cnpj.replace(/\D+/g, ''))) return (errorsVerify.cnpj = 'É necessário preencher este campo');
    errorsVerify.cnpj = null;
    return false;
  };
  const verifyInputs = () => {
    return nameInputVerify(name) || cnpjVerify(cnpj ?? '');
  };
  const handleSubmit = () => {
    try {
      if (verifyInputs()) throw { message: 'Um ou mais campos possui erro!' };
      if (action) {
        handleSave();
        return;
      }
      handleEdit();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleCancel = () => {
    history.push('/dashboard/organization');
  };
  return (
    <form>
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label='Nome ou Razão Social'
                    name='name'
                    value={name}
                    onChange={(e) => {
                      const value = e.target.value.slice(0, 80);
                      setName(value);
                      nameInputVerify(value);
                    }}
                    error={Boolean(errorsVerify?.name)}
                    helperText={errorsVerify?.name}
                    variant='outlined'
                    size='small'
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label='CNPJ'
                    name='CNPJ'
                    value={cnpj}
                    onChange={(e) => {
                      const value = formatCNPJ(e.target.value);
                      setCnpj(value);
                    }}
                    error={Boolean(errorsVerify?.cnpj)}
                    helperText={errorsVerify?.cnpj}
                    variant='outlined'
                    size='small'
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label='Número de dispositivos'
                    name='devices'
                    value={devices}
                    onChange={(e) => setDevices(e.target.value)}
                    variant='outlined'
                    type='number'
                    size='small'
                    InputLabelProps={{
                      shrink: true,
                    }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label='Data de vencimento'
                    name='devices'
                    value={expireAt}
                    onChange={(e) => setExpireAt(e.target.value)}
                    variant='outlined'
                    type='date'
                    size='small'
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Grid container spacing={2}>
                <Grid item>
                  <FormControlLabel
                    label='Permitido uso de cashless'
                    name='cashless'
                    value={cashless}
                    control={<GreenSwitch checked={cashless} onChange={(e) => setCashless(e.target.checked)} />}
                  />
                </Grid>
                <Grid item>
                  <FormControlLabel
                    label='Status'
                    name='status'
                    value={status}
                    control={<GreenSwitch checked={status} onChange={(e) => setStatus(e.target.checked)} />}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Grid container spacing={2}>
                <Grid item>
                  <Button variant='outlined' color='secondary' onClick={handleCancel}>
                    Cancelar
                  </Button>
                </Grid>
                <Grid item>
                  <Button onClick={() => handleSubmit()} variant='outlined' color='primary'>
                    {buttonLoading ? <CircularProgress size={25} /> : 'Salvar'}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </form>
  );
};

export default Organization;
