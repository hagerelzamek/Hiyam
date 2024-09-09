import { Fragment, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Accordion from "react-bootstrap/Accordion";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { useAuth } from "../../context/Auth";
import Loader from "../../components/loader";
import { API_BASE_URL } from "../../utils";
import { toast } from "react-toastify";

const MyAccount = () => {
  let { pathname } = useLocation();
  const { user, updateUser, token } = useAuth();

  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [phone, setPhone] = useState(user.phone);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await fetch(API_BASE_URL + "/orders/my", {
        headers: {
          Authorization: `${token}`,
        },
      });
      const data = await res.json();
      setOrders(data);
    };
    fetchOrders();
  }, [token]);

  const saveUpdatedInfo = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch(API_BASE_URL + "/auth/account", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify({
          firstName,
          lastName,
          phone,
        }),
      });
      if (res.status === 200) {
        toast.success("Account information updated successfully.");
        setLoading(false);
        updateUser({ firstName, lastName, phone });
      } else {
        const data = await res.json();
        throw new Error(data.message);
      }
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch(API_BASE_URL + "/auth/account/change-password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });
      if (res.status === 200) {
        toast.success("Password changed successfully.");
        setLoading(false);
        setCurrentPassword("");
        setNewPassword("");
      } else {
        const data = await res.json();
        throw new Error(JSON.stringify(data));
      }
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
      console.error("Error changing password:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <SEO
        titleTemplate="My Account"
        description="My Account page of flone react minimalist eCommerce template."
      />
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb
          pages={[
            { label: "Home", path: process.env.PUBLIC_URL + "/" },
            { label: "My Account", path: process.env.PUBLIC_URL + pathname },
          ]}
        />

        <div className="myaccount-area pb-80 pt-100">
          <div className="container">
            <div className="row">
              <div className="ms-auto me-auto col-lg-9">
                <div className="myaccount-wrapper">
                  <Accordion defaultActiveKey="0">
                    <Accordion.Item
                      eventKey="0"
                      className="single-my-account mb-20"
                    >
                      <Accordion.Header className="panel-heading">
                        <span>1 .</span> Edit your account information{" "}
                      </Accordion.Header>
                      <Accordion.Body>
                        <form
                          className="myaccount-info-wrapper"
                          onSubmit={saveUpdatedInfo}
                        >
                          <div className="account-info-wrapper">
                            <h4>My Account Information</h4>
                            <h5>Your Personal Details</h5>
                          </div>
                          <div className="row">
                            <div className="col-lg-6 col-md-6">
                              <div className="billing-info">
                                <label>First Name</label>
                                <input
                                  type="text"
                                  value={firstName}
                                  onChange={(e) => setFirstName(e.target.value)}
                                  required
                                  disabled={loading}
                                />
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6">
                              <div className="billing-info">
                                <label>Last Name</label>
                                <input
                                  type="text"
                                  value={lastName}
                                  onChange={(e) => setLastName(e.target.value)}
                                  required
                                  disabled={loading}
                                />
                              </div>
                            </div>
                            <div className="col-lg-12 col-md-12">
                              <div className="billing-info">
                                <label htmlFor="email">Email Address</label>
                                <input
                                  style={{
                                    backgroundColor: "#F5F5F5",
                                  }}
                                  id="email"
                                  type="email"
                                  disabled
                                  value={user.email}
                                  name="email"
                                />
                              </div>
                            </div>
                            <div className="col-lg-12 col-md-12">
                              <div className="billing-info">
                                <label>Telephone</label>
                                <input
                                  value={phone}
                                  onChange={(e) => setPhone(e.target.value)}
                                  required
                                  disabled={loading}
                                  type="text"
                                  id="phone"
                                  name="phone"
                                />
                              </div>
                            </div>
                            {/* <div className="col-lg-6 col-md-6">
                              <div className="billing-info">
                                <label>Fax</label>
                                <input type="text" />
                              </div>
                            </div> */}
                          </div>
                          {error && <p className="text-danger">{error}</p>}
                          <div className="billing-back-btn">
                            <div className="billing-btn">
                              <button type="submit">
                                {loading ? <Loader /> : "Save"}
                              </button>
                            </div>
                          </div>
                        </form>
                      </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item
                      eventKey="1"
                      className="single-my-account mb-20"
                    >
                      <Accordion.Header className="panel-heading">
                        <span>2 .</span> Change your password
                      </Accordion.Header>
                      <Accordion.Body>
                        <form
                          className="myaccount-info-wrapper"
                          onSubmit={changePassword}
                        >
                          <div className="account-info-wrapper">
                            <h4>Change Password</h4>
                            <h5>Your Password</h5>
                          </div>
                          <div className="row">
                            <div className="col-lg-12 col-md-12">
                              <div className="billing-info">
                                <label>Current Password</label>
                                <input
                                  type="password"
                                  required
                                  onChange={(e) =>
                                    setCurrentPassword(e.target.value)
                                  }
                                  value={currentPassword}
                                  disabled={loading}
                                />
                              </div>
                            </div>
                            <div className="col-lg-12 col-md-12">
                              <div className="billing-info">
                                <label>New Password</label>
                                <input
                                  type="password"
                                  required
                                  onChange={(e) =>
                                    setNewPassword(e.target.value)
                                  }
                                  value={newPassword}
                                  disabled={loading}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="billing-back-btn">
                            <div className="billing-btn">
                              <button type="submit">
                                {loading ? <Loader /> : "Change Password"}
                              </button>
                            </div>
                          </div>
                        </form>
                      </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item
                      eventKey="2"
                      className="single-my-account mb-20"
                    >
                      <Accordion.Header className="panel-heading">
                        <span>3 .</span> Your Orders
                      </Accordion.Header>
                      <Accordion.Body>
                        <div className="myaccount-info-wrapper">
                          <div className="account-info-wrapper">
                            <h4>All orders you create</h4>
                          </div>
                          <div>
                            {orders.length > 0 ? (
                              orders.map((order) => (
                                <div key={order?.id}>
                                  <div className="py-3 border-bottom">
                                    <div className="d-flex flex-column gap-2">
                                      {order?.products?.map((item) => (
                                        <div
                                          key={item?.id}
                                          className="d-flex justify-content-between align-items-center"
                                        >
                                          <img
                                            src={item?.product?.images[0]?.url}
                                            width={120}
                                            height={100}
                                            className="object-fit-contain"
                                            alt="fsfsgsf"
                                          />
                                          <h4>
                                            {item?.product?.title} x{" "}
                                            {item?.quantity}
                                          </h4>
                                          <h4>{item?.total}₺</h4>
                                        </div>
                                      ))}
                                    </div>
                                    <div className="d-flex align-items-center justify-content-between mt-3">
                                      <h5>Order ID: {order?.id}</h5>
                                      <h5>Status: {order?.status}</h5>
                                      <h5>Total: {order?.total}₺</h5>
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p>No orders found</p>
                            )}
                          </div>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default MyAccount;
