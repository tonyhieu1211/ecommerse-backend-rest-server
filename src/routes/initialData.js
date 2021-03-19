const express = require('express');
const { getInitialData } = require('../controllers/initialData');
const { requireSignin } = require('../middleware');

const Router = express.Router();

Router.get('/initial-data',requireSignin, getInitialData);

module.exports = Router;