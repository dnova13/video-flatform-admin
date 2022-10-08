import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';

// pick a date util library
import koLocale from "date-fns/locale/ko";
import moment from "moment";
import DateFnsUtils from '@date-io/date-fns';

const theme = createMuiTheme({
    palette: {
        primary: { main: '#041E62' },
        // secondary: { main: '#ffeddd' },
        secondary: { main: '#ffeddd' },
        third: { main: '#2196f3' },
        link:{main : '#041E62'},

        /*chkBox:{main : '#FFAE64'},
        addBtn:{main : '#FFAE64'},
        delBtn:{main : '#041E62'},
        backBtn:{main : '#E0E7F7'},*/
    }
});


ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <MuiPickersUtilsProvider libInstance={moment} utils={DateFnsUtils} locale={koLocale}>
        <App />
    </MuiPickersUtilsProvider>
  </MuiThemeProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();