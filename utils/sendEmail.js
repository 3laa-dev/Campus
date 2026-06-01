const nodemailer = require("nodemailer");

module.exports = async (options) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    const emailOpts = {
        from: `From Campus Hup ${process.env.SMTP_USER}`,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    await transporter.sendMail(emailOpts);
};