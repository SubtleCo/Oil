import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import '@fontsource/roboto';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import { yellow, grey } from '@material-ui/core/colors';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { Oil } from './components/Oil';

const theme = createMuiTheme({
  palette: {
    primary: grey,
    secondary: yellow
  },
})

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <MuiThemeProvider theme={theme}>
        <Oil />
      </MuiThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
