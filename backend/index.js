require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const formSubmit = require('./formSubmit');
const router = require('express-promise-router')()

const app = express();
const port = process.env.PORT || 3000;


app.use(express.static('public'));
app.use(bodyParser.json());
router.post('/submit', formSubmit);
app.use(router);
app.use((err, req, res) => {
    console.error(err)
    console.error(err.stack)
    res.status(500).json({ error: err })
})
app.listen(port, () => console.log(`Listening on port ${port}!`));
