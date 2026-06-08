const nodemailer = require("nodemailer");

module.exports = async (options) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
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