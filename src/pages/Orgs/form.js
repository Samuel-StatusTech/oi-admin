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
  MenuItem,
  Typography,
  Divider,
} from '@material-ui/core';
import { formatDateToMysqlDate } from '../../utils/date';
import { formatCNPJ, ufList } from './../../utils/utils';
import ImagePicker from '../../components/ImagePicker';
import ClientsService from './../../service/clients';
import ManagersService from './../../service/managers';
import Authentication from './../../service/auth';
import firebase from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import axios from 'axios';
import sha1 from 'sha1';
import { cellPhoneMask, percentageMask, removeMask } from '../../utils/mask';
import FormECommerce from './formECommerce';

const Organization = ({ history }) => {
  const eCommerceDefault = {
    adminTax: false,
    adminTaxValue: 0,
    adminTaxPercentage: 0,
    adminTaxMinimum: 0,
    chargeClient: false,
    credit: false,
    pix: false,
    hasSplit: false,
    splitValue: 0,
    splitPercentage: 0,
    gatewayToken: ''
  };
  const taxesDefault = {
    debit: 0,
    credit: 0,
    pix: 0
  }
  const { idOrg } = useParams();
  const [errorsVerify, setErrorsVerify] = useState({});
  const [action] = useState(idOrg === 'new');
  const { state } = history.location;
  const clientsService = ClientsService();
  const managersService = ManagersService();
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [logoFixed, setLogoFixed] = useState(state ? state.logoFixed: null);
  const [password, setPassword] = useState('');
  const [taxes, setTaxes] = useState(taxesDefault)
  const [eCommerce, setECommerce] = useState(eCommerceDefault);
  // Usuário comum
  const [client, setClient] = useState({
    name: '',
    CNPJ: '',
    devices: 0,
    cashless: false,
    status: false,
    hasECommerce: false,
    expireAt: formatDateToMysqlDate(new Date()),
    email: '',
    uf:'',
    city:'',
    phone:'',
    uidUser: ''
  })
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
    const logoFixed = client.logoFixed;
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
      let [user, error1] = await createUser(client.email, password);
      if (!error1) {
        handleLogoImage(async (imageUrl) => {
          const dbName = `DB${sha1(Math.random())}`;
          let [uid, error2] = await clientsService.save({
            ...client,
            dbName, 
            createdAt: +new Date(),
            expireAt: +new Date(client.expireAt),
            logoFixed: imageUrl,
            uidUser: user.uid,
            taxes,
            eCommerce
          });
          let [, error3] = await managersService.save(
            {
              email: client.email,
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
        setButtonLoading(false);
      } else {
        setButtonLoading(false);
        throw new Error(errors[user]);
      }
    } catch (error) {
      alert(error?.message ?? 'Ocorreu um erro');
      setButtonLoading(false);
    } 
  };

  const handleEdit = async () => {
    try {
      setButtonLoading(true);
      handleLogoImage(async (imageUrl) => {
        if (
          await clientsService.saveUpdate(
            {
              ...client,
              uid: state.uid,
              email: state.email ?? null,
              logoFixed: imageUrl,
              uidUser: state.uidUser ?? null,
              createdAt: state.createdAt,
              expireAt: +new Date(client.expireAt),
              taxes,
              eCommerce
            },
            state.uid
          )
        ) {
          history.goBack();
        }
      })
      setButtonLoading(false);
    } catch (error) {
      alert(error?.message ?? 'Ocorreu um erro');
      setButtonLoading(false);
    } 
  };
  const getData = () => {
    setLoading(true);
    if (state) {
      const taxesVal = state?.taxes ?? taxesDefault;
      const eCommerceVal = state?.eCommerce ?? eCommerceDefault;
      const date = new Date(state.expireAt);
      date.setHours(date.getHours() + 3);
      setClient({
        ...state,
        expireAt:formatDateToMysqlDate(date),
      });
      setTaxes(taxesVal);
      setECommerce(eCommerceVal);
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
    return !client.uf || nameInputVerify(client.name) || cnpjVerify(client.CNPJ ?? '') || emailInputVerify(client.email) || passwordInputVerify(password);
  };
  const verifyInputsEdit = () => {
    return !client.uf || nameInputVerify(client.name) || cnpjVerify(client.CNPJ ?? '');
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
                    value={client.name}
                    onChange={(e) => {
                      const value = e.target.value.slice(0, 80);
                      setClient({...client, name: value})
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
                    value={formatCNPJ(client.CNPJ)}
                    onChange={(e) => {
                      setClient({...client, CNPJ: removeMask(e.target.value)})
                    }}
                    error={Boolean(errorsVerify?.cnpj)}
                    helperText={errorsVerify?.cnpj}
                    variant='outlined'
                    size='small'
                    fullWidth
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    label='UF'
                    name='uf'
                    value={client.uf}
                    onChange={(e) => setClient({...client, uf: e.target.value})}
                    variant='outlined'
                    size='small'
                    fullWidth
                    select
                  >
                    {ufList.map((item) => <MenuItem value={item}>{item}</MenuItem>)}
                  </TextField>
                </Grid>
                <Grid item xs={8}>
                  <TextField
                    label='Cidade'
                    name='city'
                    value={client.city}
                    onChange={(e) => {
                      const value = e.target.value.slice(0, 255);
                      setClient({...client, city: value})
                    }}
                    error={Boolean(errorsVerify?.city)}
                    helperText={errorsVerify?.city}
                    variant='outlined'
                    size='small'
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label='Telefone'
                    name='phone'
                    value={cellPhoneMask(client.phone)}
                    onChange={(e) => {
                      setClient({...client, phone: removeMask(e.target.value)})
                    }}
                    error={Boolean(errorsVerify?.phone)}
                    helperText={errorsVerify?.phone}
                    variant='outlined'
                    size='small'
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label='Número de dispositivos'
                    name='devices'
                    value={client.devices}
                    onChange={(e) => setClient({...client, devices: e.target.value})}
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
                    value={client.expireAt}
                    onChange={(e) => setClient({...client, expireAt: e.target.value})}
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
                    value={client.email}
                    onChange={(e) => {
                      const value = e.target.value;
                      setClient({...client, email: value})
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
                {action && <Grid item xs={12}>
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
                    fullWidth
                  /> 
                </Grid>}
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
            <Grid item xs={4}>
              <TextField
                label='Taxa PIX'
                 name='pix'
                value={percentageMask(taxes.pix)}
                onChange={(e) => setTaxes({...taxes, pix: removeMask(e.target.value)})}
                error={Boolean(errorsVerify?.taxes?.pix)}
                helperText={errorsVerify?.taxes?.pix}
                variant='outlined'
                size='small'
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label='Taxa crédito'
                name='credit'
                value={percentageMask(taxes.credit)}
                onChange={(e) => setTaxes({...taxes, credit: removeMask(e.target.value)})}
                error={Boolean(errorsVerify?.taxes?.credit)}
                helperText={errorsVerify?.taxes?.credit}
                variant='outlined'
                size='small'
                fullWidth
                />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label='Taxa débito'
                name='debit'
                value={percentageMask(taxes.debit)}
                onChange={(e) => setTaxes({...taxes, debit: removeMask(e.target.value)})}
                error={Boolean(errorsVerify?.taxes?.debit)}
                helperText={errorsVerify?.taxes?.debit}
                variant='outlined'
                size='small'
                fullWidth
                />
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Grid container spacing={2}>
                <Grid item>
                  <FormControlLabel
                    label='Permitido uso de cashless'
                    name='cashless'
                    value={client.cashless}
                    control={<GreenSwitch checked={client.cashless} onChange={(e) => setClient({...client, cashless: e.target.checked})} />}
                  />
                </Grid>
                <Grid item>
                  <FormControlLabel
                    label='Status'
                    name='status'
                    value={client.status}
                    control={<GreenSwitch checked={client.status} onChange={(e) => setClient({...client, status: e.target.checked})} />}
                  />
                </Grid>
                <Grid item>
                  <FormControlLabel
                    label='Loja virtual'
                    name='hasEcommerce'
                    value={client.hasECommerce}
                    control={<GreenSwitch checked={client.hasECommerce} onChange={(e) => {setClient({...client, hasECommerce: e.target.checked}); setECommerce(eCommerceDefault)}} />}
                  />
                </Grid>
              </Grid>
            </Grid>
            {client.hasECommerce && (<>
              <Grid item xs={12}>
                <Typography style={{ fontWeight: 'bold' }}>CONFIGURAÇÃO LOJA VIRTUAL</Typography>
                <Divider />
              </Grid>
              <FormECommerce data={eCommerce} setData={setECommerce} />
            </>)}
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
