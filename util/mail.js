const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
});

async function sendMail(props) {
    const info = await transporter.sendMail({
        from: `"${process.env.SMTP_MAIL_NAME}" ${process.env.SMTP_MAIL_ADDRESS}`,
        to: props.to,
        subject: props.subject,
        html: props.html
    });

    return info;
}

exports.sendMail = sendMail;