import React, { useState, useEffect } from 'react';
import { Card, Container, Row, Col, Spinner } from 'react-bootstrap';
import axios from 'axios';
import Cookies from 'js-cookie'; // ✅ استيراد js-cookie

function ViewStudentCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentCourses();
  }, []);

  const fetchStudentCourses = () => {
    const studentId = Cookies.get('student_id'); // ✅ جلب student_id من الكوكيز
    const token = Cookies.get('jwt_token'); // ✅ جلب التوكن من الكوكيز

    if (!studentId || !token) {
      console.error('Student ID or token not found in cookies');
      setLoading(false);
      return;
    }

    axios
      .get(`http://localhost:5000/api/student/courses-student/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` }, // ✅ استخدام التوكن من الكوكيز
      })
      .then((response) => {
        setCourses(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching student courses', error);
        setLoading(false);
      });
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={10}>
          <Card className="shadow-sm border-0">
            <Card.Header style={{ backgroundColor: "#2c3e50", textAlign: 'right' }} className="text-white">
              مواد الطالب
            </Card.Header>

            <Card.Body>
              {loading ? (
                <div className="text-center my-4">
                  <Spinner animation="border" variant="primary" />
                </div>
              ) : courses.length > 0 ? (
                courses.map((course) => (
                  <Card key={course.id} className="mb-3 p-3 px-3 shadow-sm border-0">
                    <Row className="align-items-center">
                      <Col md={5}>
                        <h6 className="fw-bold">{course.name}</h6>
                      </Col>
                      <Col md={4}>
                        <p className="mb-1">{course.department}</p>
                      </Col>
                      <Col md={3}>
                        <p className="mb-1">{course.credits} ساعات</p>
                      </Col>
                    </Row>
                  </Card>
                ))
              ) : (
                <p className="text-center text-muted">لا توجد دورات للطالب</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ViewStudentCourses;
