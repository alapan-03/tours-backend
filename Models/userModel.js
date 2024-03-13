const { default: userEvent } = require("@testing-library/user-event");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        // unique: true,
        trim: true,
        required: [true, "A name is required while signing up"],
    },

    photo: String,

    email: {
        type: String,
        validate: [validator.isEmail, "Please provide a valid email"],
        required: [true, "An email is required while signing up"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "A password is required while signing up"]
    },
    confirmPassword: {
        type: String,
        validate: {
            validator: function (el){
                return el === this.password;
            },
            message: "Passwords are not same"
        },
        required: [true, "Password confirmation is required while signing up"]
    },
    passChangedAt: Date,
    role: {
        type: String,
        enum: ["admin", "guide", "lead-guide", "user"],
        default: "user"
    },

    passwordResetToken: String,
    passwordTokenExp: Date,

    // bookedTour: [
    //     {
    //       tourId: {
    //         type: Schema.Types.ObjectId,
    //         ref: 'Tour'
    //       },
    //       tourName: {
    //         type: String,
    //         ref: "Tour"
    //       },
    //       tourPrice: Number,
    //       bookedDate: Date
    //     }
    // ]

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    tour: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Tour'
    },
    detail: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Details'
    },
},
{
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
}
)



UserSchema.pre(/^find/, function(next){
    this.populate({
        path: "tour",
        select: "name price image",
    }).populate({
        path: "detail"
    })

    next()
})


  

// UserSchema.index({ email: 1 }, { unique: true });


UserSchema.pre("save", async function(next){
    if(!this.isModified("password"))
    return next();

    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined;
    next()
})


UserSchema.methods.correctPassword = async function(inputPass, userPass){
    return await bcrypt.compare(inputPass, userPass);
}

UserSchema.methods.handleChangedPassword = async function(tokenTime){
    if(this.passChangedAt){
        return this.passChangedAt > tokenTime;
    }
    return false;
}


UserSchema.methods.forgotPass = async function(){
    const passToken = crypto.randomBytes(32).toString("hex");
    
    this.passwordResetToken = crypto.createHash("sha256").update(passToken).digest("hex");
    this.passwordTokenExp = Date.now() *10 * 60 *1000;

    // console.log(passToken, this.passwordResetToken);
    return passToken;

}


const User = mongoose.model("User", UserSchema);

module.exports = User;

