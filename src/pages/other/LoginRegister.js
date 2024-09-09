import React, { Fragment, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Tab, Nav } from "react-bootstrap";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { API_BASE_URL } from "../../utils";
import { toast } from "react-toastify";
import { setUserCookie } from "../../helpers/cookies";
import Loader from "../../components/loader";
import { useAuth } from "../../context/Auth";

const LoginRegister = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate(); // Hook to navigate programmatically
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [activeKey, setActiveKey] = useState("login");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { onLogin } = useAuth();

  useEffect(() => {
    setActiveKey(activeKey);
  }, [activeKey]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = {
        email,
        password,
      };
      const res = await fetch(API_BASE_URL + "/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (res.status === 200 || res.status === 201) {
        const userData = await res.json();
        const { token, role } = userData;
        setUserCookie(token, role);
        const storedUrl = localStorage.getItem("storedUrl");
        toast.success("Login successful");
        onLogin(token);
        if (storedUrl) navigate(storedUrl);
        else navigate("/shop-grid-standard");
      } else {
        const errorData = await res.json();
        if (res.status === 401) {
          throw new Error("Invalid email or password, please try again.");
        } else
          throw new Error(
            errorData.message || "Login failed. Please try again."
          );
      }
    } catch (error) {
      setError(error.message);
      console.error("Error logging in:", error);
      toast.error(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = {
        email,
        password,
        firstName,
        lastName,
      };
      const res = await fetch(API_BASE_URL + "/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (res.status === 200 || res.status === 201) {
        setLoading(false);
        setActiveKey("login");
        toast.success("Registration successful, please login.");
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message);
      }
    } catch (error) {
      setError(error.message);
      console.error("Error registering user:", error);
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <SEO
        titleTemplate="Login"
        description="Login page of flone react minimalist eCommerce template."
      />
      <LayoutOne headerTop="visible">
        <Breadcrumb
          pages={[
            { label: "Home", path: process.env.PUBLIC_URL + "/" },
            {
              label: "Login Register",
              path: process.env.PUBLIC_URL + pathname,
            },
          ]}
        />
        <div className="login-register-area pt-100 pb-100">
          <div className="container">
            <div className="row">
              <div className="col-lg-7 col-md-12 ms-auto me-auto">
                <div className="login-register-wrapper">
                  <Tab.Container
                    activeKey={activeKey}
                    onSelect={(k) => setActiveKey(k)}
                  >
                    <Nav variant="pills" className="login-register-tab-list">
                      <Nav.Item>
                        <Nav.Link eventKey="login" disabled={loading}>
                          <h4>Login</h4>
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="register" disabled={loading}>
                          <h4>Register</h4>
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                    <Tab.Content>
                      <Tab.Pane eventKey="login">
                        <div className="login-form-container">
                          <div className="login-register-form">
                            <form onSubmit={handleLogin}>
                              <input
                                type="email"
                                name="user-email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                              />
                              <input
                                type={showPassword ? "text" : "password"}
                                name="user-password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                              />
                              {error && <p style={{ color: "red" }}>{error}</p>}
                              <div className="button-box">
                                <div className="login-toggle-btn">
                                  <input
                                    type="checkbox"
                                    onChange={() =>
                                      setShowPassword(!showPassword)
                                    }
                                    id="show-password"
                                  />
                                  <label
                                    className="ml-10 "
                                    style={{
                                      cursor: "pointer",
                                      userSelect: "none",
                                    }}
                                    htmlFor="show-password"
                                  >
                                    Show Password
                                  </label>
                                  <Link
                                    to={
                                      process.env.PUBLIC_URL +
                                      "/forgot-password"
                                    }
                                  >
                                    Forgot Password?
                                  </Link>
                                </div>
                                <button type="submit" disabled={loading}>
                                  {loading ? <Loader /> : <span>Login</span>}
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </Tab.Pane>
                      <Tab.Pane eventKey="register">
                        <div className="login-form-container">
                          <div className="login-register-form">
                            <form onSubmit={handleRegister}>
                              <input
                                type="text"
                                name="first-name"
                                placeholder="First Name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                                disabled={loading}
                              />
                              <input
                                type="text"
                                name="last-name"
                                placeholder="Last Name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                                disabled={loading}
                              />

                              <input
                                type="email"
                                name="user-email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                              />
                              <input
                                type="password"
                                name="user-password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                              />
                              {error && <p style={{ color: "red" }}>{error}</p>}
                              <div className="button-box">
                                <button type="submit" disabled={loading}>
                                  {loading ? <Loader /> : <span>Register</span>}
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </Tab.Pane>
                    </Tab.Content>
                  </Tab.Container>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default LoginRegister;
