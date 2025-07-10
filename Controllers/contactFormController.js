const nodemailer = require("nodemailer");
const mongoose = require('mongoose');

const visitedUserSchema = new mongoose.Schema({
    userInfo: Object,
    user: Object,
    timestamp: {
        type: String,
        default: () =>
            new Date().toLocaleString('en-IN', {
                timeZone: 'Asia/Kolkata',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            })
    }
});

const visitedUser = mongoose.model('visitedUser', visitedUserSchema);

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
        user: process.env.USER,
        pass: process.env.APP_PASS
    },
});

const contactForm = async (req, res) => {
    const info = await transporter.sendMail({
        from: '"Support Team" <arjun.rdell@gmail.com>', // sender address
        to: "rarjun7019@gmail.com", // list of receivers
        subject: "Portfolio Form", // Subject line
        text: `
        Name: ${req.body.name}
        Email: ${req.body.email}
        Message:${req.body.message}
        OtherData:${JSON.stringify(req.body.userInfo, null, 2)}`,// plain text body
    });

    if(!info) return res.status(400).json("Error while sending message. try agian later.");

    res.status(200).json({
        status: "success"
    })
}

const userInfo = async (req, res) => {

    const visitedUserLogs = new visitedUser({
        userInfo:req.body.userInfo,
        user:req.body.data
    });

    visitedUserLogs.save().catch(err => {return res.status(400).json("error while storing visited user data")});

    res.status(200).json("visited user data stored.")
}

module.exports = { contactForm, userInfo }