import nodemailer from 'nodemailer'; // npm i nodemailer

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_NAME,
        pass: process.env.APP_PASSWORD,
    },
});

export default transporter;
