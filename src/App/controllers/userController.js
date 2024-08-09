const userModal = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

class userController {
  async createNewUser(req, res) {
    const { email, username, password, fullName, role } = req.body;
    try {
      console.log("Join to createNewUser");

      // Kiểm tra xem email hoặc username đã tồn tại hay chưa
      const existingUser = await userModal.findOne({
        $or: [{ email }, { username }],
      });
      if (existingUser) {
        return res
          .status(400)
          .json({ error: "Email hoặc tên người dùng đã tồn tại" });
      }

      // Băm mật khẩu
      const hashedPassword = await bcrypt.hash(password, 10);

      console.log(hashedPassword);

      // Tạo người dùng mới
      const newUser = new userModal({
        email,
        username,
        password: hashedPassword,
        fullName,
        role,
      });

      // Lưu người dùng mới vào cơ sở dữ liệu
      await newUser.save();

      console.log("Tạo tài khoản thành công:", newUser);
      return res
        .status(201)
        .json({ message: "Tạo tài khoản thành công", user: newUser });
    } catch (error) {
      console.error("Lỗi khi tạo tài khoản:", error.message);
      return res.status(500).json({ error: "Lỗi khi tạo tài khoản" });
    }
  }

  async login(req, res) {
    const { email, password } = req.body;

    console.log("Join to Login controller : ", req.body);

    try {
      // Kiểm tra xem người dùng có tồn tại không
      const user = await userModal.findOne({
        $or: [{ email: email }, { username: email }],
      });
      if (!user) {
        return res
          .status(400)
          .json({ error: "Email hoặc mật khẩu không đúng" });
      }

      // Kiểm tra mật khẩu
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ error: "Email hoặc mật khẩu không đúng" });
      }

      // Tạo token JWT
      const payload = {
        userId: user._id,
        username: user.username,
        role: user.role,
      };

      const token = jwt.sign(payload, "Nextwaves@2023", { expiresIn: "1h" });

      // Trả về token
      return res.status(200).json({ token });
    } catch (error) {
      console.error("Lỗi khi đăng nhập:", error.message);
      return res.status(500).json({ error: "Lỗi khi đăng nhập" });
    }
  }
}

module.exports = new userController();
