const slugify = require('slugify');
const Category = require('../models/category');
const shortid = require('shortid');

function createCategoryList(categories, parent = null){
    const categoryList = [];
    if(parent == null){
        filteredCategories = categories.filter(cat => cat.parent == "undefined" || cat.parent == undefined);
        
    } else {
        filteredCategories = categories.filter(cat => cat.parent == parent);
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

exports.createCategory = (req, res)=> {
    const categoryObj = {
        name: req.body.name,
        slug: `${slugify(req.body.name)}-${shortid.generate()}`,
        
    }

    if(req.file){
        // categoryObj.categoryImage = process.env.API_URL + "/public/" + req.file.filename;
        categoryObj.categoryImage = "/public/" + req.file.filename;
    }

    if(req.body.parent){
        categoryObj.parent = req.body.parent;
    }
    
    const cat = new Category(categoryObj);
    


    cat.save((err,category)=>{
        if(err){
            return res.status(400).json({ err });
        }
        if(category){
            return res.status(201).json({ category });
        }
    })
}

exports.getCategories = (req, res) => {
    Category.find({})
    .exec((err,categories)=>{
        if(err){
            return res.status(400).json({ err });
        }
        if(categories){
            const categoryList = createCategoryList(categories);
            return res.status(200).json({ categoryList });
        }        
    });
}

exports.updateCategories = async (req, res) => {
    const { _id, name, parent, type } = req.body;
    const updatedArray = [];
    if(name instanceof Array){
        for(let i = 0; i < name.length; i ++){
            const newCategory = {
                name: name[i],
                type: type[i]
            }
            if(parent !== ""){
                newCategory.parent = parent[i];
            }
            const updatedCategory = await Category.findOneAndUpdate({_id: _id[i]}, newCategory, {new: true});
            updatedArray.push(updatedCategory);
        }
    

    } else {
        const newCategory = {
            name: name,
            type: type
        }
        if (parent !== "") {
            newCategory.parent = parent;
        }
        const updatedCategory = await Category.findOneAndUpdate({ _id: _id }, newCategory, { new: true });
        updatedArray.push(updatedCategory);
        

    }
    return res.status(201).json({ updatedArray });
    
}

exports.deleteCategories = async (req, res) => {
    const {idsArray} = req.body.payload;
    let deletedCategories = [];
    for(let i = 0; i < idsArray.length; i++){
        const deletedCategory = await Category.findOneAndDelete({_id: idsArray[i]});
        deletedCategories.push(deletedCategory);
    }
    if(deletedCategories.length == idsArray.length){
        return res.status(201).json({ message: 'Categories deleted' });
    } else {
        return res.status(400).json({ message: 'Something went wrong '});
    }
}