const dotenv = require('dotenv');
dotenv.config({ path: './config.env' })
const pdf = require('html-pdf');
const nodemailer = require("nodemailer");
const express = require('express');
const cors = require('cors');

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

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

app.get("/api", (req, res) => {
    res.json("welcome to portfolio server!!");
})

app.post("/api/contactForm", async (req, res) => {
    // Access data from req.body
    const data = req.body.userInfo;
    let file;

    // Generate HTML content from data
    const htmlContent = `
     <!DOCTYPE html>
     <html>
     <head>
         <title>PDF from Data</title>
     </head>
     <body>
         <h1>Data from Request</h1>
         <pre>${JSON.stringify(data, null, 2)}</pre>
     </body>
     </html>
     `;

    // Configure PDF generation
    const pdfOptions = {
        format: 'A4',
        orientation: 'portrait',
    };

    const pdfPath = './output.pdf';
    // Generate the PDF
    pdf.create(htmlContent, pdfOptions).toFile(pdfPath, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error generating PDF');
        }
    });
    const info = await transporter.sendMail({
        from: '"Support Team" <arjun.rdell@gmail.com>', // sender address
        to: "rarjun7019@gmail.com", // list of receivers
        subject: "Portfolio Form", // Subject line
        text: `
        Name: ${req.body.name}
        Email: ${req.body.email}
        ${req.body.message}`,
        attachments: [{
            filename: 'file.pdf',
            path: pdfPath,
            contentType: 'application/pdf'
        }], // plain text body
    });
    res.status(200).json({
        status: "success"
    })
})

app.post('/api/userInfo', async (req, res) => {
    // Access data from req.body
    const data = req.body;
    let file;

    // Generate HTML content from data
    const htmlContent = `
     <!DOCTYPE html>
     <html>
     <head>
         <title>PDF from Data</title>
     </head>
     <body>
         <h1>Data from Request</h1>
         <pre>${JSON.stringify(data, null, 2)}</pre>
     </body>
     </html>
     `;

    // Configure PDF generation
    const pdfOptions = {
        format: 'A4',
        orientation: 'portrait',
    };

    const pdfPath = './output.pdf';
    // Generate the PDF
    pdf.create(htmlContent, pdfOptions).toFile(pdfPath, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error generating PDF');
        }

        // file = result.filename;
        // Send the PDF file to the client
        //  res.sendFile(result.filename, (err) => {
        //    if (err) {
        //      console.error('Error sending PDF:', err);
        //      res.status(500).send('Error sending PDF');
        //    }
        //  });
    });
    const info = await transporter.sendMail({
        from: '"Support Team" <arjun.rdell@gmail.com>', // sender address
        to: "rarjun7019@gmail.com", // list of receivers
        subject: "Portfolio Form", // Subject line
        attachments: [{
            filename: 'file.pdf',
            path: pdfPath,
            contentType: 'application/pdf'
        }], // plain text body
    });
    res.status(200).json({
        status: "success"
    })
});


app.listen(5000, () => console.log("server started at port 5000"))