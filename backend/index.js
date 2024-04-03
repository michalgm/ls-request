require('dotenv').config();
const nodemailer = require("nodemailer");
const express = require('express');
const bodyParser = require('body-parser');
const router = require('express-promise-router')()
//const formSubmit = require('./formSubmit')
const app = express();
const port = process.env.PORT || 3000;

const emails = process.env.EMAILS
const email = "memoryhole-legal-database@proton.me"

const transporter = nodemailer.createTransport({
    host: '127.0.0.1',
    port: 1025,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.PROTONMAIL_LOGIN,
        pass: process.env.PROTONMAIL_PW,
    },
    tls: {
        rejectUnauthorized: false,
    },
})
// async..await is not allowed in global scope, must use a wrapper
async function send_email(body) {
    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: `MemoryHole Legal DB" <${email}>`, // sender address
        to: emails, // list of receivers
        subject: "New Legal Support Request", // Subject line
        text: body,
        html: `<b>${body}</b>`, // html body
    });

    console.log("Message sent: %s", info.messageId);
}

const handle_submit = async (req, res) => {
    console.log(req.body)
    await send_email(JSON.stringify(req.body))
    return res.send('ok')
}

app.use(express.static('public'));
app.use(bodyParser.json());
router.post('/submit', handle_submit);
app.use(router);
app.use((err, req, res) => {
    console.error(err)
    console.error(err.stack)
    res.status(500).json({ error: err })
})
app.listen(port, () => console.log(`Listening on port ${port}!`));
