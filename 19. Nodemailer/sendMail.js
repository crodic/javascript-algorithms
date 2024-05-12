import transporter from './index.js';

const sendMail = async (email, subject, html) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject,
            html,
        };
        await transporter.sendMail(mailOptions);
    } catch (error) {
        throw error;
    }
};

export default sendMail;

// How to use

// const subject = 'Xác Nhận Tài Khoản';
// const html = `<p>Mã Xác Nhận Của Bạn Là: <b>${otp}</b></p></br><p>Chú Ý: Mã Xác Nhận Sẽ Hết Hạn Sau 5 Phút</p>`;
// await sendMail(email, subject, html);
