import React, { Fragment, useState } from 'react';
import { Drawer, List, ListItem, ListItemIcon, Collapse, ListItemText, useMediaQuery } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useHistory, useLocation } from 'react-router-dom';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import RouteList from '../../router/admin';

const useStyles = makeStyles((theme) => ({
  toolbar: {
    ...theme.mixins.toolbar,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
  },
  drawer: {
    width: 180,
    background: '#FFF',
    color: '#505152',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  links: {
    textDecoration: 'none',
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightMedium,
  },
  list: {},
  itemTitle: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'block',
      marginLeft: 10,
    },
  },
  selectedPage: {
    borderLeft: '5px solid #0097FF',
    background: 'linear-gradient(90deg, #EEEEEE, #F5F7FB)',
    color: '#0097FF',
    display: 'flex',
    justifyContent: 'center',
    [theme.breakpoints.up('md')]: {
      justifyContent: 'flex-start',
    },
  },
  page: {
    borderLeft: '5px solid #f2f2f2',
    display: 'flex',
    justifyContent: 'center',
    [theme.breakpoints.up('md')]: {
      justifyContent: 'flex-start',
    },
  },
  selectedRequest: {
    backgroundColor: '#d3c2c2 !important',
    display: 'flex',
    justifyContent: 'center',
    [theme.breakpoints.up('md')]: {
      justifyContent: 'flex-start',
    },
  },
  request: {
    backgroundColor: '#f3e2e2 !important',
    display: 'flex',
    justifyContent: 'center',
    [theme.breakpoints.up('md')]: {
      justifyContent: 'flex-start',
    },
  },
  divider: {
    backgroundColor: '#D89393',
    color: '#F5F5F5',
    display: 'flex',
    justifyContent: 'center',
    [theme.breakpoints.up('md')]: {
      justifyContent: 'flex-start',
    },
  },
}));

const RouteListItem = ({ route, handleClick, expanded, setExpanded }) => {
  const styles = useStyles();
  const location = useLocation();
  const actualLocation = location.pathname;
  const setOtherExpandedFalse = (routeTitle) => {
    let newRoute = { ...expanded };
    for (let i in newRoute) {
      newRoute[i] = false;
    }
    return newRoute;
  };
  const changeRouteOpen = (routeTitle) => {
    const expandedValues = setOtherExpandedFalse();
    setExpanded({ ...expandedValues, [routeTitle]: !expanded[routeTitle] });
  };
  const hasSelected = (route) => actualLocation === '/dashboard' + route;

  if (route.list && route.list.length > 0) {
    return (
      <>
        <ListItem button onClick={() => changeRouteOpen(route.title)} className={styles.page}>
          <Fragment>
            <ListItemIcon style={{ minWidth: 10, marginRight: '10px' }}>
              <route.icon style={{ color: '#616161' }} />
            </ListItemIcon>
            <ListItemText primary={route.title} />
            <ListItemIcon style={{ minWidth: 10 }}>{expanded ? <ExpandMoreIcon /> : <ChevronRightIcon />}</ListItemIcon>
          </Fragment>
        </ListItem>

        <Collapse in={expanded[route.title]} timeout='auto' unmountOnExit>
          <List component='div' disablePadding dense>
            {route.list.map((item) => {
              const isSelected = hasSelected(item.path);

              if (isSelected && !expanded) {
                setExpanded(!expanded);
              }

              return (
                <ListItem
                  key={item.path}
                  button
                  onClick={() => handleClick(item.path)}
                  className={isSelected ? styles.selectedPage : styles.page}
                >
                  <ListItemText primary={item.title} style={{ paddingLeft: 20 }} />
                </ListItem>
              );
            })}
          </List>
        </Collapse>
      </>
    );
  }

  const isSelected = hasSelected(route.path);

  return (
    <ListItem button onClick={() => handleClick(route.path)} className={isSelected ? styles.selectedPage : styles.page}>
      <Fragment>
        <ListItemIcon style={{ minWidth: 10, marginRight: '10px' }}>
          <route.icon
            style={{
              color: isSelected ? '#0097FF' : '#616161',
              fontSize: '1.5rem',
            }}
          />
        </ListItemIcon>
        <ListItemText primary={route.title} />
      </Fragment>
    </ListItem>
  );
};

const Sidebar = ({ open, toggle, user, events }) => {
  const styles = useStyles();
  const history = useHistory();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));

  const handleClick = (route) => {
    history.push('/dashboard' + route);
    if (!matches) toggle(false);
  };
  const [expanded, setExpanded] = useState({});

  return (
    events.length > 0 && (
      <Drawer
        open={open}
        variant='persistent'
        classes={{
          paper: styles.drawer,
        }}
      >
        <div className={styles.toolbar} />
        <List className={styles.list} dense>
          {RouteList.map((route, index) => {
            return (
              <RouteListItem
                key={index}
                route={route}
                handleClick={handleClick}
                expanded={expanded}
                setExpanded={setExpanded}
              />
            );
          })}
        </List>
      </Drawer>
    )
  );
};

export default Sidebar;
