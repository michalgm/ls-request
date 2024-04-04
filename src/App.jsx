import './App.scss'
import Form from '@rjsf/mui';
import validator from '@rjsf/validator-ajv8';
import { startCase } from 'lodash-es';
import { Alert, AlertTitle, Stack, Typography, Paper, Backdrop, CircularProgress, Snackbar } from '@mui/material';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

const debug = new URLSearchParams(window.location.search).has('debug')
// const debug = queryParameters.has("debug") || false)

const formData = {
  contact_name: 'Frodo Baggins',
  phone_number: '(625) 251-2923',
  email: 'frodo@shire.com',
  organization: 'Fellowship Of The Ring',
  event_name: 'Mordor lockdown',
  public_link: 'none',
  event_date: '2024-03-17',
  start_time: '08:00:00',
  end_time: '17:00:00',
  support_requests: ['Legal hotline', 'Legal observers'],
  notes: 'We need a wizard too',
  disclaimer: true,
}

const infobox = function (props) {
  return (
    <Alert severity='info' icon={false}>
      {props.label}
    </Alert>
  );
};

const widgets = {
  infobox
}
const schema = {
  type: 'object',
  properties: {
    disclaimer: {
      type: 'boolean',
      title: 'I am completing this confidential form for the purpose of obtaining legal advice and representation. I understand that my communications with legal support will be confidential.'
    },
    warning: {
      type: 'boolean',
      title: 'Submitting this form does not guarantee legal support, it simply constitutes a request'
    },
    contact_name: { type: 'string' },
    phone_number: {
      type: 'string',
      description: " We recommend a cell number with [**Signal**](https://signal.org/download/) installed for secure voice communication"
    },
    email: { type: 'string', format: 'email' },
    organization: { type: 'string', title: 'Group or Organization' },
    event_name: { type: 'string', title: 'Event Name / Topic' },
    public_link: { type: 'string' },
    event_date: { type: 'string', format: 'date' },
    start_time: { type: 'string', format: 'time' },
    end_time: { title: 'Expected End Time', type: 'string', format: 'time' },
    support_requests: {
      type: "array",
      title: "I am requesting: ",
      items: {
        type: 'string',
        enum: [
          'Pre-action legal consult with an attorney',
          'Anti-repression / KYR workshop',
          'Legal hotline',
          'Legal observers',
          'On call attorney and/or defense attorney in case of arrests',
          'Jail support info',
          'Post-arrest legal meeting',
        ],
      },
      uniqueItems: true
    },
    notes: {
      type: 'string',
      title: 'Anything else you would like us to know?'
    },

  },
  required: ['contact_name', 'phone_number', 'support_requests', 'disclaimer']
}

const custom_schema = {
  "ui:order": Object.keys(schema.properties),
  "phone_number": {
    "ui:enableMarkdownInDescription": true,
  },
  "support_requests": {
    "ui:widget": "CheckboxesWidget",
    'ui:classNames': 'requests'
  },
  "warning": {
    "ui:widget": 'infobox'
  },
  "notes": {
    "ui:widget": "textarea"
  }
}


const uiSchema = Object.keys(schema.properties).reduce((acc, key) => {
  acc[key] = {
    "ui:title": schema.properties[key].title || startCase(key),
    ...custom_schema[key]
  }
  return acc
}, {
  'ui:submitButtonOptions': {
    props: {
      disabled: false,
      className: 'btn btn-info',
    },
    norender: false,
    submitText: 'Submit Request',
  },
})

function App() {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [status, setStatus] = useState(false)
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);
  const [values, setValues] = useState('');

  useEffect(() => {
    const getToken = async () => {
      try {
        setLoading(true)
        const token = await executeRecaptcha("submit");
        await axios.post('/submit', { data: values, token })
        setStatus('success')
      } catch (e) {
        console.error(e)
        if (e && e.response && e.response.data && e.response.data.error) {
          setError(e.response.data.error)
        } else {
          setError(e && e.message ? e.message : e)
        }
      }
      setLoading(false)
    }
    if (values) {
      getToken()
    }
  }, [values, submitCount, executeRecaptcha])

  const onSubmit = async ({ formData }) => {
    setError(null);
    setStatus(null);

    setValues(formData)
    setSubmitCount(submitCount + 1)
  }

  const response = status === 'success' ? <Alert severity="success" >
    <AlertTitle>
      Your request has been submitted
    </AlertTitle>
    Someone will contact you to discuss your legal support request
  </Alert> : <Alert severity="error" >
    <AlertTitle>
      Something went wrong
    </AlertTitle>
    Please reload and try again
  </Alert>

  const form = <>
    <Stack spacing={2}>
      <Alert icon={false}>
        If you are contacting us because you need legal support for an FBI visit, search warrant, or other law enforcement investigation, please call 415-285-1041
      </Alert>
    </Stack>
    <Form
      schema={schema}
      validator={validator}
      uiSchema={uiSchema}
      formData={debug ? formData : {}}
      onSubmit={onSubmit}
      focusOnFirstError
      widgets={widgets}
    />
  </>
  return (
    <>
      <Backdrop style={{ zIndex: 1000 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar open={Boolean(error)} onClose={() => { setError(null) }} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity="error" onClose={() => { setError(null) }}>
          <AlertTitle>An error occured while submitting the form:</AlertTitle>
          {error}
        </Alert>
      </Snackbar>
      <div className='App'>
        <Paper sx={{ p: 4 }}>
          <Typography variant='h3' align='center' color='primary' gutterBottom>Legal Support Request Form</Typography>
          {
            status ? response : form
          }
        </Paper>
      </div>
    </>
  );
}

export default App

