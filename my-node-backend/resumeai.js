
const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const router = express.Router();



const UserProfile = require('./models/UserprofileModel');
require('dotenv').config();


const API  = process.env.REACT_APP_GOOGLE_API;
// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(API);







module.exports = router;