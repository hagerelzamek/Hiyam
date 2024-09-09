import { Fragment, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getDiscountPrice } from "../../helpers/product";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { useAuth } from "../../context/Auth";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../utils";
import { Spinner } from "react-bootstrap";
import { deleteAllFromCart } from "../../store/slices/cart-slice";

const Checkout = () => {
  let cartTotalPrice = 0;
  const { authenticated, user, token, updateUser } = useAuth();
  let { pathname } = useLocation();
  const currency = useSelector((state) => state.currency);
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  console.log("Cart Items: ", cartItems);

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [country, setCountry] = useState(user?.country || "");
  const [address1, setAddress1] = useState(user?.address1 || "");
  const [address2, setAddress2] = useState(user?.address2 || "");
  const [city, setCity] = useState(user?.city || "");
  const [state, setState] = useState(user?.state || "");
  const [zip, setZip] = useState(user?.zip || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);

  const [cardInfo, setCardInfo] = useState({
    number: "",
    name: "",
    expiryYear: "",
    expiryMonth: "",
    cvv: "",
  });

  const [errors, setErrors] = useState({
    number: "",
    name: "",
    expiryYear: "",
    expiryMonth: "",
    cvv: "",
  });

  // Regular expressions for validation
  const cardNumberRegex = /^[0-9]{16}$/;
  const expiryMonthRegex = /^(0[1-9]|1[0-2])$/; // Matches MM (01-12)
  const expiryYearRegex = /^[0-9]{4}$/; // Matches YYYY (4 digits)
  const cvvRegex = /^[0-9]{3,4}$/; // 3 or 4 digits for CVV

  const handleChangeCardInfo = (e) => {
    const { name, value } = e.target;

    if (name !== "name") {
      if (!value.match(/^[0-9]*$/)) {
        return;
      }
    }

    setCardInfo({ ...cardInfo, [name]: value });

    // Remove error when typing
    setErrors({ ...errors, [name]: "" });
  };

  const validateCard = () => {
    let formIsValid = true;
    let newErrors = {
      number: "",
      name: "",
      expiryYear: "",
      expiryMonth: "",
      cvv: "",
    };

    if (!cardInfo.number.match(cardNumberRegex)) {
      formIsValid = false;
      newErrors.number = "Card number must be 16 digits.";
    }

    if (cardInfo.name.trim() === "") {
      formIsValid = false;
      newErrors.name = "Cardholder name is required.";
    }

    if (!cardInfo.expiryMonth.match(expiryMonthRegex)) {
      formIsValid = false;
      newErrors.expiryMonth = "Expiry month must be in MM format.";
    }

    if (!cardInfo.expiryYear.match(expiryYearRegex)) {
      formIsValid = false;
      newErrors.expiryYear = "Expiry year must be 4 digits (YYYY).";
    }

    if (!cardInfo.cvv.match(cvvRegex)) {
      formIsValid = false;
      newErrors.cvv = "CVV must be 3 or 4 digits.";
    }

    setErrors(newErrors);
    return formIsValid;
  };

  useEffect(() => {
    if (!authenticated) {
      toast.info("You must login first!");
      window.location.href = "/login-register";
    }
  }, [authenticated]);

  const data = {
    firstName,
    lastName,
    email: user?.email,
    country,
    address1,
    address2,
    city,
    state,
    zip,
    phone,
    notes,
    cardHolderName: cardInfo.name,
    cardNumber: cardInfo.number,
    expireMonth: cardInfo.expiryMonth,
    expireYear: cardInfo.expiryYear,
    cvc: cardInfo.cvv,
    products: [
      ...cartItems.map((item) => ({
        id: item?.id,
        quantity: item?.quantity || 1,
      })),
    ],
  };

  const placeOredr = async (e) => {
    e.preventDefault();
    if (!validateCard()) return;
    try {
      setLoading(true);
      const url = API_BASE_URL + "/orders/place";
      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const resData = await res.json();
      console.log(resData);

      if (res.ok) {
        updateUser(resData?.user);
        dispatch(deleteAllFromCart());
        toast.success("Thank You, for your order ");
        window.location.href = "/shop-grid-standard";
      } else {
        toast.error(
          resData?.error ||
            resData?.message ||
            "Something went wrong!, pleas try again"
        );
      }
    } catch (error) {
      console.log(error);
      toast.error("server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <SEO
        titleTemplate="Checkout"
        description="Checkout page of flone react minimalist eCommerce template."
      />
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb
          pages={[
            { label: "Home", path: process.env.PUBLIC_URL + "/" },
            { label: "Checkout", path: process.env.PUBLIC_URL + pathname },
          ]}
        />
        <div className="checkout-area pt-95 pb-100">
          <div className="container">
            {cartItems && cartItems.length >= 1 ? (
              <form className="row" onSubmit={placeOredr}>
                <div className="col-lg-7">
                  <div className="billing-info-wrap">
                    <h3>Billing Details</h3>
                    <div className="row">
                      <div className="col-lg-6 col-md-6">
                        <div className="billing-info mb-20">
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
                        <div className="billing-info mb-20">
                          <label>Last Name</label>
                          <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName()}
                            required
                            disabled={loading}
                          />
                        </div>
                      </div>
                      {/* <div className="col-lg-12">
                        <div className="billing-info mb-20">
                          <label>Company Name</label>
                          <input type="text" />
                        </div>
                      </div> */}
                      <div className="col-lg-12">
                        <div className="billing-select mb-20">
                          <label>Country</label>
                          <select
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            disabled={loading}
                            required
                          >
                            <option value={""} disabled selected>
                              Select a country
                            </option>
                            <option value={"Azerbaijan"}>Azerbaijan</option>
                            <option value={"Bahamas"}>Bahamas</option>
                            <option value={"Bahrain"}>Bahrain</option>
                            <option value={"Bangladesh"}>Bangladesh</option>
                            <option value={"Barbados"}>Barbados</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="billing-info mb-20">
                          <label>Street Address</label>
                          <input
                            className="billing-address"
                            placeholder="House number and street name"
                            type="text"
                            value={address1}
                            required
                            onChange={(e) => setAddress1(e.target.value)}
                            disabled={loading}
                          />
                          <input
                            placeholder="Apartment, suite, unit etc."
                            type="text"
                            value={address2}
                            required
                            onChange={(e) => setAddress2(e.target.value)}
                            disabled={loading}
                          />
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="billing-info mb-20">
                          <label>Town / City</label>
                          <input
                            type="text"
                            value={city}
                            required
                            onChange={(e) => setCity(e.target.value)}
                            disabled={loading}
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="billing-info mb-20">
                          <label>State / County</label>
                          <input
                            type="text"
                            required
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            disabled={loading}
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="billing-info mb-20">
                          <label>Postcode / ZIP</label>
                          <input
                            type="number"
                            required
                            value={zip}
                            onChange={(e) => setZip(e.target.value)}
                            disabled={loading}
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="billing-info mb-20">
                          <label>Phone</label>
                          <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            disabled={loading}
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="billing-info mb-20">
                          <label>Email Address</label>
                          <input
                            style={{ background: "#ddd" }}
                            disabled
                            required
                            type="email"
                            value={user?.email}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="additional-info-wrap">
                      <h4>Additional information</h4>
                      <div className="additional-info">
                        <label>Order notes</label>
                        <textarea
                          placeholder="Notes about your order, e.g. special notes for delivery. "
                          name="message"
                          defaultValue={""}
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          disabled={loading}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-5">
                  <div className="your-order-area">
                    <h3>Your order</h3>
                    <div className="your-order-wrap gray-bg-4">
                      <div className="your-order-product-info">
                        <div className="your-order-top">
                          <ul>
                            <li>Product</li>
                            <li>Total</li>
                          </ul>
                        </div>
                        <div className="your-order-middle">
                          <ul>
                            {cartItems.map((cartItem, key) => {
                              const discountedPrice = getDiscountPrice(
                                cartItem.price,
                                cartItem.discount
                              );
                              const finalProductPrice = (
                                cartItem.price * currency.currencyRate
                              ).toFixed(2);
                              const finalDiscountedPrice = (
                                discountedPrice * currency.currencyRate
                              ).toFixed(2);

                              discountedPrice != null
                                ? (cartTotalPrice +=
                                    finalDiscountedPrice * cartItem.quantity)
                                : (cartTotalPrice +=
                                    finalProductPrice * cartItem.quantity);
                              return (
                                <li key={key}>
                                  <span className="order-middle-left">
                                    {cartItem.name} X {cartItem.quantity}
                                  </span>{" "}
                                  <span className="order-price">
                                    {discountedPrice !== null
                                      ? currency.currencySymbol +
                                        (
                                          finalDiscountedPrice *
                                          cartItem.quantity
                                        ).toFixed(2)
                                      : currency.currencySymbol +
                                        (
                                          finalProductPrice * cartItem.quantity
                                        ).toFixed(2)}
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                        <div className="your-order-bottom">
                          <ul>
                            <li className="your-order-shipping">Shipping</li>
                            <li>Free shipping</li>
                          </ul>
                        </div>
                        <div className="your-order-total">
                          <ul>
                            <li className="order-total">Total</li>
                            <li>
                              {currency.currencySymbol +
                                cartTotalPrice.toFixed(2)}
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="payment-method d-flex flex-column gap-3">
                        <div>
                          <label>Card Holder Name</label>
                          <input
                            type="text"
                            value={cardInfo.name}
                            disabled={loading}
                            required
                            name="name"
                            onChange={handleChangeCardInfo}
                          />
                        </div>
                        <div>
                          <label>Card Number</label>
                          <input
                            maxLength={16}
                            value={cardInfo.number}
                            disabled={loading}
                            required
                            name="number"
                            onChange={handleChangeCardInfo}
                            placeholder="Enter 16-digit card number"
                          />
                          {errors?.number && (
                            <span className="text-danger">{errors.number}</span>
                          )}
                        </div>
                        <div>
                          <label>Expiry Month</label>
                          <input
                            maxLength={2}
                            value={cardInfo.expiryMonth}
                            disabled={loading}
                            required
                            name="expiryMonth"
                            placeholder="MM"
                            onChange={handleChangeCardInfo}
                          />
                          {errors.expiryMonth && (
                            <span className="text-danger">
                              {errors.expiryMonth}
                            </span>
                          )}
                        </div>
                        <div>
                          <label>Expiry Year</label>
                          <input
                            maxLength={4}
                            value={cardInfo.expiryYear}
                            disabled={loading}
                            placeholder="YYYY"
                            required
                            name="expiryYear"
                            onChange={handleChangeCardInfo}
                          />
                          {errors.expiryYear && (
                            <span className="text-danger">
                              {errors.expiryYear}
                            </span>
                          )}
                        </div>
                        <div>
                          <label>CVV</label>
                          <input
                            maxLength={4}
                            value={cardInfo.cvv}
                            disabled={loading}
                            required
                            onChange={handleChangeCardInfo}
                            name="cvv"
                            placeholder="CVV"
                          />
                          {errors.cvv && (
                            <span className="text-danger">{errors.cvv}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="place-order mt-25">
                      <button
                        disabled={loading}
                        type="submit"
                        className="btn-hover"
                        style={{
                          opacity: loading ? 0.5 : 1,
                        }}
                      >
                        {loading ? (
                          <Spinner
                            style={{
                              width: "20px",
                              height: "20px",
                            }}
                            animation="border"
                          />
                        ) : (
                          "Place Order"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              <div className="row">
                <div className="col-lg-12">
                  <div className="item-empty-area text-center">
                    <div className="item-empty-area__icon mb-30">
                      <i className="pe-7s-cash"></i>
                    </div>
                    <div className="item-empty-area__text">
                      No items found in cart to checkout <br />{" "}
                      <Link to={process.env.PUBLIC_URL + "/shop-grid-standard"}>
                        Shop Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default Checkout;
