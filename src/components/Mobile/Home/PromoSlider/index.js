import React, { Component } from "react";

import ContentLoader from "react-content-loader";
import DelayLink from "../../../helpers/delayLink";
import Slider from "react-slick";
import ProgressiveImage from "react-progressive-image";
import { WEBSITE_URL } from "../../../../configs/website";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import LazyLoad from "react-lazyload";
import Ink from "react-ink";

class PromoSlider extends Component {
  render() {
    const { slides } = this.props;
    // console.log(slides);

    const settings = {
      dots: false,
      infinite: true,
      speed: 500,
      adaptiveHeight: true,
      autoplay: true,
      fade: false,
      arrows: false,
      infinite: true,
      slidesToShow: 1,

      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            infinite: true,
            dots: true,
          },
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    };

    return (
      <React.Fragment>
        <div className="bg-white my-0">
          {slides.length === 0 ? (
            <ContentLoader
              height={170}
              width={400}
              speed={1.2}
              primaryColor="#f3f3f3"
              secondaryColor="#ecebeb"
            >
              <rect x="20" y="0" rx="4" ry="4" width="360" height="168" />
            </ContentLoader>
          ) : (
            <React.Fragment>
              <div className="d-flex align-items-center justify-content-between" style={{ marginTop: "20px" }}>
                <div
                  className="ml-10"
                  style={{ fontSize: "1.2em", fontWeight: "600" }}
                >
                 Collection
                </div>
                <div
                  className="mr-10"
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#FE0000",
                  }}
                >
                  See all
                </div>
              </div>

			  <div
                    className="d-flex mt-10 ml-5"
                    style={{
                      display: "flex",
                      overflowX: "auto",
                    }}
                  >
                    {slides.map((restaurant) => (
                      <div className="p-5 d-flex flex-column justify-content-center align-items-center">
                        <DelayLink
                          to={"stores/" + restaurant.slug}
                          key={restaurant.id}
                          style={{ position: "relative" }}
                        >
                          <div>
                            <LazyLoad>
                              <img
                                src={WEBSITE_URL + restaurant.image}
                                placeholder={
                                  "https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/portal/m/blue_placeholder"
                                }
                                // alt={restaurant.name}
                                style={{
                                  height: "170px",
                                  width: "170px",
                                  borderRadius: "33px",
                                  objectFit: "cover",
                                }}
                                
                              />
                            </LazyLoad>
                          </div>
                          <div
                            className="mt-5"
                            style={{
                              overflow: "hidden",
                              fontWeight: "400",
                              textAlign: "center",
                            }}
                          >
                            {restaurant.name}
                          </div>
                          <Ink duration="500" hasTouch={true} />
                        </DelayLink>
                      </div>
                    ))}
                  </div>
              {/* <Carousel
                className="mt-20"
                autoFocus={true}
                autoPlay={false}
                showStatus={false}
                stopOnHover={true}
                transitionTime={1000}
                showArrows={false}
                showThumbs={false}
              >
                {slides.map((slide) => (
                  <DelayLink to={"/banner-items/" + slide.id} key={slide.id}>
                    <div className="text-center">
                      <ProgressiveImage
                        delay={100}
                        src={WEBSITE_URL + slide.image}
                        placeholder={
                          "https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/portal/m/blue_placeholder"
                        }
                      >
                        {(src, loading) => (
                          <img
                            src={src}
                            alt={"offers-great"}
                            style={{
                              borderRadius: "1rem",
                              width: "90vw",
                              height: "50vw",
                            }}
                          />
                        )}
                      </ProgressiveImage>
                    </div>
                  </DelayLink>
                ))}
              </Carousel> */}
            </React.Fragment>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default PromoSlider;
