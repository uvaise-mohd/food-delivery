import React, { Component } from "react";

import ContentLoader from "react-content-loader";
import DelayLink from "../../../helpers/delayLink";
import Slider from "react-slick";
import ProgressiveImage from "react-progressive-image";
import { WEBSITE_URL } from "../../../../configs/website";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';

class SmallSlider extends Component {
    
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
        arrows : false,
		infinite: true,
		slidesToShow: 1,

		responsive: [
			{
			  breakpoint: 1024,
			  settings: {
				slidesToShow: 2,
				slidesToScroll: 2,
				infinite: true,
                dots: true
			  }
			},
			{
			  breakpoint: 768,
			  settings: {
			    slidesToShow: 1,
			    slidesToScroll: 1
			  }
			}
			]
		};

		return (
			<React.Fragment>
				<div
					className="bg-white pl-10 pr-10 my-0"
				>
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
						<Carousel className="mt-10" autoFocus={true} autoPlay={false} centerMode centerSlidePercentage={55} showStatus={false} stopOnHover={true} showArrows={false} showThumbs={false}>
							{slides.map(slide => (
								<DelayLink to={'/slider-stores/'+slide.id } key={slide.id}>
									<div>
										<ProgressiveImage
											delay={100}
											src={WEBSITE_URL + slide.image}                                     
											placeholder={'https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/portal/m/blue_placeholder'}
										>
											{(src, loading) => (
												<img
													src={src}
													alt={'offers-great'}
													style={{
														borderRadius: '1rem',
														width: '50vw',
														height: '60vw',
													}}
												/>
											)}
										</ProgressiveImage>
									</div>
								</DelayLink>
							))}
						</Carousel>
					)}
				</div>
			</React.Fragment>
		);
	}
}

export default SmallSlider;
