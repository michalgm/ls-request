// import { useState } from 'react'
import './App.scss'
import Form from '@rjsf/mui';
import validator from '@rjsf/validator-ajv8';
import { startCase } from 'lodash-es';
import { Alert, Stack, Typography, Paper } from '@mui/material';

const formData = {
  contact_name: 'foo',
  phone_number: 'bar'
}
const schema = {
  type: 'object',
  properties: {
    contact_name: { type: 'string' },
    phone_number: {
      type: 'string',
      description: " We recommend a cell number with [**Signal**](https://signal.org/download/) installed for secure voice communication"
    },
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
    disclaimer: {
      type: 'boolean',
      title: 'I am completing this confidential form for the purpose of obtaining legal advice and representation'
    }
  },
  required: ['contact_name', 'phone_number', 'support_requests', 'disclaimer']
}

const custom_schema = {
  phone_number: {
    "ui:enableMarkdownInDescription": true,
  },
  support_requests: {
    "ui:widget": "CheckboxesWidget",
    'ui:classNames': 'requests'
  },
  notes: {
    "ui:widget": "textarea"
  }
}
const onSubmit = ({ formData }) => console.log('Data submitted: ', formData);

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

const logChange = ({ formData }) => console.log(formData);

function App() {
  return (
    <div className='App'>
      <Paper sx={{ p: 4 }}>
        <Typography variant='h3' align='center' color='primary' gutterBottom>Legal Support Request Form</Typography>
        <Stack spacing={2}>
          <Alert icon={false}>
            If you are contacting us because you need legal support for an FBI visit, search warrant, or other law enforcement investigation, please call 415-285-1041
          </Alert>
          <Alert icon={false} severity='info'>
            Submitting this form does not guarantee legal support, it simply constitutes a request
          </Alert>

        </Stack>
        <Form
          schema={schema}
          validator={validator}
          uiSchema={uiSchema}
          // liveValidate
          formData={formData}
          onSubmit={onSubmit}
          onChange={logChange}
          focusOnFirstError

        />
      </Paper>
    </div>
  );
}

export default App


/*
*Contact person for legal support
*SIgnal phone
email
Group or organization
Demo name and/or topic
Link to public announcement, if any
Date of event
Start time
Expected end time
Details - if secure, we can contact you on signal
We request:
_ Pre-action legal consult with an attorney
_ Anti-repression/KYR workshop
_ Legal hotline
_ Legal Observers
_ On call attorney and/or defense attorney in case of arrests
_ Jail support info
_ Post-arrest legal meeting
_ other


If you are contacting us because you need legal support for an FBI visit, search warrant, or other law enforcement investigation, please call 415-285-1041


I am completing this confidential form for the purpose of obtaining legal advice and representation
*/

