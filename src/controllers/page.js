const Page = require("../models/page");
const { cloudinary } = require('../utils/cloudinary');

exports.createPage = async (req, res) => {
    let promiseArray = [];
    let bannersArr = [];
    let productsArr = [];
    req.body.banners.map(img => {
        promiseArray.push(cloudinary.uploader.upload(img, function (error, result) {
            bannersArr.push({
                img: result.url,
                navigateTo: `/bannerClicked?categoryId=${req.body.category}&type=${req.body.type}`
            })
        }))
    });

    req.body.products.map(img => {
        promiseArray.push(cloudinary.uploader.upload(img, function (error, result) {
            bannersArr.push({
                img: result.url,
                navigateTo: `/productClicked?categoryId=${req.body.category}&type=${req.body.type}`
            })
        }))
    });

    Promise.all(promiseArray).then(() => {
        

        req.body.banners = bannersArr;
        req.body.products = productsArr;
        req.body.createdBy = req.user._id;

        Page.findOne({ category: req.body.category }).exec((error, page) => {

            if (error) return res.status(400).json({ error });
            if (page) {
                console.log('found you :))')
                Page.findOneAndUpdate({ category: req.body.category }, req.body)
                    .exec((error, updatedPage) => {

                        if (updatedPage) return res.status(201).json({ updatedPage });
                    });
            } else {
                console.log('hello');
                const newPage = new Page(req.body);

                newPage.save((error, savedPage) => {
                    if (error) return res.status(400).json({ error });
                    if (savedPage) return res.status(201).json({ savedPage });
                })
            }
        })
    })



}

exports.getPage = (req, res) => {
    console.log('get page request received');
    const { category,type } = req.params;
    if(type === 'page'){
        Page.findOne({ category: category }).exec(( error, page) => {
            if(error) return res.status(400).json({ error });
            if(page) return res.status(200).json({ page });
        })
    }
}