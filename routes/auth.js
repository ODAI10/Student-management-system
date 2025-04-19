const express = require("express"); 
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const connection = require("../db");

 const router = express.Router();  

// LOGIN
router.post("/login", (req, res) => {
    const { email, password } = req.body;

    const queryAdmins = "SELECT * FROM admins WHERE email = ?";
    connection.query(queryAdmins, [email], (err, result) => {
        if (err) return res.status(500).json({ error: 'Database error' });
 
        if (result.length > 0) {  
            const admin = result[0];
            bcryptjs.compare(password, admin.password, (err, isMatch) => {
                if (err) return res.status(500).json({ error: 'Error comparing password' });
                if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

                const payload = { id: admin.id, email: admin.email, role: 'admin' };
                const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

                res.cookie("jwt_token", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: 60 * 60 * 1000
                });
                return res.json({
                    message: 'Login successful',
                    role: 'admin',
                    token,  
                    user: admin,
                    student_id: null
                });
                
            });
        } else {
            const queryStudents = "SELECT * FROM students WHERE email = ?";
            connection.query(queryStudents, [email], (err, result) => {
                if (err) return res.status(500).json({ error: 'Database error' });
                if (result.length === 0) return res.status(400).json({ message: 'User not found' });

                const student = result[0];
                bcryptjs.compare(password, student.password, (err, isMatch) => {
                    if (err) return res.status(500).json({ error: 'Error comparing password' });
                    if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

                    const payload = { id: student.id, email: student.email, role: 'student' };
                    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
                    res.cookie("jwt_token", token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                        sameSite: "strict",
                        maxAge: 60 * 60 * 1000
                    });
                    
                    return res.json({
                        message: 'Login successful',
                        token,
                        role: 'student',
                        user: student,
                        student_id: student.id 
                    });
                });
            });
        }
    });
});


router.post('/logout', (req, res) => {
    const token = req.cookies.jwt_token;
  
    if (!token) {
      return res.status(400).json({ message: 'لا يوجد توكن لحذفه' });
    }
  
    // إذا وجدنا التوكن، نمسحه
    res.clearCookie('jwt_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict"
    });
  
    return res
      .status(200)
      .json({ message: 'تم تسجيل الخروج بنجاح' });
  });
  

module.exports = router; 
