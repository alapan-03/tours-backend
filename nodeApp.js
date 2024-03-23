// Ynd9DAItyvIJvSvh

const tourRouter = require("./router/tourRouter")
const userRouter = require("./router/userRouter")
const detailRouter = require("./router/detailRouter")
const reviewRouter = require("./router/reviewRouter")
const bookedRouter = require("./router/bookedRouter")

const express= require("express");
const app = express()
const cors = require("cors")


// app.use(cors())

const corsOptions = {
    origin: 'https://tours-and-travels-8893.onrender.com',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
};


app.use(cors(corsOptions));

// app.use(auth(config));


app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/details", detailRouter);
app.use("/api/v1/review", reviewRouter);
app.use("/api/v1/booked", bookedRouter);

module.exports = app;