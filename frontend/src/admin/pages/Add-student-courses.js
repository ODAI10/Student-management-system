import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Container,
  Row,
  Col,
  Form,
  Spinner,
  Table,
} from "react-bootstrap";
import axios from "axios";

function AddStudentCourses() {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [studentCourses, setStudentCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    fetchCourses();
    fetchStudents();
    fetchStudentCourses();
  }, []);

  const fetchCourses = () => {
    axios
      .get("http://localhost:5000/api/admin/courses") // استبدل بالمسار الصحيح لجلب المواد
      .then((response) => {
        setCourses(response.data);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
      });
  };

  const fetchStudents = () => {
    axios
      .get("http://localhost:5000/api/admin/students") // استبدل بالمسار الصحيح لجلب الطلاب
      .then((response) => {
        setStudents(response.data);
      })
      .catch((error) => {
        console.error("Error fetching students:", error);
      });
  };

  const fetchStudentCourses = () => {
    setLoading(true);
    axios
      .get("http://localhost:5000/api/admin/student-course") // استبدل بالمسار الصحيح لجلب تسجيلات الطلاب
      .then((response) => {
        setStudentCourses(response.data);
        setLoading(false);
        
      })
      .catch((error) => {
        console.error("Error fetching student courses:", error);
        setLoading(false);
      });
  };

  const handleDelete = (studentId) => {
    axios
      .delete(`http://localhost:5000/api/admin/student-course/${studentId}`)
      .then((response) => {
        alert("تم حذف التسجيل بنجاح!");
        fetchStudentCourses();
      })
      .catch((error) => {
        console.error("Error deleting student course:", error);
        alert("حدث خطأ أثناء الحذف.");
      });
  };

  const handleAddOrUpdate = () => {
    if (!selectedStudentId || !selectedCourseId) {
      alert("يرجى اختيار الطالب والمادة");
      return;
    }

    const data = {
      student_id: selectedStudentId,
      course_id: selectedCourseId,
    };

    if (selectedId) {
      // تعديل التسجيل
      axios
        .put(`/api/student-courses/${selectedId}`, data)
        .then((response) => {
          alert("تم تعديل التسجيل بنجاح!");
          fetchStudentCourses();
          resetForm();
        })
        .catch((error) => {
          console.error("Error updating student course:", error);
        });
    } else {
      // إضافة تسجيل جديد
      axios
        .post("http://localhost:5000/api/admin/student-course", data)
        .then((response) => {
          alert("تم إضافة الطالب إلى المادة بنجاح!");
          fetchStudentCourses();
          resetForm();
        })
        .catch((error) => {
          console.error("Error adding student course:", error);
        });
    }
  };

  const resetForm = () => {
    setSelectedStudentId("");
    setSelectedCourseId("");
    setSelectedId(null);
  };

  const handleEdit = (item) => {
    setSelectedId(item.id);
    setSelectedStudentId(item.student_id);
    setSelectedCourseId(item.course_id);
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={10}>
          <Card className="shadow-sm border-0">
            <Card.Header
              className="text-white p-3"
              style={{ backgroundColor: "#2c3e50" }}
            >
              <h5 className="fw-bold m-0 mx-2" style={{ textAlign: "right" }}>
                {selectedId ? "تعديل تسجيل" : "إضافة مادة إلى  طالب  "}
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
                        disabled={selectedId}
                      >
                        <option value="">اختر الطالب</option>
                        {students.map((student) => (
                          <option key={student.id} value={student.id}>
                            {student.full_name}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>

                    <Form.Group className="mt-3">
                      <Form.Label>اختر المادة</Form.Label>
                      <Form.Control
                        as="select"
                        value={selectedCourseId}
                        onChange={(e) => setSelectedCourseId(e.target.value)}
                        disabled={selectedId}
                      >
                        <option value="">اختر المادة</option>
                        {courses.map((course) => (
                          <option key={course.id} value={course.id}>
                            {course.name}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>

                    <Button
                      variant="success"
                      onClick={handleAddOrUpdate}
                      className="mt-3"
                    >
                      {selectedId ? "تعديل تسجيل" : "إضافة"}
                    </Button>
                  </Form>

                  <h6 className="mt-4">جميع التسجيلات</h6>
                  <Table striped bordered hover className="mt-3">
                    <thead>
                      <tr>
                        <th>اسم الطالب</th>
                        <th>اسم المادة</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentCourses.length > 0 ? (
                        studentCourses.map((item) => (
                          <tr key={item.id}>
                            <td>{item.student_name}</td>
                            <td>{item.course_name}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" className="text-center">
                            لا توجد بيانات
                          </td>
                        </tr>
                      )}
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

export default AddStudentCourses;
