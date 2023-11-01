import User from '../models/user.module.js';
import bcryptjs from 'bcryptjs';
import { error } from '../utilies/error.js';
import jwt from 'jsonwebtoken';

export const signup = async(req, res, next) => {
    
    const {username, email, password} = req.body;
    const hashedpassword = bcryptjs.hashSync(password,10);
    const newuser = new User({username, email, password: hashedpassword});

    try{
        await newuser.save();
        res.status(201).json("User created successfully");
    }catch(err){
        next(err);
    }
};

export const signin = async(req, res, next) => {

    const {email, password} = req.body;
    try {
        const validUser = await User.findOne({email: email});
        if(!validUser){
            return next(error(404, 'User not found'));
        }
        const validpassword = bcryptjs.compareSync(password,validUser.password);
        if(!validpassword){
            return next(error(401, 'Invalid Credentials'));
        }
        const token = jwt.sign({id: validUser._id}, process.env.JWT_SECRET_KEY);
        const {password: pass, ...rest} = validUser._doc;
        res.cookie('access_token', token, { httpOnly: true }).status(200).json(rest);
    } catch (error) {
        next(error);
    }
}