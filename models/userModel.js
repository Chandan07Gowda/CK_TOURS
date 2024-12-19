const crypto=require('crypto');
const mongoose=require('mongoose');
const validator =require('validator');
const bcrypt=require('bcryptjs');
const { isLowercase } = require('validator');
const { validate } = require('./tourModel');
const { type } = require('os');

const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'User must have a name']
    },
    email:{
        type:String,
        unique:true,
        required:[true,'Please provide your Email'],
        isLowercase:true,
        validate:[validator.isEmail,'Please provide valid email']
    },
    photo:{
        type:{
            type:String,
            default:'default.jpg'
    }
    },
    role:{
        type:String,
        enum:['user','guide','lead-guide','admin'],
        default:'user'
    },
    password:{
        type:String,
        required:[true,'User must have pssword'],
        minlength:8,
        select:false
    },
    passwordConfirm:{
        type:String,
        required:[true,'User must have pssword'],
        validate: {
            validator: function(el){
                return el === this.password; 
            },
            message:`Passwordconfirm doesn't match with password`
        }
    },
    passwordChangedAt:Date,
    passwordResetToken:String,
    passwordResetExpires:Date,
    active:{
        type:Boolean,
        default:true,
        select:false
    }
});


UserSchema.pre('save',async function(next){
    //only runs this function if password was modified 
    if(!this.isModified('password')) return next();
    //Hash the password with cost of 12
    this.password =await bcrypt.hash(this.password,12);
    //Delete the passwordConfirm field in DATABASE
    this.passwordConfirm = undefined;
    next();
});

UserSchema.pre('save',function(next){
    if(!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
});

UserSchema.pre(/^find/,function(next){
    //this points to current querey
    this.find({active:{$ne:false}});
    next();
});


UserSchema.methods.correctPassword =async function(candidatePassword,userPassword){
    return await bcrypt.compare(candidatePassword,userPassword);
}



UserSchema.methods.changePasswordAfter = function(JWTTimestamp){
if(this.passwordChangedAt){
    const changedTimestamp=parseInt(this.passwordChangedAt.getTime() / 1000,10)
    //console.log(this.passwordChangedAt,JWTTimestamp);
    return JWTTimestamp < changedTimestamp;
}
// False means NOT Changes
    return false;
};


UserSchema.methods.createPasswordResetToken = function(){
    const resetToken = crypto.randomBytes(32).toString('hex');

   this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

   this.passwordResetExpires = Date.now() + 10*60*1000;

   return resetToken;
}
const User=mongoose.model('User',UserSchema);

module.exports = User;