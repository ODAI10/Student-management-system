


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

  if(!full_name || !email|| !address){
    return res.status(400).json({message: "الرجاء ادخال جميع الخانات"})
  }
  if (password && password.length < 8) {
    return res.status(400).json({ message: "يجب ان تكون كلمة المرور 8 خانات على الاقل" });
  }

  if (phone && phone.length !== 10) {
    return res.status(400).json({ message: "رقم الهاتف يجب ان يكون 10 ارقام " });
  }

  next();
};

module.exports = { authenticate, validateUserInput };
