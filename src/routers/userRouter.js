var express = require("express");
const router = express.Router();
const verifyToken = require("../App/middleware/verifyToken");

const User = require("../App/controllers/UserController");

router.post("/create", User.createNewUser);
router.post("/login", User.login);
router.get("/verify-token", verifyToken, (req, res) => {
  res.status(200).json({ message: "Token is valid.", user: req.user });
});

module.exports = router;
