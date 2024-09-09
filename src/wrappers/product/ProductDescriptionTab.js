import { useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import { API_BASE_URL } from "../../utils";
import { toast } from "react-toastify";
import { useAuth } from "../../context/Auth";
import Avatar from "../../avatart.png";

const ProductDescriptionTab = ({
  spaceBottomClass,
  productFullDesc,
  Materials,
  skinType,
  productType,
  productWeight,
  productId,
  reviews: initialReviews,
}) => {
  const [reviews, setReviews] = useState(initialReviews || []);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: "",
  });
  const [loading, setLoading] = useState(false);

  const { authenticated, token } = useAuth();

  const handleRating = (rating) => {
    setNewReview({ ...newReview, rating });
  };

  const createReview = async (e) => {
    e.preventDefault();
    if (!authenticated) {
      localStorage.setItem("redirectUrl", window.location.href);
      window.location.href = "/login-register";
      toast.info("Please login first to write a review.");
      return;
    }
    if (!newReview.rating || !newReview.comment) {
      toast.error("Please provide rating and comment.");
    }
    try {
      setLoading(true);
      const response = await fetch(API_BASE_URL + "/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          rate: newReview.rating,
          comment: newReview.comment,
          productId,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      toast.success("Thank you for your review.");
      setReviews([...reviews, data]);
      setNewReview({ name: "", rating: 0, comment: "" });
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Failed to create review.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={clsx("description-review-area", spaceBottomClass)}>
      <div className="container">
        <div className="description-review-wrapper">
          <Tab.Container defaultActiveKey="productDescription">
            <Nav variant="pills" className="description-review-topbar">
              <Nav.Item>
                <Nav.Link eventKey="additionalInfo">
                  Additional Information
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="productDescription">Description</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="productReviews">
                  Reviews({reviews.length})
                </Nav.Link>
              </Nav.Item>
            </Nav>
            <Tab.Content className="description-review-bottom">
              <Tab.Pane eventKey="additionalInfo">
                <div className="product-anotherinfo-wrapper">
                  <ul>
                    <li>
                      <span>Weight: {productWeight}</span>
                    </li>
                    <li>
                      <span>Type: {productType}</span>
                    </li>
                    <li>
                      <span>Skin Type: {skinType}</span>
                    </li>
                    <li>
                      <span>Materials: {Materials}</span>
                    </li>
                  </ul>
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="productDescription">
                {productFullDesc}
              </Tab.Pane>
              <Tab.Pane eventKey="productReviews">
                <div className="row">
                  <div className="col-lg-7">
                    <div className="review-wrapper">
                      {reviews.map((review, index) => (
                        <div
                          key={index}
                          className="single-review d-flex align-items-center"
                        >
                          <div className="review-img">
                            <img src={Avatar} alt="" width={60} height={60} />
                          </div>
                          <div className="review-content">
                            <div className="review-top-wrap">
                              <div className="review-left">
                                <div className="review-name">
                                  <h4>
                                    {review?.user?.firstName +
                                      " " +
                                      review?.user?.lastName}
                                  </h4>
                                </div>
                                <div className="review-rating">
                                  {[...Array(5)].map((star, i) => (
                                    <i
                                      key={i}
                                      className={
                                        i < review.rating
                                          ? "fa fa-star"
                                          : "fa fa-star-o"
                                      }
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="review-bottom">
                              <p>{review.message}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="col-lg-5">
                    <div className="ratting-form-wrapper pl-50">
                      <h3>Add a Review</h3>
                      <div className="ratting-form mt-4">
                        <form onSubmit={createReview}>
                          <div className="star-box">
                            <h4 className="mr-15">Your rating:</h4>
                            <div className="ratting-star">
                              {[...Array(5)].map((star, i) => (
                                <i
                                  key={i}
                                  className={
                                    i < newReview.rating
                                      ? "fa fa-star"
                                      : "fa fa-star-o"
                                  }
                                  onClick={() => handleRating(i + 1)}
                                  style={{
                                    cursor: "pointer",
                                    fontSize: "24px",
                                    pointerEvents: loading ? "none" : "auto",
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-12">
                              <div className="rating-form-style form-submit">
                                <textarea
                                  name="Your Review"
                                  placeholder="Message | Comment | Review"
                                  value={newReview.comment}
                                  onChange={(e) =>
                                    setNewReview({
                                      ...newReview,
                                      comment: e.target.value,
                                    })
                                  }
                                  required
                                  disabled={loading}
                                />
                                <input
                                  disabled={loading}
                                  type="submit"
                                  value={loading ? "Submitting..." : "Submit"}
                                />
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </div>
      </div>
    </div>
  );
};

ProductDescriptionTab.propTypes = {
  spaceBottomClass: PropTypes.string,
  productFullDesc: PropTypes.string,
  Materials: PropTypes.string,
  skinType: PropTypes.string,
  productType: PropTypes.string,
  productWeight: PropTypes.string,
  initialReviews: PropTypes.array,
};

export default ProductDescriptionTab;
