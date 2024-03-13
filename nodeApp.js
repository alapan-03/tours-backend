// Ynd9DAItyvIJvSvh

const tourRouter = require("./Router/tourRouter")
const userRouter = require("./Router/userRouter")
const detailRouter = require("./Router/detailRouter")
const reviewRouter = require("./Router/reviewRouter")
const bookedRouter = require("./Router/bookedRouter")

const express= require("express");
const app = express()
const cors = require("cors")


// app.use(cors())

const corsOptions = {
    origin: 'http://localhost:3001',
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