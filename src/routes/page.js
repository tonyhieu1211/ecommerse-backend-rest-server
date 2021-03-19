const { createPage, getPage } = require('../controllers/page');
const { requireSignin, adminMiddleware } = require('../middleware');

const express = require('express');
const router = express.Router();

router.post('/page/create',requireSignin,adminMiddleware,createPage);

router.get(`/page/:category/:type`, getPage);

module.exports = router;