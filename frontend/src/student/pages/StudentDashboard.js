import React, { useState } from 'react';
import { Button, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import StudentProfile from './StudentProfile';  // صفحة عرض وتعديل معلومات الطالب
import ViewCourses from './ViewCourses';  // صفحة عرض المواد الدراسية
import ViewGrades from './ViewGrades';  // صفحة عرض العلامات
import Cookies from 'js-cookie';

function StudentDashboard() {
  const [activeComponent, setActiveComponent] = useState('profile');
  const navigate = useNavigate();

  // وظيفة تسجيل الخروج
  const handleLogout = async () => {
    try {
      await fetch('http://localhost:3000/logout', {
        method: 'POST',
        credentials: 'include', // هذا مهم جدًا لإرسال الكوكي
      });
  
      // بعد نجاح الطلب، تقدر تحذف الكوكي المحلي (لو موجود) وتعيد التوجيه
      Cookies.remove('student_id');
      Cookies.remove('jwt_token')
      Cookies.remove('role');
      navigate('/');
    } catch (error) {
      console.error('خطأ أثناء تسجيل الخروج:', error);
    }
  };
  
  // تحديد المكون النشط بناءً على الاختيار
  const renderComponent = () => {
    switch (activeComponent) {
      case 'profile':
        return <StudentProfile />;
      case 'courses':
        return <ViewCourses />;
      case 'grades':
        return <ViewGrades />;
      default:
        return <StudentProfile />;
    }
  };

  return (
    <div className="d-flex" style={{ minHeight: '100vh' ,flexDirection: 'row-reverse'  }}>
      {/* الشريط الجانبي */}
      <div className="bg-sidebar text-white p-3" style={{ width: '250px' }}>
        <h4 className="text-center mb-4">لوحة التحكم للطالب</h4>
        <Nav className="flex-column">
          <Nav.Link
            onClick={() => setActiveComponent('profile')}
            className={`text-white sidebar-link ${activeComponent === 'profile' ? 'active' : ''}`}dir="rtl"
          >
            معلومات الطالب
          </Nav.Link>
          <Nav.Link
            onClick={() => setActiveComponent('courses')}
            className={`text-white sidebar-link ${activeComponent === 'courses' ? 'active' : ''}`}dir="rtl"
          >
            عرض المواد الدراسية
          </Nav.Link>
          <Nav.Link
            onClick={() => setActiveComponent('grades')}
            className={`text-white sidebar-link ${activeComponent === 'grades' ? 'active' : ''}`}dir="rtl"
          >
            عرض العلامات
          </Nav.Link>
          <hr className="bg-white" />
          <Button variant="danger" onClick={handleLogout} className="mt-3 w-100">تسجيل الخروج</Button>
        </Nav>
      </div>

      {/* محتوى الصفحة */}
      <div className="flex-grow-1 p-4" style={{ backgroundColor: '#f8f9fa' }}>
        {renderComponent()}
      </div>

      {/* تنسيق CSS مضمن */}
      <style jsx="true">{`
        .bg-sidebar {
          background-color: #2c3e50;
        }
        .sidebar-link {
          margin: 5px 0;
          padding: 10px;
          border-radius: 5px;
          transition: all 0.2s ease-in-out;
        }
        .sidebar-link:hover,
        .sidebar-link.active {
          background-color: #1abc9c;
          color: white;
        }
      `}</style>
    </div>
  );
}

export default StudentDashboard;
