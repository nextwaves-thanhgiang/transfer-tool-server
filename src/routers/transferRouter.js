var express = require("express");
const router = express.Router();
// const verifyToken = require("../App/middleware/verifyToken");

const Transfer = require("../App/controllers/Transfer");

router.post("/create", Transfer.createTransferSlip);
router.get("/transfer-details/:id", Transfer.getDataById);
// router.post("/login", User.login);
// router.get("/verify-token", verifyToken, (req, res) => {
//   res.status(200).json({ message: "Token is valid.", user: req.user });
// });

module.exports = router;
