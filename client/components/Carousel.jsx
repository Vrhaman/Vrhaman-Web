"use client";

import React, { useEffect } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { BiArrowBack } from "react-icons/bi";
import { Carousel } from "react-responsive-carousel";
import Wrapper from "./Wrappper";

const Hero = () => {
  const carouselData = [
    {
      product_main_image:
        "https://images.unsplash.com/photo-1579091761043-5eb99b8ed773?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",

      category: "bike",
    },
    {
      product_main_image:
        "https://images.unsplash.com/photo-1554223789-df81106a45ed?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      category: "scooty",
    },
  ];

  return (
    <Wrapper>
      <div className="relative text-white text-[20px] w-full max-w-full mx-auto">
        <Carousel
          autoPlay={true}
          infiniteLoop={true}
          showThumbs={false}
          showIndicators={false}
          showStatus={false}
          renderArrowPrev={(clickHandler, hasPrev) => (
            <div className=" hidden md:block">
              <div
                onClick={clickHandler}
                className="absolute right-[31px] md:right-[51px] bottom-0 w-[30px] md:w-[50px] h-[30px] md:h-[50px] bg-[#f97316] z-10 flex items-center justify-center cursor-pointer hover:bg-[#d97706] "
              >
                <BiArrowBack className="text-sm md:text-lg font-bold" />
              </div>
            </div>
          )}
          renderArrowNext={(clickHandler, hasNext) => (
            <div className=" hidden md:block">
              <div
                onClick={clickHandler}
                className="absolute right-0 bottom-0 w-[30px] md:w-[50px] h-[30px] md:h-[50px] bg-[#f97316] z-10 flex items-center justify-center cursor-pointer hover:bg-[#d97706] "
              >
                <BiArrowBack className="rotate-180 text-sm md:text-lg hidden md:block" />
              </div>
            </div>
          )}
        >
          {carouselData.map((item, index) => (
            <div key={index}>
              <img
                src={item.product_main_image}
                className="aspect-[4/3] md:aspect-auto object-cover h-[80vh]"
                alt={`Product ${index + 1}`}
              />
              <a href={`#items`} className="md:block hidden">
                <div className="px-[15px] md:px-[40px] py-[10px] md:py-[25px] font-oswald bg-[#f97316] absolute bottom-[25px] md:bottom-[75px] left-0 text-white text-[15px] md:text-[30px] uppercase font-medium cursor-pointer hover:bg-[#d97706]">
                  Book a Ride
                </div>
              </a>
            </div>
          ))}
        </Carousel>
      </div>
    </Wrapper>
  );
};

export default Hero;
