import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Container,
  Row,
  Col,
  Form,
  Spinner,
  Modal,
} from "react-bootstrap";
import axios from "axios";
import Cookies from "js-cookie";

function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [newStudent, setNewStudent] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
    status: "نشط",
    password: "",
  });

  // رسائل الإضافة
  const [addMessage, setAddMessage] = useState("");
  const [addMessageType, setAddMessageType] = useState("");

  // رسائل التعديل
  const [updateMessage, setUpdateMessage] = useState("");
  const [updateMessageType, setUpdateMessageType] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = () => {
    axios
      .get("http://localhost:5000/api/admin/students", {
        headers: {
          Authorization: `Bearer ${Cookies.get("jwt_token")}`,
        },
      })
      .then((response) => {
        setStudents(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching students", error);
        setLoading(false);
      });
  };

  const handleEditClick = (student) => {
    setSelectedStudent(student);
    setUpdateMessage("");
    setUpdateMessageType("");
    setShowModal(true);
  };

  const handleDelete = () => {
    const confirmDelete = window.confirm("هل أنت متأكد أنك تريد حذف هذا الطالب؟");
    if (!confirmDelete) return;
  
    axios
      .delete(`http://localhost:5000/api/admin/student/${selectedStudent.id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("jwt_token")}`,
        },
      })
      .then(() => {
        setShowConfirmation(true);
        setTimeout(() => {
          setShowModal(false);
          fetchStudents();
          setShowConfirmation(false);
        }, 2000);
      })
      .catch((error) => console.error("Error deleting student", error));
  };
  

  const handleSaveChanges = () => {
    axios
      .put(`http://localhost:5000/api/admin/student/${selectedStudent.id}`, {
        full_name: selectedStudent.full_name,
        email: selectedStudent.email,
        phone: selectedStudent.phone,
        address: selectedStudent.address,
        status: selectedStudent.status === "نشط" ? "active" : "suspended",
        
      },{
        withCredentials: true

      })
      .then((res) => {
        setUpdateMessage(res.data.message || "تم التحديث بنجاح");
        setUpdateMessageType("success");
        fetchStudents();
      })
      .catch((error) => {
        const msg =
          error.response?.data?.message || "حدث خطأ أثناء التحديث";
        setUpdateMessage(msg);
        setUpdateMessageType("error");
      });
  };

  const handleAddStudent = () => {
    axios
    .post(
      "http://localhost:5000/api/admin/add-student",
      {
        full_name: newStudent.full_name,
        email: newStudent.email,
        phone: newStudent.phone,
        address: newStudent.address,
        status: newStudent.status === "نشط" ? "active" : "suspended",
        password: newStudent.password,
      },
      {
        withCredentials: true, // ✅ هذا هو المفتاح المهم
      }
    )
    .then((res) => {
      setAddMessage(res.data.message || "تمت الإضافة بنجاح");
      setAddMessageType("success");
      fetchStudents();
      setNewStudent({
        full_name: "",
        email: "",
        phone: "",
        address: "",
        status: "نشط",
        password: "",
      });
    })
    .catch((error) => {
      const msg =
        error.response?.data?.message || "حدث خطأ أثناء الإضافة";
      setAddMessage(msg);
      setAddMessageType("error");
    });
  
  };

  const filteredStudents = students.filter((student) =>
    [student.full_name, student.email, student.phone, student.address]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={10}>
          <Card className="shadow-sm border-0">
            <Card.Header
              style={{ backgroundColor: "#2c3e50" }}
              className="text-white d-flex justify-content-between align-items-center p-3"
            >
              <Button variant="success" onClick={() => {
                setAddMessage("");
                setAddMessageType("");
                setShowAddModal(true);
              }}>
                + إضافة طالب
              </Button>
              <Form.Control
                type="text"
                placeholder="🔍 بحث عن طالب..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-50"
              />
              <h5 className="fw-bold m-0">إدارة الطلاب</h5>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <div className="text-center my-4">
                  <Spinner animation="border" variant="primary" />
                </div>
              ) : filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <Card key={student.id} className="mb-3 p-3 shadow-sm border-0">
                    <Row className="align-items-center">
                      <Col md={2}>
                        <h6 className="fw-bold">{student.full_name}</h6>
                      </Col>
                      <Col md={3}>
                        <p className="mb-1 text-muted">📧 {student.email}</p>
                      </Col>
                      <Col md={2}>
                        <p className="mb-1">📞 {student.phone}</p>
                      </Col>
                      <Col md={3} >
                        <p className="mb-1">
                          <i className="bi bi-geo-alt-fill text-success"></i>{" "}
                          {student.address}
                        </p>
                      </Col>
                      <Col md={1}>
                        <p
                          className={`badge bg-${
                            student.status === "نشط" ? "success" : "danger mb-1 py-2" 
                          }`}
                        >
                          {student.status}
                        </p>
                      </Col>
                      <Col md={1} className="text-end">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleEditClick(student)}
                        >
                          تعديل
                        </Button>
                      </Col>
                    </Row>
                  </Card>
                ))
              ) : (
                <p className="text-center text-muted">لا يوجد طلاب متاحين</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* تعديل الطالب */}
      {selectedStudent && (
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>تعديل بيانات الطالب</Modal.Title>
          </Modal.Header>
          {updateMessage && (
            <div className="d-flex justify-content-center my-3">
              <div
                className={`px-4 py-2 rounded  d-flex align-items-center gap-2 ${
                  updateMessageType === "error" ? "text-danger" : "text-success"
                }`}
                style={{
                  backgroundColor: "#fff",
                  fontWeight: "500",
                  fontSize: "16px",
                }}
              >
                <span>{updateMessageType === "error" ? "❌" : "✅"}</span>
                <span>{updateMessage}</span>
              </div>
            </div>
          )}
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>الاسم الكامل</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedStudent.full_name}
                  onChange={(e) =>
                    setSelectedStudent({
                      ...selectedStudent,
                      full_name: e.target.value,
                    })
                  }
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>البريد الإلكتروني</Form.Label>
                <Form.Control
                  type="email"
                  value={selectedStudent.email}
                  onChange={(e) =>
                    setSelectedStudent({
                      ...selectedStudent,
                      email: e.target.value,
                    })
                  }
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>رقم الهاتف</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedStudent.phone}
                  onChange={(e) =>
                    setSelectedStudent({
                      ...selectedStudent,
                      phone: e.target.value,
                    })
                  }
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>العنوان</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedStudent.address}
                  onChange={(e) =>
                    setSelectedStudent({
                      ...selectedStudent,
                      address: e.target.value,
                    })
                  }
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>الحالة</Form.Label>
                <Form.Select
                  value={selectedStudent.status}
                  onChange={(e) =>
                    setSelectedStudent({
                      ...selectedStudent,
                      status: e.target.value,
                    })
                  }
                >
                  <option value="نشط">نشط</option>
                  <option value="غير نشط">غير نشط</option>
                </Form.Select>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={handleDelete}>
              ❌ حذف الطالب
            </Button>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              🔙 رجوع
            </Button>
            <Button variant="success" onClick={handleSaveChanges}>
              ✅ تأكيد
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* إضافة طالب */}
      {showAddModal && (
        <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>إضافة طالب جديد</Modal.Title>
          </Modal.Header>
          {addMessage && (
            <div className="d-flex justify-content-center my-3">
              <div
                className={`px-4 py-2 rounded  d-flex align-items-center gap-2 ${
                  addMessageType === "error" ? "text-danger" : "text-success"
                }`}
                style={{
                  backgroundColor: "#fff",
                  fontWeight: "500",
                  fontSize: "16px",
                }}
              >
                <span>{addMessageType === "error" ? "❌" : "✅"}</span>
                <span>{addMessage}</span>
              </div>
            </div>
          )}
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>الاسم الكامل</Form.Label>
                <Form.Control
                  type="text"
                  value={newStudent.full_name}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, full_name: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>البريد الإلكتروني</Form.Label>
                <Form.Control
                  type="email"
                  value={newStudent.email}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, email: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>رقم الهاتف</Form.Label>
                <Form.Control
                  type="text"
                  value={newStudent.phone}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, phone: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>العنوان</Form.Label>
                <Form.Control
                  type="text"
                  value={newStudent.address}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, address: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>الحالة</Form.Label>
                <Form.Select
                  value={newStudent.status}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, status: e.target.value })
                  }
                >
                  <option value="نشط">نشط</option>
                  <option value="غير نشط">غير نشط</option>
                </Form.Select>
              </Form.Group>
              <Form.Group>
                <Form.Label>كلمة السر</Form.Label>
                <Form.Control
                  type="password"
                  value={newStudent.password}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, password: e.target.value })
                  }
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              🔙 رجوع
            </Button>
            <Button variant="success" onClick={handleAddStudent}>
              ✅ إضافة الطالب
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
}

export default ManageStudents;
