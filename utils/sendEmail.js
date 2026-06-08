const nodemailer = require("nodemailer");

module.exports = async (options) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_USER || "osamaakil4@gmail.com",
            pass: process.env.SMTP_PASS || "dlnbwsjjehkygynl",
        },
    });

    const emailOpts = {
        from: `"CampusHUB" <${process.env.SMTP_USER || "osamaakil4@gmail.com"}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    await transporter.sendMail(emailOpts);
};