


const jwt = require("jsonwebtoken");
const connection = require("../db");

// Verify user token
const authenticate = (req, res, next) => {
  const token = req.cookies?.jwt_token;
  const authHeader = req.headers["authorization"];
  const headerToken = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;
  const finalToken = token || headerToken;

  if (!finalToken) {
    return res.status(403).json({ message: "لا يوجد توكن" });
  }

  try {
    const decoded = jwt.verify(finalToken, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "التوكن غير صالح" });
  }
};

// Validate user input fields
const validateUserInput = async (req, res, next) => {
  const {full_name,email,address,  password, phone } = req.body;

  if(!full_name || !email|| !address || !phone){
    return res.status(400).json({message: "الرجاء ادخال جميع الخانات"})
  }

  if (full_name.length < 3) {
    return res.status(400).json({ message: "الاسم  يجب أن يكون 3 أحرف على الأقل" });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(email)) {
  return res.status(400).json({ message: " البريد الإلكتروني غير صحيح" });
}

  if (password && password.length < 8) {
    return res.status(400).json({ message: "يجب ان تكون كلمة المرور 8 خانات على الاقل" });
  }

  if (!/^\d{10}$/.test(phone)) {
    return res.status(400).json({ message: "رقم الهاتف يجب أن يتكون من 10 أرقام فقط" });
  }
  
  if (address.length < 3) {
    return res.status(400).json({ message: "اسم المدينة يجب أن يكون 3 أحرف على الأقل" });
  }
  

  next();
};

const checkEmailPhoneUnique = (req, res, next) => {
  const id = req.params.id || req.body.id;
  const { email, phone } = req.body;

  const adminQuery = id
    ? "SELECT * FROM admins WHERE (email = ? OR phone = ?) AND id != ?"
    : "SELECT * FROM admins WHERE (email = ? OR phone = ?)";

  const adminParams = id ? [email, phone, id] : [email, phone];

  const studentQuery = id
    ? "SELECT * FROM students WHERE (email = ? OR phone = ?) AND id != ?"
    : "SELECT * FROM students WHERE (email = ? OR phone = ?)";

  const studentParams = id ? [email, phone, id] : [email, phone];

  connection.query(adminQuery, adminParams, (err, adminResult) => {
    if (err) return res.status(500).json({ message: "خطأ أثناء التحقق من البيانات (admins)" });

    if (adminResult.length > 0) {
      return res.status(400).json({ message: "البريد الإلكتروني أو رقم الهاتف مستخدم مسبقًا من مشرف آخر" });
    }

    connection.query(studentQuery, studentParams, (err, studentResult) => {
      if (err) return res.status(500).json({ message: "خطأ أثناء التحقق من البيانات (students)" });

      if (studentResult.length > 0) {
        return res.status(400).json({ message: "البريد الإلكتروني أو رقم الهاتف مستخدم مسبقًا من طالب" });
      }

      next();
    });
  });
};





module.exports = { authenticate, validateUserInput ,checkEmailPhoneUnique};
