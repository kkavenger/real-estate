import User from '../models/user.module.js';
import bcryptjs from 'bcryptjs';

export const signup = async(req, res) => {
    
    const {username, email, password} = req.body;
    const hashedpassword = bcryptjs.hashSync(password,10);
    const newuser = new User({username, email, password: hashedpassword});

    try{
        await newuser.save();
        res.status(201).json("User created successfully");
    }catch(err){
        res.status(500).json(err.message);
    }
};