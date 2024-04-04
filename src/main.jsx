import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { CssBaseline } from '@mui/material'
import { GoogleReCaptchaProvider, } from 'react-google-recaptcha-v3';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>

    <CssBaseline />
    <GoogleReCaptchaProvider reCaptchaKey="6Lfrxf4UAAAAAByrvPmn5nMVEjk_Q1RFSwumS5tv">
      <App />
    </GoogleReCaptchaProvider>
  </React.StrictMode>,
)
