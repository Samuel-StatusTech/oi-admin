import './App.css';
import { createTheme, ThemeProvider } from '@material-ui/core';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import moment from 'moment';
import MomentUtils from '@date-io/moment';
import 'moment/locale/pt-br';
import Router from './router';
const theme = createTheme({
  typography: {
    fontFamily: "'Open Sans', Roboto, 'Helvetica Neue', Arial, Helvetica, sans-serif",
  },
});
function App() {
  return (
    <ThemeProvider theme={theme}>
      <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils} locale={'pt-br'}>
        <Router />
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  );
}
export default App;
