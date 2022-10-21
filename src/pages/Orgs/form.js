import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Grid,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  CircularProgress,
  withStyles,
  Card,
  CardContent,
} from '@material-ui/core';
import { formatDateToMysqlDate } from '../../utils/date';
import { formatCNPJ } from './../../utils/utils';
import ImagePicker from '../../components/ImagePicker';
import ClientsService from './../../service/clients';
import ManagersService from './../../service/managers';
import Authentication from './../../service/auth';
import firebase from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import axios from 'axios';
import sha1 from 'sha1';

const Organization = ({ history }) => {
  const { idOrg } = useParams();
  const [errorsVerify, setErrorsVerify] = useState({});
  const [action] = useState(idOrg === 'new');
  const { state } = history.location;
  const [logoFixed, setLogoFixed] = useState(state ? state.logoFixed : null);
  const clientsService = ClientsService();
  const managersService = ManagersService();
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  // Usuário comum
  const [name, setName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [devices, setDevices] = useState(0);
  const [cashless, setCashless] = useState(false);
  const [status, setStatus] = useState(false);
  const [expireAt, setExpireAt] = useState(formatDateToMysqlDate(new Date()));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { createUser } = Authentication(firebase);
  const errors = {
    'auth/email-already-in-use': 'E-mail já existente!',
  };
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

  const handleLogoImage = async (callback) => {
    if(!logoFixed) {
      callback('');
    } else if(typeof logoFixed === 'string') {
      callback(logoFixed);
    } else {
      const pathFile = `logoFixed/${(new Date()).getTime()}-${logoFixed.name}`;
      const storageRef = ref(firebase.storage, pathFile);
      uploadBytes(storageRef, logoFixed).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((downloadURL) => {
          callback(downloadURL);
        });
      });
    }
  }

  const handleSave = async () => {
    try {
      setButtonLoading(true);
      let [user, error1] = await createUser(email, password);
      if (!error1) {
        handleLogoImage(async (imageUrl) => {
          const dbName = `DB${sha1(Math.random())}`;
          let [uid, error2] = await clientsService.save({
            name,
            dbName,
            CNPJ: cnpj?.replace(/\D/g, ''),
            devices,
            cashless,
            status,
            createdAt: +new Date(),
            expireAt: +new Date(expireAt),
            email,
            logoFixed: imageUrl,
            uidUser: user.uid,
          });
          let [, error3] = await managersService.save(
            {
              email,
              uid: user.uid,
              client: uid,
              dbName,
              master: true,
            },
            user.uid
          );
          if (!error2 && !error3) {
            const res = await axios.post(
              'https://api-databases.oitickets.com.br/newdatabase',
              { database: dbName },
              {
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            );
            if (res.data.success) {
              history.goBack();
            }
          } else {
            throw new Error('Erro ao cadastrar no banco');
          }
        })
      } else {
        throw new Error(errors[user]);
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
      handleLogoImage(async (imageUrl) => {
        if (
          await clientsService.save(
            {
              uid: state.uid,
              name,
              CNPJ: cnpj?.replace(/\D/g, ''),
              devices,
              cashless,
              status,
              email: state.email ?? null,
              logoFixed: imageUrl,
              uidUser: state.uidUser ?? null,
              createdAt: state.createdAt,
              expireAt: +new Date(expireAt),
            },
            state.uid
          )
        ) {
          history.goBack();
        }
      })
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
      setEmail(state.email);
    }
    setLoading(false);
  };
  const isEmpty = (str) => {
    return !str || str.length === 0;
  };
  const nameInputVerify = (name) => {
    if (isEmpty(name)) return (errorsVerify.name = 'É necessário preencher este campo');
    errorsVerify.name = null;
    return false;
  };
  const cnpjVerify = (cnpj) => {
    if (!/^[0-9]{14}$/.test(cnpj.replace(/\D+/g, ''))) return (errorsVerify.cnpj = 'É necessário preencher este campo');
    errorsVerify.cnpj = null;
    return false;
  };
  const emailInputVerify = (email) => {
    if (isEmpty(email)) return (errorsVerify.email = 'É necessário preencher este campo');
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email))
      return (errorsVerify.email = 'Endereço de email inválido');
    errorsVerify.email = null;
    return false;
  };
  const passwordInputVerify = (password) => {
    if (!/^\S{4,}/.test(password)) return (errorsVerify.password = 'Mínimo 4 caracteres');
    if (!/^\S*$/i.test(password)) return (errorsVerify.password = 'Não pode espaço em branco no campo');
    errorsVerify.password = null;
    return false;
  };
  const verifyInputs = () => {
    return nameInputVerify(name) || cnpjVerify(cnpj ?? '') || emailInputVerify(email) || passwordInputVerify(password);
  };
  const verifyInputsEdit = () => {
    return nameInputVerify(name) || cnpjVerify(cnpj ?? '');
  };
  const handleSubmit = () => {
    try {
      if(buttonLoading)
        return;
      if (action) {
        if (verifyInputs()) throw { message: 'Um ou mais campos possui erro!' };
        handleSave();
        return;
      }
      if (verifyInputsEdit()) throw { message: 'Um ou mais campos possui erro!' };
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
                <Grid item xs={12}>
                  <TextField
                    label='E-mail'
                    name='email'
                    value={email}
                    onChange={(e) => {
                      const value = e.target.value;
                      setEmail(value);
                      emailInputVerify(value);
                    }}
                    error={Boolean(errorsVerify?.email)}
                    helperText={errorsVerify?.email}
                    variant='outlined'
                    size='small'
                    type='email'
                    disabled={!action}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label='Senha'
                    name='password'
                    value={password}
                    onChange={(e) => {
                      const value = e.target.value;
                      setPassword(value);
                      passwordInputVerify(password);
                    }}
                    error={Boolean(errorsVerify?.password)}
                    helperText={errorsVerify?.password}
                    variant='outlined'
                    size='small'
                    type='password'
                    disabled={!action}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
            <ImagePicker
              label='Logo fixa'
              name='imageLogo'
              image={logoFixed}
              setImage={setLogoFixed}
            />
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
