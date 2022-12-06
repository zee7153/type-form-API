const bcrypt = require('bcryptjs')

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
     name:{
        type:String,
        // required:[true,"Please Enter your Name"]
     },
     email:{
        type:String,
        required:[true,"Please Enter your Email"],
        unique :true,
        // trim : true,
        // match: [
        //     /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        //     "Please  enter a Valid Email"
        // ]
     },
     password:{
        type:String,
        // required:[true,"Please Enter a password"],
        // minLength:[6,"Password must be up to 6 characters"],
        // maxLength:[23,"Password must not be more than 23 characters"]
     }
},{
    timestamps: true
});

    // Encrypt Password Before to Saving DB
    userSchema.pre("save", async function(next){
        if(!this.isModified("password")){
            return next();
        }
      
        //Hash password
        
        const salt = await bcrypt.genSalt(10)
        const hashesPassword = await bcrypt.hash(this.password, salt);
        this.password = hashesPassword
        next();
    })


const User = mongoose.model("User", userSchema);

module.exports = User;
