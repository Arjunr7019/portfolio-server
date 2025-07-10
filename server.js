const dotenv = require('dotenv');
dotenv.config({ path: './config.env' })
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const mongoose = require('mongoose');
const contactFormRoute = require('./Routes/contactFormRoute');
const monitorLogs = require('./LogsController/logs')

const limiter = rateLimit({
  windowMs: 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes."
});

const app = express()
// app.set('trust proxy', true);
app.use(morgan(monitorLogs));
app.use(limiter);
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.CON_STR, {
    useNewUrlParser: true
}).then((conn) => {
    // console.log(conn);
    console.log("DB connected successful");
}).catch((error) => {
    console.log(error);
})

app.use("/api", contactFormRoute);

app.get("/api", (req, res) => {
    res.json("welcome to portfolio server!!");
    // console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}\n`)
})


app.listen(5000, () => console.log("server started at port 5000"))