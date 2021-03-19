require('dotenv')
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name:'dx58odn8b',
    api_key:'163778467416664',
    api_secret:'ZqJKXsvORzXmc3j5hQ2Uw0Q5VlA',
});

module.exports = {cloudinary};


