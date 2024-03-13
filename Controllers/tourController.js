const Tour = require("../Models/tourModel");
const fs = require("fs");
const factory = require("./factoryHandler")

exports.getAllTours = async (req, res) => {
    try{
        if(req.query.name ){
            let data = await Tour.find({name:req.query.name});

            res.status(200).json({
                data
            })
        }
        else{
            let data = await Tour.find();
            res.status(200).json({
                data
            })
        }
    }
    catch(err){
        console.log(err);
    }
}


exports.getById = async (req, res) => {
try{
    const getById = await Tour.findById(req.params.id);
    let popu = await getById.populate("reviews")
    // console.log(popu)

    res.status(200).json({
        status: "success",
        message: getById
    })
}
catch(err){
    console.log(err)
}
}

exports.createTour = factory.createDoc(Tour);

exports.deleteById = factory.deleteDoc(Tour);

exports.editById = factory.updateDoc(Tour);



const readFile = JSON.parse(fs.readFileSync("./data.json", "utf-8"))

// console.log(readFile)
const addAll = async () => {
try{
    await Tour.create(readFile);
    console.log("Data successfully loaded!")
}
catch(err){
    console.log(err);
}

}

const deleteAll = async () => {
try{
     await Tour.deleteMany();

     res.status(200).json({
        status:"success",
        message: "All data deleted"
     })
    }
catch(err){
        console.log(err);
    }
}

// addAll();
// deleteAll();
