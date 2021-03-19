const Product = require('../models/product');
const slugify = require('slugify');
const Category = require('../models/category');
const { cloudinary } = require('../utils/cloudinary');


exports.createProduct =  (req,res) => {
    


    const {
        name,price,description,category,quantity
    } = req.body;

    let productPics = [];

    let promiseArray = []

    req.body.previewSource.map(img => {
        promiseArray.push(cloudinary.uploader.upload(img, function (error, result) {
            productPics.push({img:result.url});
        }))
    });

    Promise.all(promiseArray).then(() => {
        console.log(productPics);
        const newProduct = new Product({ 
            name: name,
            slug: slugify(name),
            price,
            description,
            category,
            quantity,
            productPics,
            createdBy: req.user._id
        });
    
        newProduct.save((err, product)=>{
            if(err) return res.status(400).json({ err });
            if(product) return res.status(201).json({ product });
        }) 
    })
}

const getProductsByPrice = (products ,minPrice, maxPrice) => {
    return products.filter(product => product.price > minPrice && product.price <= maxPrice)
}

exports.getProductBySlug = (req, res, next) => {
   
    const slug = req.params.slug;
    Category.findOne({ slug })
    .select('_id type')
    .exec((err, category) => {
        if(err) return res.status(400).json({ err })
        if(category){
            Product.find({ category:category._id })
            .exec((err,products) => {
                if(err) return res.status(400).json({ err })
                if(category.type){
                    if(products.length > 0) return res.status(200).json(
                        {
                            products,
                            priceRange: {
                                under2000k: 2000000,
                                under3000k: 3000000,
                                under4000k: 4000000,
                                under5000k: 5000000,
                                under6000k: 6000000,
                                under7000k: 7000000,
                            },
                            productsByPrice:{
                                 under2000k:getProductsByPrice(products,0,2000000),
                                 under3000k:getProductsByPrice(products,2000000,3000000),
                                 under4000k:getProductsByPrice(products,3000000,4000000),
                                 under5000k:getProductsByPrice(products,4000000,5000000),
                                 under6000k:getProductsByPrice(products,5000000,6000000),
                                 under7000k:getProductsByPrice(products,6000000,7000000),
                                 
                            } 
                        }
                    )
                } else {
                    res.status(200).json({ products });
                }
                
            })
        } 
    })
}

exports.getProductById = (req, res) => {
    const {productId} = req.params;
    if(productId){
        Product.findOne({ _id: productId })
        .exec((error, product) => {
            if(error) return res.status(400).json({ error });
            if(product) return res.status(200).json({ product });
        })
    } else{
        return res.status(400).json({ message: 'Params required '})
    }
}

exports.deleteProductById = (req, res) => {
    const {productId} = req.body.payload;
    if(productId){
        Product.deleteOne({_id: productId}).exec((error, result) => {
            if(error) return res.status(400).json({ error });
            if(result) return res.status(202).json({ result });
        })
    }else{
        return res.status(400).json({ message:'Param required '});
    }
}

exports.getProducts = async (req, res) => {
 
  //  const products = Product.find({}).exec();
    const products = await Product.find({})
                                        .select('_id name price quantity slug description productPics category')
                                        .populate('category','_id name')
                                        .exec();
    res.status(200).json({ products });
}