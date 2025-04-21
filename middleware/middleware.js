


const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config(); 

// Middleware للتحقق من صحة التوكن
const authenticate = (req, res, next) => {
  const token = req.cookies?.token;
  const authHeader = req.headers["authorization"];
  const headerToken = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;
  const finalToken = token || headerToken;

  if (!finalToken) {
    return res.status(403).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(finalToken, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

// Middleware للتحقق من صحة كلمة المرور والهاتف
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

module.exports = { authenticate, validateUserInput };
