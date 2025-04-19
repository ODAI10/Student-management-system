import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, ListGroup, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import Cookies from "js-cookie"; // ✅ استيراد js-cookie

// دالة لاستخراج الـ ID من التوكن
function getUserIdFromToken() {
  const token = Cookies.get("jwt_token"); // ✅ أخذ التوكن من الكوكيز
  if (!token) return null;

  try {
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    return decodedToken.id;
  } catch (error) {
    console.error("Failed to decode token", error);
    return null;
  }
}

function StudentProfile() {
  const [studentInfo, setStudentInfo] = useState(null);
  const userId = getUserIdFromToken(); // استخراج الـ ID من التوكن

  useEffect(() => {
    if (!userId) {
      console.error("User is not logged in");
      return;
    }

    axios
      .get(`http://localhost:5000/api/student/profile/${userId}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("jwt_token")}`, // ✅ استخدام التوكن من الكوكيز
        },
      })
      .then((response) => {
        setStudentInfo(response.data[0]);
        console.log("Data from API:", response.data);
      })
      .catch((error) => {
        console.error("Error fetching student profile data", error);
      });
  }, [userId]);

  if (!studentInfo) {
    return <div>Loading...</div>;
  }

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm h-100">
            <Card.Header
              style={{
                backgroundColor: "#2c3e50",
                color: "white",
                textAlign: "right",
              }}
            >
              معلومات الطالب
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item className="d-flex justify-content-between">
                  <strong>الاسم الكامل:</strong>
                  <span>{studentInfo.full_name}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between">
                  <strong>البريد الإلكتروني:</strong>
                  <span>{studentInfo.email}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between">
                  <strong>رقم الهاتف:</strong>
                  <span>{studentInfo.phone}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between">
                  <strong>العنوان:</strong>
                  <span>{studentInfo.address}</span>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default StudentProfile;
