import React, { useState, useEffect } from 'react';
import { Card, Button, Container, Row, Col, Form, Spinner, Table } from 'react-bootstrap';
import axios from 'axios';
import Cookies from 'js-cookie';

function ManageGrades() {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [midterm, setMidterm] = useState('');
  const [final, setFinal] = useState('');
  const [selectedGradeId, setSelectedGradeId] = useState(null); // لتخزين معرف الدرجة المحددة للتعديل

  useEffect(() => {
    fetchCourses();
    fetchStudents();
    fetchGrades(); // جلب جميع العلامات عند تحميل الصفحة
  }, []);

  const fetchCourses = () => {
    axios.get('http://localhost:5000/api/admin/courses', {
      headers: { Authorization: `Bearer ${Cookies.get('jwt_token')}` },
    })
    .then((response) => setCourses(response.data))
    .catch((error) => console.error('Error fetching courses', error));
  };

  const fetchStudents = () => {
    axios.get('http://localhost:5000/api/admin/students', {
      headers: { Authorization: `Bearer ${Cookies.get('jwt_token')}` },
    })
    .then((response) => setStudents(response.data))
    .catch((error) => console.error('Error fetching students', error));
  };

  const fetchGrades = () => {
    setLoading(true);
    axios.get('http://localhost:5000/api/admin/grades', {
      headers: { Authorization: `Bearer ${Cookies.get('jwt_token')}` },
    })
    .then((response) => {
      setGrades(response.data);
      setLoading(false);
    })
    .catch((error) => {
      console.error('Error fetching grades', error);
      setLoading(false);
    });
  };
  const handleAddOrUpdateGrade = () => {
    if (!midterm || !final) {
      alert('يرجى ملء جميع الحقول');
      return;
    }
  
    if (parseInt(midterm) > 50 || parseInt(final) > 50) {
      alert('الرجاء إدخال درجة 50 أو أقل');
      return;
    }
  
    const gradeData = {
      student_id: selectedStudentId,
      course_id: selectedCourseId,
      midterm,
      final,
      total: parseInt(midterm) + parseInt(final),
      status: parseInt(midterm) + parseInt(final) >= 50 ? 'Pass' : 'Fail',
    };
  
    if (selectedGradeId) {
      axios.put(`http://localhost:5000/api/admin/grade/${selectedGradeId}`, gradeData, {
        headers: { Authorization: `Bearer ${Cookies.get('jwt_token')}` },
      })
      .then(() => {
        fetchGrades();
        resetForm();
      })
      .catch((error) => console.error('Error updating grade', error));
    } else {
      axios.post('http://localhost:5000/api/admin/grade', gradeData, {
        headers: { Authorization: `Bearer ${Cookies.get('jwt_token')}` },
      })
      .then(() => {
        fetchGrades();
        resetForm();
      })
      .catch((error) => console.error('Error adding grade', error));
    }
  };
  
  const resetForm = () => {
    setMidterm('');
    setFinal('');
    setSelectedStudentId('');
    setSelectedCourseId('');
    setSelectedGradeId(null); // إعادة تعيين ID الدرجة المحددة
  };

  const handleEditGrade = (grade) => {
    setSelectedGradeId(grade.id);
    setSelectedStudentId(grade.student_id);
    setSelectedCourseId(grade.course_id);
    setMidterm(grade.midterm);
    setFinal(grade.final);
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={10}>
          <Card className="shadow-sm border-0">
          <Card.Header style={{ backgroundColor: "#2c3e50" }} className="text-white d-flex justify-content-between align-items-center p-3">
  <h5 className="fw-bold m-0 mx-2" style={{ textAlign: 'right', flex: 1 }}>
    {selectedGradeId ? 'تعديل درجة' : 'إضافة درجة جديدة'}
  </h5>
</Card.Header>


            <Card.Body>
              {loading ? (
                <div className="text-center my-4">
                  <Spinner animation="border" variant="primary" />
                </div>
              ) : (
                <>
                  <Form>
                    <Form.Group>
                      <Form.Label>اختر الطالب</Form.Label>
                      <Form.Control
                        as="select"
                        value={selectedStudentId}
                        onChange={(e) => setSelectedStudentId(e.target.value)}
                        disabled={selectedGradeId} // تعطيل الاختيار إذا كان في وضع التعديل
                      >
                        <option value="">اختر الطالب</option>
                        {students.length > 0 ? (
                          students.map((student) => (
                            <option key={student.id} value={student.id}>
                              {student.full_name}
                            </option>
                          ))
                        ) : (
                          <option>لا يوجد طلاب</option>
                        )}
                      </Form.Control>
                    </Form.Group>

                    <Form.Group className="mt-3">
                      <Form.Label>اختر المادة</Form.Label>
                      <Form.Control
                        as="select"
                        value={selectedCourseId}
                        onChange={(e) => setSelectedCourseId(e.target.value)}
                        disabled={selectedGradeId} // تعطيل الاختيار إذا كان في وضع التعديل
                      >
                        <option value="">اختر المادة</option>
                        {courses.map((course) => (
                          <option key={course.id} value={course.id}>
                            {course.name}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>

                    <Form.Group className="mt-3">
                      <Form.Label>درجة الامتحان النصفي</Form.Label>
                      <Form.Control
                        type="number"
                        value={midterm}
                        onChange={(e) => setMidterm(e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group className="mt-3">
                      <Form.Label>درجة الامتحان النهائي</Form.Label>
                      <Form.Control
                        type="number"
                        value={final}
                        onChange={(e) => setFinal(e.target.value)}
                      />
                    </Form.Group>

                    <Button variant="success" onClick={handleAddOrUpdateGrade} className="mt-3">
                      {selectedGradeId ? 'تعديل درجة' : 'إضافة درجة'}
                    </Button>
                  </Form>

                  <h6 className="mt-4">جميع الدرجات</h6>
                  <Table striped bordered hover className="mt-3">
                    <thead>
                      <tr>
                        <th>اسم الطالب</th>
                        <th>اسم المادة</th>
                        <th>درجة الامتحان النصفي</th>
                        <th>درجة الامتحان النهائي</th>
                        <th>الإجمالي</th>
                        <th>الحالة</th>
                        <th>تعديل</th> {/* إضافة عمود التعديل */}
                      </tr>
                    </thead>
                    <tbody>
                      {grades.map((grade) => (
                        <tr key={grade.id}>
                          <td>{grade.student_name}</td>
                          <td>{grade.course_name}</td>
                          <td>{grade.midterm}</td>
                          <td>{grade.final}</td>
                          <td>{grade.total}</td>
                          <td>{grade.status}</td>
                          <td>
                            <Button
                              variant="info"
                              onClick={() => handleEditGrade(grade)} // تعيين البيانات في حالة التعديل
                            >
                              تعديل
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ManageGrades;
