const express = require("express");
const { contactForm,userInfo } = require("../Controllers/contactFormController");
const { models } = require("mongoose");

const router = express.Router();

router.post("/contactForm", contactForm);
router.post("/userInfo", userInfo);

module.exports = router;