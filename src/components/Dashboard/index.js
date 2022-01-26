import React, { useState, useEffect } from 'react';
import { useTheme } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import Navbar from '../Navbar';
import SidebarGeneric from '../Sidebar';
import ContentGeneric from '../Content';
import admin from '../../router/admin';

const Dashboard = () => {
  const [open, toggle] = useState(true);

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));

  useEffect(() => {
    if (matches) {
      toggle(true);
    } else {
      toggle(false);
    }
  }, [matches]);

  return (
    <div style={{ backgroundColor: '#f5f7fa', height: '100%' }}>
      <SidebarGeneric open={open} toggle={toggle} list={admin} />
      <Navbar toggle={toggle} />
      <ContentGeneric open={open} path='/dashboard' />
    </div>
  );
};

export default Dashboard;
