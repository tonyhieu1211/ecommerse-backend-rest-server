const express = require('express');
const { signup, signin, signOut } = require('../controllers/auth');
const {adminSignIn, adminSignOut} = require('../controllers/admin/auth');
const { isRequestValidated, validateSignInRequest, validateSignupRequest } = require('../validators/auth');
const router=  express.Router();


router.post('/sign-in',validateSignInRequest, isRequestValidated, signin);

router.post('/sign-up',validateSignupRequest, isRequestValidated, signup);

router.post('/sign-out', signOut);

router.post('/admin/sign-out', adminSignOut);

router.post('/admin/sign-in', validateSignInRequest, isRequestValidated, adminSignIn )

module.exports = router;