const express = require("express");
const authController = require("../Controllers/authController");

const router = express.Router();

router.get("/allAccount",authController.allAccount);
router.post("/createAccount",authController.createAccount);
router.put("/updateAccountInfos",authController.updateAccountInfos);
router.get("/retrieveAccount",authController.retrieveAccount);
router.post("/addAccountActivity",authController.addAccountActivity);

module.exports = router;