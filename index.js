import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema({
    fullname: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    address: [{detail: {type:String}, for:{type:String}}],
    phoneNumber: [{type: Number}]
},

{
    timestamps: true
});

UserSchema.methods.generateJwtToken = function(){
    return jwt.sign({user: this._id.toString()}, "ZomatoApp");
};

UserSchema.statics.findEmailAndPhone = async ({email, phoneNumber}) => {
    const checkUserByEmail = await UserModel.findOne({email});
    const checkUserByPhone = await UserModel.findOne({phoneNumber});
    if(checkUserByEmail || checkUserByPhone){
        throw new Error("user already exist");
    }
    return false;
};

UserSchema.statics.findByEmailAndPassword = async ({email, password}) => {
    const User = await UserModel.findOne({email});
    if(!user) throw new Error("User doesnot exist");
    //compare password
    const doesPasswordMatch = await bcrypt.compare(password, user.password)

    
    if(!doesPasswordMatch){
        throw new Error("Invalid password");
    }
    return user;
};

UserSchema.pre("save",function(next){
        const user = this;
//password isnot modified 
        if(!user.isModified("password")) return next();
//generated bcrypy salt
        bcrypt.genSalt(8,(error,salt)=> {
            if(error) return next(error);


            bcrypt.hash(user.password, salt, (error,hash)=>{
                if(error) return next(error);
                //assigning hashed password
                user.password = hash;
                return next();
            })
        });
});

export const UserModel = mongoose.model("Users", UserSchema);