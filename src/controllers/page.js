const Page = require("../models/page");


exports.createPage = async (req, res) => {
   
    const { banners, products } = req.files;
    if(banners && banners.length > 0){
        req.body.banners = banners.map((banner, index) => ({
            //img: `${process.env.API_URL}/public/${banner.filename}`,
            img: `/public/${banner.filename}`,
            navigateTo: `/bannerClicked?categoryId=${req.body.category}&type=${req.body.type}`
        }))
    }
    if(products && products.length > 0){
        req.body.products = products.map((product, index) => ({
            //img: `${process.env.API_URL}/public/${product.filename}`,
            img: `/public/${product.filename}`,
            navigateTo: `/productClicked?categoryId=${req.body.category}&type=${req.body.type}`
        }))
    }

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