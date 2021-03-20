const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const generateJwtToken = (_id,role) => {
    return jwt.sign({_id, role}, process.env.JWT_SECRET,{
        expiresIn:"1d"
    })
}

exports.signup = (req, res, next) => {
    console.log('hello');
    User.findOne({ email: req.body.email })
    .exec(async (err, user) => {
        if(user) return res.status(400).json({
            message: 'User already registered'
        });
        const {
            firstName,
            lastName,
            email,
            password,
            
        } = req.body;

        const username = lastName + firstName;

        const hash_password = await bcrypt.hash(password, 10);

        const _user = new User({
            firstName,
            lastName,
            email,
            hash_password,
            username,
            role:'user'
        });

        _user.save((err, user) => {
            if(err){
                return res.status(400).json({
                    message: err
                })
            }

            if(user){
                return res.status(201).json({
                    user,
                    token:generateJwtToken(user._id,user.role)
                })
            }
        });
    });    
}

exports.signin = (req, res)=>{
    
   
    
    User.findOne({email: req.body.email})
    .exec(async (err, user) => {
        if(err) return res.status(400).json({ err });

        if(user){
            const isCorrectPassword = await user.authenticate(req.body.password);
            if(isCorrectPassword && user.role == 'user'){
                const token = generateJwtToken(user._id,user.role);
                const {_id, firstName, lastName, email, role, fullName, username} = user;
                
                res.status(200).json({
                    token,
                    user: {
                        _id, firstName, lastName, email, role, fullName, username
                    }
                });
            }else if(user.role !== 'user'){
                return res.status(400).json({
                    message: 'Something went wrong.'
                }) 
            } 
            else {
                return res.status(400).json({
                    message: 'Invalid password'
                })
            }
        }else{
            return res.status(400).json({ message: 'User not found.'});
        }
    });

}

exports.signOut = (req, res) => {
    res.clearCookie('token');
    
    res.status(200).json({
        message: 'Sign out successfully...'
    })
}

exports.requireSignin = (req, res, next)=>{
    if(req.headers.authorization){
        const token = req.headers.authorization.split(" ")[1];
        if(token !== null){
            const user = jwt.verify(token, process.env.JWT_SECRET);
            req.user = user;
        } else if(token) {
            res.status(500).json({ message: 'Token is null' });
        }
        
    } else {
        res.status(400).json({ message: 'Authorization required' });
    }
    
    next();
}