import React, { Fragment, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Tab, Nav } from "react-bootstrap";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { API_BASE_URL } from "../../utils";
import { toast } from "react-toastify";
import Loader from "../../components/loader";

const ForgotPassword = () => {
  const { pathname } = useLocation();
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [activeKey, setActiveKey] = useState("login");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setActiveKey(activeKey);
  }, [activeKey]);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const res = await fetch(API_BASE_URL + "/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      if (res.status === 200) {
        toast.success("Password reset link sent to your email.");
      } else {
        const data = await res.json();
        throw new Error(data.message);
      }
    } catch (error) {
      setError(error.message);
      console.error("Error resetting password:", error);
      toast.error(error.message || "Failed to send password reset link.");
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
                          <h4>Forgot Password</h4>
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                    <Tab.Content>
                      <Tab.Pane eventKey="login">
                        <div className="login-form-container">
                          <div className="login-register-form">
                            <form onSubmit={handleForgotPassword}>
                              <input
                                type="email"
                                name="email"
                                placeholder="Your Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                                required
                              />
                              {error && <p style={{ color: "red" }}>{error}</p>}
                              <div className="button-box">
                                <button type="submit" disabled={loading}>
                                  {loading ? <Loader /> : <span>Submit</span>}
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

export default ForgotPassword;
