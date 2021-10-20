import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";



const Router = express.Router();
//Models
import { UserModel } from "../../database/user";

/*
Route           /signup
Descrip           Signup with email & password
Params              Public
Access              Public
Method              POST
*/

Router.post("/signup", async(req,res) => {
    try{
       await UserModel.findEmailAndPhone(req.body.credentials);


const newUser = await UserModel.create(req.body.credentials);

const token = newUser.generateJwtToken();

    return res.status(200).json({token});
    }catch (error){
        return res.status(500).json({error: error.message});
    }
});

/*
Route           /signin|
Descrip           Signin with email & password
Params              None
Access              Public
Method              POST
*/

Router.post("/signin", async(req,res) => {
    try{

        const doesUserExist = await UserModel.findByEmailAndPassword(req.body.credentials);
       


const token = User.generateJwtToken();

    return res.status(200).json({token, status: "Success"});
    }catch (error){
        return res.status(500).json({error: error.message});
    }
});

export default Router;