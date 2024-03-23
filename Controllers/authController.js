const mongoose = require("mongoose");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const sendEmail = require("./../utils/email")
let express = require('express'); 
let app = express() 
// let cookieParser = require('cookie-parser'); 
// let cookie = require("js-cookie")


// app.use(cookieParser()); 


exports.signup = async (req, res, next) => {
try{
    const newUser = await User.create(req.body);

    const token = jwt.sign({id: newUser._id}, "my-very-naughty-monkey-just-swallowed-pumkin-nuts")
    req.name = newUser.name;

     res.status(201).json({
        status: "success",
        token
     })

} catch(err){
    res.status(500).json({
        status: "fail",
        // message: "Error while creating an user"
        message: err
    })
}
}



exports.login = async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const us = await User.findOne({email: email})

      let name;
      if(us){
        name = us.name;
      }
      else
      name = "duck"

      // res.status(404).json({
      //   status: "fail",
      //   message: "User not found"
      // })



      // console.log(name);
  
      if (!email || !password) {
        // throw new Error("Please provide credentials")
        return req.status(400).json({
          status: 'fail',
          message: 'Please provide credentials',
        });
        // return next()
      }
  
      // const user = await User.findOne({ email }).select('+password');
      const user = await User.findOne({ email });
  
      if (!user || !(await user.correctPassword(password, user.password))) {
        return req.status(400).json({
          status: 'fail',
          message: 'Incorrect email or password',
        });
        // return next();
      }
  
      const token = jwt.sign({ id: user._id },  "my-very-naughty-monkey-just-swallowed-pumkin-nuts");
  
      res.status(200).json({
        status: 'success',
        token,
        name
      });
    } catch (err) {
      return res.status(400).json({
        status: 'fail',
        message: "Invalid or unentered credentials",
      });
    }
  };
  


exports.protect = async (req, res, next) => {
// 1. Check for token in header

try{
let token;
if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
    token = req.headers.authorization.split(" ")[1];

    if(!token){
        return res.status(400).json({
            status: "fail",
            message: "Invalid or missing token"
        })
    }
}

// 2. Verify token

const decoded = await promisify(jwt.verify)(token, "my-very-naughty-monkey-just-swallowed-pumkin-nuts");
// console.log(decoded);


// 3. Check if the user still exists

const currUser = await User.findById(decoded.id);
// console.log(decoded.id)

if(!currUser){
    return res.status(400).json({
        status: "fail",
        message: "Account doesn't exist"
    })
}

// 4. If the password is changed afterwards

// if(currUser.handleChangedPassword(decoded.iat)){
//     return res.status(400).json({
//         status: "fail",
//         message: "Password was changed later"
//     })
// }

req.user = currUser;

}catch(err){
  return res.status(500).json({
    status: "fail",
    message: err
  })
}
// console.log(req.user)
next()

}



// exports.bookedTours = async (req, res, next) => {
//   try{
//   const user = await User.findByIdAndUpdate(req.user._id.toString(), req.body, {new: false});

//   res.status(200).json({
//     status: "success",
//     body: req.body
//   })
// } catch(err){
//   res.status(400).json({
//     status: "fail",
//     message: err
//   })
// }
// }






exports.restrictTo = function (...roles){
    return (req, res, next) => {
        console.log(req.user.role)
        if(!roles.includes(req.user.role)){
            return res.status(404).json({
                status: "fail",
                message: "You are not permitted"
            })
        }
        next();
    }
}

exports.forgotPassword = async function (req, res, next) {
    const user = await User.findOne({email: req.body.email})
    console.log(req.body.email);

    if(!user){
        return res.status(404).json({
            status: "fail",
            message: "User is not valid"
        })
    }

    const token = user.forgotPass();
    await user.save({validateBeforeSave: false});


    // Send reset mail

    const resetUrl = `${req.protocol}:/${req.get("host")}/api/v1/${token}`

    const msg = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetUrl}.\nIf you didn't forget your password, please ignore this email!`;

    try{
    await sendEmail({
        email: user.email,
        subject: 'Your password reset token (valid for 10 min)',
        msg
      });

    res.status(200).json({
        status:"success",
        message: "Token sent to mail"
    })
} catch (err) {
    user.passwordResetToken = undefined;
    user.passwordTokenExp = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(400).json({
        status:"fail",
        message: "Error in sending email"
    })
    return next();
}

}

