import React, { useState } from 'react';
import { Button, Form, Card, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function AddAdmin() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const adminData = {
      full_name: fullName,
      email,
      password,
      phone,
      address,
    };

    axios
      .post('http://localhost:5000/api/admin/add-admin', adminData)
      .then((response) => {
        setSuccessMessage('تم إضافة الإداري بنجاح');
        setError('');
        // يمكن إعادة التوجيه إلى صفحة أخرى أو إعادة تحميل البيانات
      })
      .catch((error) => {
        if (error.response && error.response.data && error.response.data.message) {
          setError(error.response.data.message); // رسالة مخصصة من الباك اند
        } else {
          setError('فشل في إضافة الإداري، تأكد من صحة البيانات.');
        }
        setSuccessMessage('');
      });
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Row className="justify-content-center w-100">
        <Col md={6} sm={12}>
          <Card className="shadow-lg">
            <Card.Body>
              <Card.Title className="text-center mb-4">إضافة ادمن</Card.Title>
              {error && <div className="alert alert-danger">{error}</div>}
              {successMessage && <div className="alert alert-success">{successMessage}</div>}
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formFullName" className="mb-3">
                  <Form.Label>الاسم الكامل</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="أدخل الاسم الكامل"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formEmail" className="mb-3">
                  <Form.Label>البريد الإلكتروني</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="أدخل البريد الإلكتروني"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formPassword" className="mb-3">
                  <Form.Label>كلمة المرور</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="أدخل كلمة المرور"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formPhone" className="mb-3">
                  <Form.Label>رقم الهاتف</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="أدخل رقم الهاتف"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formAddress" className="mb-3">
                  <Form.Label>العنوان</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="أدخل العنوان"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button variant="primary" type="submit" block>
                  إضافة الإداري
                </Button>
              </Form>
            </Card.Body>
           
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default AddAdmin;
