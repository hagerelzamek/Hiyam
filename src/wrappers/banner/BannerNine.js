import PropTypes from "prop-types";
import clsx from "clsx";
import bannerData from "../../data/banner/banner-nine.json";
import BannerNineSingle from "../../components/banner/BannerNineSingle.js";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../utils.js";

const BannerNine = ({ spaceBottomClass }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch(API_BASE_URL + "/category");
      const data = await response.json();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  return (
    <div className={clsx("banner-area", spaceBottomClass)}>
      <div className="container">
        <div className="row">
          {categories?.map((single, key) => (
            <div className="col-lg-6 col-md-6" key={key}>
              <BannerNineSingle data={single} spaceBottomClass="mb-30" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

BannerNine.propTypes = {
  spaceBottomClass: PropTypes.string,
};

export default BannerNine;
