import React from 'react';
import { AppBar, Toolbar, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory, Link } from 'react-router-dom';
import MenuIcon from '@material-ui/icons/Menu';

import logo from '../../assets/images/logo_blue.png';

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
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
