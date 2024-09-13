const dotenv = require('dotenv');
dotenv.config({path: './config.env'})

const nodemailer = require("nodemailer");
const express = require('express');
const cors = require('cors');

const app = express()
app.use(cors())
app.use(express.json())

const transporter = nodemailer.createTransport({
    service:"gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.USER,
      pass: process.env.APP_PASS
    },
  });

app.get("/api", (req, res) => {
    res.json("welcome to portfolio server!!");
})

app.post("/api/contactForm", async (req, res) => {

    const info = await transporter.sendMail({
        from: '"Support Team" <arjun.rdell@gmail.com>', // sender address
        to: "rarjun7019@gmail.com", // list of receivers
        subject: "Portfolio Form", // Subject line
        text: `
        Name: ${req.body.name}
        Email: ${req.body.email}
        ${req.body.message}`, // plain text body
    });

    // console.log("Message sent:", info.messageId);

    res.status(200).json({
        status: "success"
    })
})

app.post("/api/userIp", async (req, res) => {

    const info = await transporter.sendMail({
        from: '"Support Team" <arjun.rdell@gmail.com>', // sender address
        to: "rarjun7019@gmail.com", // list of receivers
        subject: "Portfolio Form", // Subject line
        text: `
        ${req.body}`, // plain text body
    });

    // console.log("Message sent:", info.messageId);

    res.status(200).json({
        status: "success"
    })
})


app.listen(5000, () => console.log("server started at port 5000"))