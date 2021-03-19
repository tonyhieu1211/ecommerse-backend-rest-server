const express = require('express');
const { createCategory, getCategories, updateCategories, deleteCategories } = require('../controllers/category');
const { requireSignin, adminMiddleware } = require('../middleware');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const shortid = require('shortid');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(path.dirname(__dirname),'uploads'))
    },
    filename: function (req, file, cb) {
      cb(null, shortid.generate() + '-' + file.originalname);
    }
})

const upload = multer({ storage });


router.post('/category/create',requireSignin, adminMiddleware, upload.single('categoryImage'), createCategory);
router.get('/categories', getCategories);
router.post('/categories/update', upload.array('categoryImage'), updateCategories);
router.post('/categories/delete', deleteCategories)

module.exports = router;