const express = require("express");
const authController = require("../Controllers/authController");

const router = express.Router();

//router.get("/signUp",authController.signUp);
router.post("/signUp",authController.signUp);
router.post("/logIn",authController.logIn);
router.put("/updateInfos",authController.updateInfos);
// Simple POST route for testing
//router.post("/signUp1",authController.signUp1);
//router.post("/addUserActivity",authController.addUserActivity);
router.post("/addUserActivity", authController.addUserActivity);

module.exports = router;