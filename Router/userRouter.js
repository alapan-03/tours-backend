const express= require("express");
const router = express.Router();
const authController = require("../Controllers/authController");
const userController = require("../Controllers/userController");
const bodyParser = require("body-parser");
const multer = require("multer")

const upload = multer({ dest: "./../../Assets/imgs" })

// router.route("/token").get(authController.token);
router.route("/signup").post(bodyParser.json(), authController.signup);
router.route("/login").post(bodyParser.json(), authController.login);
router.route("/forgotPass").post(bodyParser.json(), authController.forgotPassword);

// router.route("/booked").post(bodyParser.json(), authController.protect, authController.bookedTours)
router.route("/me").get(authController.protect, upload.single("photo") ,userController.getMe)
router.route("/:tourId/addToBook").patch(bodyParser.json(), authController.protect, userController.updateMe);
router.route("/cancelBooking/:id").delete(bodyParser.json(), authController.protect, userController.cancelBooking);


// router.use(authController.restrictTo("admin"))

router.route("/").get(userController.getAllUsers);
router.route("/:id").get(userController.getUser);
router.route("/:id").delete(userController.deleteUser);


module.exports = router;