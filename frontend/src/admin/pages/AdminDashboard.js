import React, { useState } from 'react';
import { Button, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ManageStudents from './ManageStudents';
import AdminProfile from './AdminProfile';
import ManageCourses from './ManageCourses';
import ManageGrades from './ManageGrades';
import AddStudentCourses from './Add-student-courses';
import AddAdmin from './AddAdmin';
import Cookies from 'js-cookie';

function AdminDashboard() {
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
        return <AdminProfile />;
      case 'students':
        return <ManageStudents />;
      case 'courses':
        return <ManageCourses />;
      case 'grades':
        return <ManageGrades />;
      case 'student-courses':
        return <AddStudentCourses />;
      case 'add-admin':
        return <AddAdmin />;
      default:
        return <AdminProfile />;
    }
  };

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      {/* الشريط الجانبي */}
      <div className="bg-sidebar text-white p-3" style={{ width: '250px' }}>
        <h3 className="text-center mb-4">لوحة التحكم</h3>
        <Nav className="flex-column">
          <Nav.Link
            onClick={() => setActiveComponent('profile')}
            className={`text-white sidebar-link ${activeComponent === 'profile' ? 'active' : ''}`}
          >
            معلومات الأدمن
          </Nav.Link>
          <Nav.Link
            onClick={() => setActiveComponent('students')}
            className={`text-white sidebar-link ${activeComponent === 'students' ? 'active' : ''}`}
          >
            إدارة الطلاب
          </Nav.Link>
          <Nav.Link
            onClick={() => setActiveComponent('courses')}
            className={`text-white sidebar-link ${activeComponent === 'courses' ? 'active' : ''}`}
          >
            إدارة المواد
          </Nav.Link>
          <Nav.Link
            onClick={() => setActiveComponent('grades')}
            className={`text-white sidebar-link ${activeComponent === 'grades' ? 'active' : ''}`}
          >
            إدارة العلامات
          </Nav.Link>
          <Nav.Link
            onClick={() => setActiveComponent('student-courses')}
            className={`text-white sidebar-link ${activeComponent === 'student-courses' ? 'active' : ''}`}
          >
            إضافة مواد للطالب
          </Nav.Link>
          <Nav.Link
            onClick={() => setActiveComponent('add-admin')}
            className={`text-white sidebar-link ${activeComponent === 'add-admin' ? 'active' : ''}`}
          >
            إضافة أدمن
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

export default AdminDashboard;
