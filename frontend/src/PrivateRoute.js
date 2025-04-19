import React from 'react';
import { Navigate } from 'react-router-dom';

import Cookies from 'js-cookie';

const PrivateRoute = ({ element: Element, requiredRole, ...rest }) => {

  const token = Cookies.get('jwt_token'); // استرجاع التوكن من الكوكيز
  const role = Cookies.get('role');
  if (!token) {
    // إذا لم يوجد التوكن، أعد توجيه المستخدم إلى صفحة تسجيل الدخول
    return <Navigate to="/" />;
  }

  if (requiredRole && requiredRole !== role) {
    // إذا كان الدور غير متوافق مع المطلوب، أعد توجيه المستخدم إلى الصفحة التي كان فيها
    if (role === "admin") {
      return <Navigate to="/admin-dashboard" />; // إذا كان الأدمن، أعده إلى صفحة الأدمن
    } else if (role === "student") {
      return <Navigate to="/student-dashboard" />; // إذا كان الطالب، أعده إلى صفحة الطالب
    }
  }
  // إذا كان التوكن موجودًا والدور صحيح، يعرض المكون المحدد
  return <Element {...rest} />;
};

export default PrivateRoute;
