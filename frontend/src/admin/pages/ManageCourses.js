import React, { useState, useEffect } from 'react';
import { Card, Button, Container, Row, Col, Form, Spinner } from 'react-bootstrap';
import axios from 'axios';
import Cookies from 'js-cookie';

function ManageCourses() {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [editedCourse, setEditedCourse] = useState({});
  const [newCourse, setNewCourse] = useState({ name: '', department: '', credits: '' });
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = () => {
    axios
    .get('http://localhost:5000/api/admin/courses', {
      headers: { Authorization: `Bearer ${Cookies.get('jwt_token')}` },
    })
      .then((response) => {
        setCourses(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching courses', error);
        setLoading(false);
      });
  };

  const handleEditClick = (course) => {
    setEditingCourseId(course.id);
    setEditedCourse({ ...course });
  };

  const handleSaveEdit = () => {
    axios
  .put(`http://localhost:5000/api/admin/course/${editedCourse.id}`, editedCourse, {
    headers: { Authorization: `Bearer ${Cookies.get('jwt_token')}` },
  })
      .then(() => {
        fetchCourses();
        setEditingCourseId(null);
      })
      .catch((error) => console.error('Error updating course', error));
  };

  const handleDeleteCourse = (id) => {
    axios
    .delete(`http://localhost:5000/api/admin/course/${id}`, {
      headers: { Authorization: `Bearer ${Cookies.get('jwt_token')}` },
    })
      .then(() => fetchCourses())
      .catch((error) => console.error('Error deleting course', error));
  };

  const handleAddCourse = () => {
    axios
      .post(
        'http://localhost:5000/api/admin/course',
        {
          name: newCourse.name,
          department: newCourse.department,
          credits: Number(newCourse.credits),
        },
        {
          headers: { Authorization: `Bearer ${Cookies.get('jwt_token')}` },

        }
      )
      .then(() => {
        fetchCourses();
        setNewCourse({ name: '', department: '', credits: '' });
        setShowAddForm(false);
      })
      .catch((error) => console.error('Error adding course', error));
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={10}>
          <Card className="shadow-lg border-0">
            {/* Header with improved layout */}
            <Card.Header className="text-white d-flex justify-content-between align-items-center p-3" style={{ backgroundColor: "#2c3e50" }}>
  <div className="d-flex gap-3" style={{ flex: 2, justifyContent: 'flex-start' }}>
    <Button
      variant="success"
      onClick={() => setShowAddForm(true)}
      style={{
        backgroundColor: "#27ae60",
        borderColor: "#27ae60",
        color: "white",
        padding: '8px 15px'
      }}
    >
       إضافة مادة
    </Button>
  </div>
  <Form.Control
    type="text"
    placeholder="🔍 بحث عن مادة..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    style={{ maxWidth: '500px', margin: '0 auto' }}
  />
  <h5 className="fw-bold m-0" style={{ flex: 1, textAlign: 'right' }}>إدارة المواد</h5>
</Card.Header>


            <Card.Body style={{ backgroundColor: "#f4f6f7" }}>
              {/* Add Course Form */}
              {showAddForm && (
                <Card className="mb-3 p-3 shadow-sm border-0 bg-light">
                  <Row className="align-items-center">
                    <Col md={3}>
                      <Form.Control
                        type="text"
                        placeholder="اسم المادة"
                        value={newCourse.name}
                        onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                      />
                    </Col>
                    <Col md={3}>
                      <Form.Control
                        type="text"
                        placeholder="القسم"
                        value={newCourse.department}
                        onChange={(e) => setNewCourse({ ...newCourse, department: e.target.value })}
                      />
                    </Col>
                    <Col md={2}>
                      <Form.Control
                        type="number"
                        placeholder="الساعات"
                        value={newCourse.credits}
                        onChange={(e) => setNewCourse({ ...newCourse, credits: Number(e.target.value) })}
                      />
                    </Col>
                    <Col md={4} className="d-flex gap-2">
                      <Button
                        variant="success"
                        onClick={handleAddCourse}
                        style={{ backgroundColor: "#2c3e50", borderColor: "#2c3e50" }}
                      >
                        ✅ حفظ
                      </Button>
                      <Button variant="secondary" onClick={() => setShowAddForm(false)}>
                        ❌ إلغاء
                      </Button>
                    </Col>
                  </Row>
                </Card>
              )}

              {/* Courses List */}
              {loading ? (
                <div className="text-center my-4">
                  <Spinner animation="border" variant="primary" />
                </div>
              ) : courses.length > 0 ? (
                courses
                  .filter((course) =>
                    course.name.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((course) => (
                    <Card key={course.id} className="mb-3 p-3 shadow-sm border-0">
                      <Row className="align-items-center">
                        {editingCourseId === course.id ? (
                          <>
                            <Col md={3}>
                              <Form.Control
                                type="text"
                                value={editedCourse.name}
                                onChange={(e) => setEditedCourse({ ...editedCourse, name: e.target.value })}
                              />
                            </Col>
                            <Col md={3}>
                              <Form.Control
                                type="text"
                                value={editedCourse.department}
                                onChange={(e) => setEditedCourse({ ...editedCourse, department: e.target.value })}
                              />
                            </Col>
                            <Col md={2}>
                              <Form.Control
                                type="number"
                                value={editedCourse.credits}
                                onChange={(e) => setEditedCourse({ ...editedCourse, credits: Number(e.target.value) })}
                              />
                            </Col>
                            <Col md={4} className="d-flex gap-2">
                              <Button
                                variant="success"
                                onClick={handleSaveEdit}
                                style={{ backgroundColor: "#2c3e50", borderColor: "#2c3e50" }}
                              >
                                ✅ حفظ
                              </Button>
                              <Button
                                variant="secondary"
                                onClick={() => setEditingCourseId(null)}
                                style={{ backgroundColor: "#2c3e50", borderColor: "#2c3e50" }}
                              >
                                🔙 إلغاء
                              </Button>
                              <Button variant="danger" onClick={() => handleDeleteCourse(course.id)}>
                                🗑️ حذف
                              </Button>
                            </Col>
                          </>
                        ) : (
                          <>
                            <Col md={3}>
                              <h6 className="fw-bold">{course.name}</h6>
                            </Col>
                            <Col md={3}>
                              <p className="mb-1">{course.department}</p>
                            </Col>
                            <Col md={2}>
                              <p className="mb-1">{course.credits} ساعات</p>
                            </Col>
                            <Col md={4} className="d-flex gap-2">
                              <Button
                                className='btn btn-info '
                                onClick={() => handleEditClick(course)}
                              >
                                ✏️ تعديل
                              </Button>
                            </Col>
                          </>
                        )}
                      </Row>
                    </Card>
                  ))
              ) : (
                <p className="text-center text-muted">لا يوجد مواد متاحة</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ManageCourses;
