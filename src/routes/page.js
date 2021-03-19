const { createPage, getPage } = require('../controllers/page');
const { upload, requireSignin, adminMiddleware } = require('../middleware');

const express = require('express');
const router = express.Router();

router.post('/page/create',requireSignin,adminMiddleware, upload.fields([
    {name:'banners'},
    {name:'products'}
]), createPage);

router.get(`/page/:category/:type`, getPage);

module.exports = router;