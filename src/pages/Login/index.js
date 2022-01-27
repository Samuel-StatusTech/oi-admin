import React, { useState } from 'react';
import { Grid, TextField, CircularProgress, Button, Typography } from '@material-ui/core';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import CardContainer from '../../components/CardContainer';
import InputPassword from '../../components/Input/Password';

import auth from '../../service/auth';
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const validMessages = {
  LOGIN: 'Usuário não encontrado',
  PASSWORD: 'Senha inválida',
};

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const history = useHistory();
  const authentication = async () => {
    const authLogin = await auth.authenticate(login, password);
    return authLogin;
  };
  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    const [user, error] = await authentication();
    if (error) {
      setOpenAlert(true);
      setAlertMessage('Login Incorreto!');
    } else {
      history.push('/dashboard');
    }
    setLoading(false);
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
                value={login}
                style={{ backgroundColor: '#fff', borderRadius: 5 }}
                onChange={(e) => setLogin(e.target.value)}
                variant='outlined'
                fullWidth
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
