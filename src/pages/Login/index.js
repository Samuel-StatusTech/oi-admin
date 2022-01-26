import React, { useState } from 'react';
import { Grid, TextField, CircularProgress, Button, Typography } from '@material-ui/core';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import CardContainer from '../../components/CardContainer';
import InputPassword from '../../components/Input/Password';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const validMessages = {
  USERNAME: 'Usuário não encontrado',
  PASSWORD: 'Senha inválida',
};

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const history = useHistory();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (!/^[a-zA-Z]{1}(\w)+$/.test(username))
        throw { message: 'Não pode espaço em branco e nem caractere especial no nome de usuário' };
      if (!/^\S*$/.test(password)) throw { message: 'Não pode espaço em branco no campo de senha' };
      const { data, status, statusText } = await console.log('autenticar'); //TODO: Autenticar

      if (status === 200) {
        setErrors({});

        localStorage.setItem('token', data.token);
        history.push('/dashboard');
      } else {
        alert(statusText);
      }
    } catch (error) {
      if (error.isAxiosError) {
        const response = error.response;

        if (!response) {
          setErrors({});
          setAlertMessage('Servidor não esta respondendo');
          setOpenAlert(true);
        } else if (response.data.error === validMessages.USERNAME) {
          setErrors({ username: true });
        } else if (response.data.error === validMessages.PASSWORD) {
          setErrors({ password: true });
        } else {
          setAlertMessage(response?.data);
          setOpenAlert(true);
          setErrors({});
        }
      } else {
        setErrors({});
        setAlertMessage(error?.message ?? 'Erro não esperado, tente novamente mais tarde');
        setOpenAlert(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <CardContainer
        alert={{
          severity: 'error',
          openned: openAlert,
          onClose: () => {
            setOpenAlert(false);
          },
          message: alertMessage,
        }}
      >
        <form autoComplete='off' onSubmit={handleLogin}>
          <Grid container direction='column' spacing={2}>
            <Typography variant='h5' align='center' component='div'>
              Admin
            </Typography>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <TextField
                label='Login'
                value={username}
                style={{ backgroundColor: '#fff', borderRadius: 5 }}
                onChange={(e) => setUsername(e.target.value)}
                variant='outlined'
                fullWidth
                error={errors.username}
                helperText={errors.username ? validMessages.USERNAME : null}
              />
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <InputPassword
                label='Senha'
                value={password}
                style={{ backgroundColor: '#fff', borderRadius: 5 }}
                type='password'
                onChange={(e) => setPassword(e.target.value)}
                variant='outlined'
                fullWidth
                error={errors.password}
                helperText={errors.password ? validMessages.PASSWORD : null}
              />
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Button
                type='submit'
                variant='outlined'
                style={{
                  backgroundColor: '#0097FF',
                  borderRadius: 5,
                  color: '#FFF',
                }}
                fullWidth
              >
                {loading && <CircularProgress color='inherit' size={25} />}
                {!loading && 'Entrar'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContainer>
    </Container>
  );
};

export default Login;
