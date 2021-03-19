const Category = require('../models/category');
const Product = require('../models/product');
const Order = require('../models/order');

function createCategoryList(categories, parent = null){
    const categoryList = [];
    let filteredCategories;
    if(parent == null){
        filteredCategories = categories.filter(cat => cat.parent == "undefined" || cat.parent == undefined);
    } else {
        filteredCategories = categories.filter(cat => cat.parent == parent)
    }

    for(let cat of filteredCategories){
        categoryList.push({
            _id:cat._id,
            name: cat.name,
            slug: cat.slug,
            parent: cat.parent,
            type: cat.type,
            children: createCategoryList(categories, cat._id)
        })
    }

    return categoryList;
}

exports.getInitialData = async (req, res) => {
    const categories = await Category.find({}).exec();
    const products = await Product.find({})
                                        .select('_id name price quantity slug description productPics category')
                                        .exec();
    const orders = await Order.find({}).populate("items.productId","name").exec();
    res.status(200).json({
        products,
        categories:createCategoryList(categories),
        orders
    })
}