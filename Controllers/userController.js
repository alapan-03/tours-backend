const fs = require("fs")
const User = require("./../models/userModel");

// const readFile = JSON.parse(fs.readFileSync("./dev-data/data/tours-simple.json"))


function filteredBody(currObj, ...items) {
    const newObj = {};
    
    if (currObj && typeof currObj === 'object') {
        Object.keys(currObj).forEach(el => {
            if (items.includes(el))
                newObj[el] = currObj[el];
        });
    }
    
    return newObj;
}

exports.updateMe = async (req, res) => {

    try {

        req.body = {
            tour: req.params.tourId
        }
        // Extract only the allowed fields (e.g., 'tour') from the request body
        const filteredBod = req.body && filteredBody(req.body, 'tour');

        // Log the filtered body to check if 'tour' is being extracted properly
        console.log('Filtered Body:', filteredBod);

        // Assuming 'tour' is a field in the User model that you want to update
        const user = await User.findByIdAndUpdate(req.user._id, 
        //     filteredBod, {
        //     new: false,
        //     runValidators: true
        // }

        { $addToSet: { tour: { $each: [filteredBod.tour] } } },
            { new: true, runValidators: true }
        );

        // Log the updated user to check if 'tour' is updated properly
        console.log('Updated User:', user);

        res.status(200).json({
            status: "success",
            user
        });


        exports.updateMe = async (req, res, next) => {
            const doc = await User.findByIdAndUpdate(req.params.id, req.body, {
              new: true,
              runValidators: true
            });
        
            if (!doc) {
              return next(new AppError('No document found with that ID', 404));
            }
        
            res.status(200).json({
              status: 'success',
              data: {
                data: doc
              }
            });
          }

    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err.message
        });
    }
};


exports.cancelBooking = async (req, res, next) => {

    try {
        // Find the user by ID
        const user = await User.findById(req.user._id);
        
        if (!user) {
            return res.status(404).json({
                status: 'fail',
                message: 'User not found',
            });
        }
        
        // console.log(user.tour)
        // Identify the index of the "Gujarat" tour in the user's tour array
        // console.log(user.tour[0]._id)
        const gujaratTourIndex = user.tour.findIndex(tour => tour.id === req.params.id);
        // console.log(gujaratTourIndex)
        
        if (gujaratTourIndex === -1) {
            return res.status(404).json({
                status: 'fail',
                message: 'Gujarat tour not found for this user',
            });
        }
        
        // Remove the "Gujarat" tour from the array
        user.tour.splice(gujaratTourIndex, 1);
        
        // Save the updated user document
        await user.save({validateBeforeSave: false});
        // console.log("dkofdk");
        
        res.status(200).json({
            status: 'success',
            user,
        });
    } catch (err) {
        res.status(500).json({
            status: 'fail',
            message: err.message,
        });
    }
}


exports.getAllUsers = async (req, res) => {
    try{
        const users = await User.find();

        // SEND RESPONSE
        res.status(200).json({
          status: 'success',
          results: users.length,
          data: {
            users
          }
        });
    }
    catch(err){
    res.status(500).json({
        status: "error",
        message: "Not yet defined"
    })
}
}


exports.getUser = async (req, res, next) => {
    try{
        const user = await User.findById(req.params.id)
        // .populate("bookedTours");

        res.status(200).json({
            status: "success",
            user
        })
    }
    catch(err){
        res.status(500).json({
            status: "fail",
            message: err
        })
    }
}
// exports.createUser = (req, res) => {
//     res.status(500).json({
//         status: "error",
//         message: "Not yet defined"
//     })
// }


exports.getMe = async (req, res) => {
try{
    const me = await User.findById(req.user.id);

    res.status(200).json({
        status: "success",
        me
    })
}
catch(err){
    res.status(404).json({
        status: "fail",
        message: err
    })
}
}


exports.updateUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "Not yet defined"
    })
}


exports.deleteUser = async (req, res) => {
try{
    const user = await User.findByIdAndDelete(req.params.id);

    res.status(204).json({
        status: "success",
        message: "User deleted"
    })
}
catch(err){
    res.status(500).json({
        status: "error",
        message: "Not deleted"
    })
}
}
