import React, { useState, useEffect } from "react";
import { Card, Container, Row, Col, Table, Spinner } from "react-bootstrap";
import axios from "axios";
import Cookies from "js-cookie"; // ✅ استيراد js-cookie

function ViewGrades() {
  // استرجاع student_id من الكوكيز
  const student_id = Cookies.get("student_id");
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (student_id) {
      fetchGrades();
    } else {
      console.error("Student ID is not available");
    }
  }, [student_id]);

  const fetchGrades = () => {
    setLoading(true);
    const token = Cookies.get("jwt_token"); // ✅ جلب التوكن من الكوكيز
    if (!token) {
      console.error("JWT token is missing in cookies");
      setLoading(false);
      return;
    }

    axios
      .get(`http://localhost:5000/api/student/grades/${student_id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ استخدام التوكن من الكوكيز
        },
      })
      .then((response) => {
        setGrades(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching grades", error);
        setLoading(false);
      });
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={10}>
          <Card className="shadow-sm border-0">
            <Card.Header
              style={{
                backgroundColor: "#2c3e50",
                color: "white",
                textAlign: "right",
              }}
            >
              درجات الطالب
            </Card.Header>

            <Card.Body>
              {loading ? (
                <div className="text-center my-4">
                  <Spinner animation="border" variant="primary" />
                </div>
              ) : (
                <Table striped bordered hover className="mt-3">
                  <thead>
                    <tr>
                      <th>اسم المادة</th>
                      <th>درجة الامتحان النصفي</th>
                      <th>درجة الامتحان النهائي</th>
                      <th>الإجمالي</th>
                      <th>الحالة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {grades.length > 0 ? (
                      grades.map((grade) => (
                        <tr key={grade.id}>
                          <td>{grade.course_name}</td>
                          <td>{grade.midterm}</td>
                          <td>{grade.final}</td>
                          <td>{grade.total}</td>
                          <td>{grade.status}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center">
                          لا توجد درجات للطالب
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ViewGrades;
