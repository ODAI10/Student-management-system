const express = require("express"); 
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const connection = require("../db");
const router = express.Router();  


function authenticateUser(email, password, userType, res, callback) {
  const query = `SELECT * FROM ${userType} WHERE email = ?`;

  connection.query(query, [email], (err, result) => {
    if (err) return res.status(500).json({ error: 'خطا في قاعدة البيانات ' });

    if (result.length === 0) {
      if (typeof callback === 'function') return callback(); 
      return res.status(400).json({ message: 'لا يوجد مستخدم   ' });
    }

    const user = result[0];

    bcryptjs.compare(password, user.password, (err, isMatch) => {
      if (err) return res.status(500).json({ error: 'خطا في مطابقة كلمة المرور  ' });
      if (!isMatch) return res.status(400).json({ message: 'كلمة المرور غير صالحة' });

      const role = userType === 'admins' ? 'admin' : 'student';
      const payload = { id: user.id, email: user.email, role };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.cookie("jwt_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 1000
      });

      const student_id = role === 'student' ? user.id : null;

      return res.json({
        message: 'Login successful',
        token,
        role,
        user,
        student_id
      });
    });
  });
}

// LOGIN
router.post("/login", (req, res) => {
    const { email, password } = req.body;

    // check if it's admin
    authenticateUser(email, password, 'admins', res, () => {
    // check if it's a student
    authenticateUser(email, password, 'students', res);
    });
});

router.post('/logout', (req, res) => {
    const token = req.cookies.jwt_token;
    if (!token) {
      return res.status(400).json({ message: 'لا يوجد توكن لحذفه' });
    }
    // remove Cookie
    res.clearCookie('jwt_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict"
    });
  
    return res.status(200).json({ message: 'تم تسجيل الخروج بنجاح' });
  });
  

module.exports = router; 
