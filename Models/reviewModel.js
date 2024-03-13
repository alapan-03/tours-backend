const mongoose = require("mongoose");
const Tour = require("./../Models/tourModel")

const reviewSchema = mongoose.Schema({
    review: {
        type: String,
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, "needed"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    },

    tour:{
        type: mongoose.Schema.ObjectId,
        ref: "Tour"
    },

    user:{
        type: mongoose.Schema.ObjectId,
        ref: "User"
    }, 
})

// reviewSchema.pre(/^find/, function(next){
//     this.populate({
//         path: "tour",
//         select: "name"
//     }).populate({
//         path: "user",
//         select: "name photo"
//     })

//     next()
// })


reviewSchema.statics.calcAvg = async function (tourId) {
    const stats = await this.aggregate([
        {
            $match: { tour: tourId }
        },
        {
            $group: {
                _id: "$tour",
                nrating: {$sum: 1 },
                avgRating: { $avg: '$rating' }        
            }
        }
    ])
    
    await Tour.findByIdAndUpdate(tourId, {
        ratingsQuantity: stats[0].nrating,
        ratings: stats[0].avgRating
    })
}

reviewSchema.post("save", function(){
    this.constructor.calcAvg(this.tour)
})

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;