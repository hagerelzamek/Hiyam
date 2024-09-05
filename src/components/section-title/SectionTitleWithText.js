import PropTypes from "prop-types";
import clsx from "clsx";

const SectionTitleWithText = ({ spaceTopClass, spaceBottomClass }) => {
  return (
    <div className={clsx("welcome-area", spaceTopClass, spaceBottomClass)}>
      <div className="container">
        <div className="welcome-content text-center">
          <h5>Who Are We</h5>
          <h1>Welcome To Hiyam Cosmetics</h1>
          <p>
          At Hiyam Cosmetics, we are passionate innovators dedicated to enhancing your natural beauty through premium skincare and beauty solutions. Our team of experts blends cutting-edge technology with high-quality ingredients to create products that deliver real, visible results. With a commitment to sustainability, ethical practices, and exceptional customer care, we strive to empower individuals worldwide to embrace their unique beauty with confidence. Join us on a journey of self-care and transformation as we redefine beauty standards and elevate your everyday routine.
            {" "}
          </p>
        </div>
      </div>
    </div>
  );
};

SectionTitleWithText.propTypes = {
  spaceBottomClass: PropTypes.string,
  spaceTopClass: PropTypes.string
};

export default SectionTitleWithText;
