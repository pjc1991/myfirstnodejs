const nodemailer = require('nodemailer');
const dotenv = require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: process.env.smtp_host,
    port: process.env.smtp_port,
    secure: false,
    auth: {
        user: process.env.smtp_user,
        pass: process.env.smtp_password
    }
});

async function sendMail(props) {
    const info = await transporter.sendMail({
        from: `"${process.env.smtp_mail_name}" ${process.env.smtp_mail_address}`,
        to: props.to,
        subject: props.subject,
        html: props.html
    });
}