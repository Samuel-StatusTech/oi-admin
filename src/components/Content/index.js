import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Pages from './Pages';
const useStyles = makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,
  contentWidth: {
    width: (props) => 0,
    [theme.breakpoints.up('md')]: {
      width: (props) => (props.open ? 180 : 0),
    },
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  routeWidth: {
    padding: 20,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    width: (props) => `calc(100% - 0px)`,
    [theme.breakpoints.up('md')]: {
      width: (props) => `calc(100% - ${props.open ? 180 : 0}px)`,
    },
  },
}));

const Content = (props) => {
  const styles = useStyles(props);
  return (
    <div style={{ height: '100%', backgroundColor: 'inherit' }}>
      <div className={styles.toolbar} />
      <div style={{ display: 'flex', backgroundColor: 'inherit' }}>
        <div className={styles.contentWidth} />
        <div className={styles.routeWidth}>
          <Pages path={props.path} />
        </div>
      </div>
    </div>
  );
};

export default Content;
