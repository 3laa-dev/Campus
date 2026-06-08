const nodemailer = require("nodemailer");

module.exports = async (options) => {
    const smtpUser = "osamaakil4@gmail.com";
    const smtpPass = "dlnbwsjjehkygynl";

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for 587 (STARTTLS)
        auth: {
            user: smtpUser,
            pass: smtpPass,
        },
        connectionTimeout: 5000, // 5 saniye
        greetingTimeout: 5000,
        socketTimeout: 5000,
        tls: {
            rejectUnauthorized: false
        }
    });

    const emailOpts = {
        from: `"CampusHUB" <${smtpUser}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    await transporter.sendMail(emailOpts);
};