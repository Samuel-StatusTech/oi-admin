import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, IconButton, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory, Link } from 'react-router-dom';
import MenuIcon from '@material-ui/icons/Menu';

import logo from '../../assets/images/logo_blue.png';
import UserButton from './../UserButton/index';
import Authentication from './../../service/auth';
import firebase from '../../firebase';

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    background: '#fff',
    color: '#666666',
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  sideBarContent: {
    width: 50,
    [theme.breakpoints.up('md')]: {
      width: 260,
    },
  },
}));

const Navbar = ({ toggle, event }) => {
  const styles = useStyles();
  const history = useHistory();
  const { logout, authUser } = Authentication(firebase);
  const onLogout = () => {
    logout();
    history.push('/login');
  };
  useEffect(() => {
    if (authUser === false) history.push('/login');
  }, [authUser]);
  return (
    <AppBar className={styles.appBar}>
      <Toolbar>
        <div className={styles.sectionMobile}>
          <IconButton onClick={() => toggle((previous) => !previous)}>
            <MenuIcon />
          </IconButton>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Link to='/select'>
            <img
              src={logo}
              alt='logo'
              style={{
                marginBottom: '4px',
                display: 'block',
                marginRight: '8px',
              }}
            />
          </Link>
        </div>
        <div style={{ flex: 1 }} />
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        ></div>
        <Grid container xs={12}>
          <Grid item lg={11} md={10} xs={0}></Grid>
          <Grid item lg={1} md={2} xs={12}>
            <UserButton onLogout={onLogout} />
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
