const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const checkAuthAdmin = require('../middleware/checkAuthAdmin');
const libFunction = require('../lib/function');
const Project = require('../models/projectModel');



module.exports = router;
