import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminDashboard from './admin/pages/AdminDashboard';
import LoginPage from './admin/pages/LoginPage';
import StudentDashboard from './student/pages/StudentDashboard';
import PrivateRoute from './PrivateRoute'; // استيراد مكون الحماية

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        
        {/* حماية مسار لوحة تحكم الأدمن مع التحقق من أن الدور هو "admin" */}
        <Route path="/admin-dashboard" element={<PrivateRoute element={AdminDashboard} requiredRole="admin" />} />
        
        {/* حماية مسار لوحة تحكم الطالب مع التحقق من أن الدور هو "student" */}
        <Route path="/student-dashboard" element={<PrivateRoute element={StudentDashboard} requiredRole="student" />} />
      </Routes>
    </div>
  );
}

export default App;
