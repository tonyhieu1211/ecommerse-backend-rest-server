const express = require('express');
const env = require('dotenv');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const app = express();

const userRoute = require('./routes/auth');
const categoryRoute = require('./routes/category');
const productRoute = require('./routes/product');
const cartRoute = require('./routes/cart');
const initialDataRoute = require('./routes/initialData');
const pageRoute = require('./routes/page');
const addressRoute = require('./routes/address');
const orderRoute = require('./routes/order');
const adminOrderRoute = require('./routes/admin/order.admin');

env.config();

mongoose.connect(process.env.MONGO_URL,
{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(()=>{
    console.log('DB connected');
})

app.use(cors());
app.use(express.json());
app.use('/public', express.static(path.join(__dirname,'uploads')));
app.use('/api', userRoute);
app.use('/api',categoryRoute);
app.use('/api', productRoute);
app.use('/api', cartRoute);
app.use('/api', initialDataRoute);
app.use('/api', pageRoute);
app.use('/api', addressRoute);
app.use('/api', orderRoute);
app.use('/api',  adminOrderRoute);

app.get('/', (req,res,next)=>{
    res.status(200).json({
        message: 'Hello World'
    })
});

app.post('/data', (req,res,next)=>{
    res.json({
        message: req.body
    })
});

app.listen(process.env.PORT, ()=>{
    console.log(`Server is listening on port ${process.env.PORT}`);
})
