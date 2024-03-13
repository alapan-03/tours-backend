const express= require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const detailsController = require("./../Controllers/detailsController")
const authController = require("./../Controllers/authController")


router.route("/:tourId/addDetails").post(bodyParser.json(), authController.protect, detailsController.addDetails);
router.route("/").get(bodyParser.json(), authController.protect, detailsController.getDetail);
router.route("/:tourId/getAllDetails").get(bodyParser.json(), authController.protect, detailsController.getAllDetail);

module.exports = router;