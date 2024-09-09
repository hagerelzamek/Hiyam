import React, { Fragment, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Tab, Nav, Toast } from "react-bootstrap";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "./FirerBaseConfig"; // Ensure the path matches your project structure
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { API_BASE_URL } from "../../utils";
import { toast } from "react-toastify";
import Loader from "../../components/loader";

const ResetPassword = () => {
  const { pathname, search } = useLocation();
  const navigate = useNavigate(); // Hook to navigate programmatically
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [activeKey, setActiveKey] = useState("login");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setActiveKey(activeKey);
  }, [activeKey]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const newPassword = password;
      const token = search.split("=")[1];

      const res = await fetch(API_BASE_URL + "/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, newPassword }),
      });
      if (res.status === 200) {
        navigate("/login-register");
        toast.success("Password reset successfully, please login again.");
      } else {
        const data = await res.json();
        toast.error("Failed to reset password.");
        throw new Error(data.message);
      }
    } catch (error) {
      setError(error.message);
      console.error("Error resetting password:", error);
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
              label: "Reaset Password",
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
                        <Nav.Link eventKey="login">
                          <h4>Reset Password</h4>
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                    <Tab.Content>
                      <Tab.Pane eventKey="login">
                        <div className="login-form-container">
                          <div className="login-register-form">
                            <form onSubmit={handleResetPassword}>
                              <input
                                type="password"
                                name="password"
                                placeholder="New Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                                required
                              />
                              {error && <p style={{ color: "red" }}>{error}</p>}
                              <div className="button-box">
                                <button type="submit" disabled={loading}>
                                  {loading ? <Loader /> : <span>Reset</span>}
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

export default ResetPassword;
