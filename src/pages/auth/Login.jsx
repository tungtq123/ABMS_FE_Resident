import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { signIn } from "../../services/authApi";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Vui lòng nhập đầy đủ");
      return;
    }

    try {
      const data = await signIn(email, password);
      login(data);
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Sai email hoặc mật khẩu");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f8f9fa"
      }}
    >
      <Container>
        <div
          style={{
            width: "100%",
            maxWidth: "420px",
            margin: "auto",
            padding: "40px",
            borderRadius: "12px",
            background: "#fff",
            border: "1px solid #f1f1f1",
            boxShadow: "0 10px 35px rgba(0,0,0,0.08)"
          }}
        >
          {/* Title */}
          <div className="text-center mb-4">
            <h3 style={{ fontWeight: "600" }}>Đăng nhập</h3>
            <p style={{ fontSize: "14px", color: "#6c757d" }}>
              Vui lòng đăng nhập để tiếp tục
            </p>
          </div>

          <Form onSubmit={handleSubmit}>
            {/* Email */}
            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: "500" }}>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Nhập email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  padding: "10px",
                  borderRadius: "6px"
                }}
              />
            </Form.Group>

            {/* Password */}
            <Form.Group className="mb-4">
              <Form.Label style={{ fontWeight: "500" }}>Mật khẩu</Form.Label>
              <Form.Control
                type="password"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  padding: "10px",
                  borderRadius: "6px"
                }}
              />
            </Form.Group>

            {/* Button */}
            <Button
              type="submit"
              className="w-100"
              style={{
                padding: "10px",
                fontWeight: "500",
                borderRadius: "6px",
                backgroundColor: "#212529",
                borderColor: "#212529",
                transition: "all 0.2s"
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#000")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#212529")}
            >
              Đăng nhập
            </Button>

            {/* Register */}
            <div className="text-center mt-3">
              <small style={{ color: "#6c757d" }}>
                Bạn chưa có tài khoản?{" "}
                <Link
                  to="/register"
                  style={{
                    textDecoration: "none",
                    fontWeight: "500"
                  }}
                >
                  Đăng ký
                </Link>
              </small>
            </div>
          </Form>
        </div>
      </Container>
    </div>
  );
}

export default Login;