import PropTypes from "prop-types";
import clsx from "clsx";
import { Link } from "react-router-dom";

const BannerTwentySevenSingle = ({ data, spaceBottomClass }) => {
  return (
      <div className={clsx("single-banner-2", spaceBottomClass, data.textAlign === "left" && "align_right")}>
        <Link to={process.env.PUBLIC_URL + data.link}>
          <img src={process.env.PUBLIC_URL + data.image} alt="" />
        </Link>
        <div className="banner-content-2 banner-content-2--style2 banner-content-2--style2--violet">
          <h3>{data.title}</h3>
          <h4>
            {data.subtitle} <span>{data.price}</span>
          </h4>
          <Link to={process.env.PUBLIC_URL + data.link}>
            <i className="fa fa-long-arrow-right" />
          </Link>
        </div>
      </div>
  );
};

BannerTwentySevenSingle.propTypes = {
  data: PropTypes.shape({}),
  spaceBottomClass: PropTypes.string
};

export default BannerTwentySevenSingle;
