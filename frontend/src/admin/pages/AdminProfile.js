import React, { useState, useEffect } from "react";
import { Card, ListGroup, Button, Container, Row, Col, Form } from "react-bootstrap";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaSave, FaEdit, FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import Cookies from 'js-cookie';

function AdminProfile() {
  const [userInfo, setUserInfo] = useState(null);
  const [updatedInfo, setUpdatedInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); 
  useEffect(() => {
    axios
    .get("http://localhost:5000/api/admin/profile", {
      headers: {
        Authorization: `Bearer ${Cookies.get('jwt_token')}`,
      },
      })
      .then((response) => {
        setUserInfo(response.data);
        setUpdatedInfo(response.data);
      })
      .catch((error) => {
        console.error("Error fetching profile data", error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedInfo({
      ...updatedInfo,
      [name]: value,
    });
  };

  const handleSave = () => {
    axios
      .put("http://localhost:5000/api/admin/profile", updatedInfo, {
        headers: {
          Authorization: `Bearer ${Cookies.get("jwt_token")}`,
        },
      })
      .then((response) => {
        setUserInfo(updatedInfo);
        setIsEditing(false);
        setMessage(response.data.message );
        setMessageType("success");
      })
      .catch((error) => {
        const errMsg =
          error.response?.data?.message || "حدث خطأ أثناء تحديث البيانات";
        setMessage(errMsg);
        setMessageType("error");
      });
  };
  

  const backToProfilePage = () => {
    setIsEditing(false);
  };

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-lg border-0">
            {/* تعديل لون خلفية header */}
            <Card.Header className="text-white text-center" style={{ backgroundColor: "#2c3e50" }}>
              {isEditing ? "تعديل تفاصيل الحساب" : "تفاصيل الحساب"}
            </Card.Header>
            {message && messageType === "error" && (
  <div className="d-flex justify-content-center my-3">
    <div
      className="px-4 py-2 rounded  d-flex align-items-center gap-2 text-danger"
      style={{
        backgroundColor: "#fff",
        fontWeight: "500",
        fontSize: "16px",
      }}
    >
      <span>❌</span>
      <span>{message}</span>
    </div>
  </div>
)}



            <Card.Body style={{  color: "white" }}>
              {isEditing ? (
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>الاسم الكامل</Form.Label>
                    <Form.Control
                      type="text"
                      name="full_name"
                      value={updatedInfo.full_name}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>البريد الإلكتروني</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={updatedInfo.email}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>رقم الهاتف</Form.Label>
                    <Form.Control
                      type="text"
                      name="phone"
                      value={updatedInfo.phone}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>العنوان</Form.Label>
                    <Form.Control
                      type="text"
                      name="address"
                      value={updatedInfo.address}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <div className="d-flex gap-3 justify-content-center">
                    <Button variant="success" onClick={handleSave}>
                      <FaSave className="me-2" /> تأكيد
                    </Button>
                    <Button variant="secondary" onClick={backToProfilePage}>
                      <FaArrowLeft className="me-2" /> رجوع
                    </Button>
                  </div>
                </Form>
              ) : (
                <ListGroup variant="flush">
                  <ListGroup.Item className="d-flex justify-content-between">
                    <strong><FaUser className="me-2" /> الاسم الكامل:</strong>
                    <span>{userInfo.full_name}</span>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between">
                    <strong><FaEnvelope className="me-2" /> البريد الإلكتروني:</strong>
                    <span>{userInfo.email}</span>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between">
                    <strong><FaPhone className="me-2" /> رقم الهاتف:</strong>
                    <span>{userInfo.phone}</span>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between">
                    <strong><FaMapMarkerAlt className="me-2" /> العنوان:</strong>
                    <span>{userInfo.address}</span>
                  </ListGroup.Item>
                </ListGroup>
              )}
            </Card.Body>

            {!isEditing && (
              <Card.Footer className="text-center">
                <Button 
                  variant="outline-primary" 
                  onClick={() => setIsEditing(true)} 
                  style={{ backgroundColor: "#2c3e50", color: "white", borderColor: "#2c3e50" }}>
                  <FaEdit className="me-2" /> تعديل الملف الشخصي
                </Button>
              </Card.Footer>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default AdminProfile;
