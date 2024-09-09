import PropTypes from "prop-types";
import clsx from "clsx";
import { Link } from "react-router-dom";

const BannerNineSingle = ({ data, spaceBottomClass }) => {
  return (
    <div className={clsx("single-banner-2", spaceBottomClass)}>
      <Link to={`${process.env.PUBLIC_URL + data.link}?category=${data.title}`}>
        <img src={data.image?.url} alt={data.title} />
      </Link>
      <div className="banner-content-2">
        <h3>{data.title}</h3>
        <h4>
          {data.subtitle} <span>{data.price}</span>
        </h4>
        <Link
          to={`${process.env.PUBLIC_URL + data.link}?category=${data.title}`}
        >
          <i className="fa fa-long-arrow-right" />
        </Link>
      </div>
    </div>
  );
};

BannerNineSingle.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string,
    image: PropTypes.string,
    subtitle: PropTypes.string,
    price: PropTypes.string,
    link: PropTypes.string,
  }),
  spaceBottomClass: PropTypes.string,
};

export default BannerNineSingle;
