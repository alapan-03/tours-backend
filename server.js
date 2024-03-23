const mongoose = require("mongoose");
const app = require("./nodeApp")
const cors = require('cors');

app.use(cors({
    origin: 'https://tours-and-travels-8893.onrender.com', // Replace with your React app's URL
    credentials: true,
}));


mongoose.connect("mongodb+srv://karriku03:Ynd9DAItyvIJvSvh@cluster1.96v8wam.mongodb.net/?retryWrites=true&w=majority", {
// mongoose.connect("mongodb+srv://karriku03:Ynd9DAItyvIJvSvh@cluster1.96v8wam.mongodb.net/", {
    // useNewUrlParser:true,
    // useCreateIndex: true,
    // useFindAndModify: false
}).then(() => console.log("DB connection successful"))


app.listen(process.env.PORT || 4000, ()=>{
    console.log("App is running...")
})
