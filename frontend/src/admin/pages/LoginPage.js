import React, { useState } from 'react';
import { Button, Form, Card, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';


// استيراد ملف CSS الخاص بـ Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const loginData = { email, password };

    axios.post('http://localhost:5000/api/auth/login', loginData)
      .then((response) => {
        const { token, student_id, role } = response.data; 

        Cookies.set('jwt_token', token, { expires: 7, path: '/' }); // expires: 7 يعني الكوكي سيظل لمدة 7 أيام
        Cookies.set('student_id', student_id, { expires: 7, path: '/' });
        Cookies.set('role', role, { expires: 7, path: '/' });
        

        // التوجيه إلى لوحة التحكم بعد تسجيل الدخول بنجاح
        if (role === "admin") {
            navigate(`/admin-dashboard`);
        } else if (role === "student") {
            navigate(`/student-dashboard`);
        }
      })
      .catch((error) => {
        setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
        console.log(error);
      });
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Row className="justify-content-center w-100">
        <Col md={6} sm={12}>
          <Card className="shadow-lg">
            <Card.Body>
              <Card.Title className="text-center mb-4">تسجيل الدخول</Card.Title>
              {error && <div className="alert alert-danger">{error}</div>}
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formEmail" className="mb-3">
                  <Form.Label>البريد الإلكتروني</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="أدخل بريدك الإلكتروني"
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

                <Button variant="primary" type="submit" block>
                  تسجيل الدخول
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginPage;
