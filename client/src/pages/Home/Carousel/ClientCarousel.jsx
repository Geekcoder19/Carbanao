import React, { useEffect, useState } from "react";
import { clients } from "../../../data/homePageData";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";

export default function ClientCrousel() {
  const [screenwidth, setScreenwidth] = useState(window.innerWidth);
  const [slideRatio, setSlideRatio] = useState(2);

  useEffect(() => {
    const handleResize = () => {
      setScreenwidth(window.innerWidth);
    };

    if (screenwidth < 850) {
      setSlideRatio(1);
    } else {
      setSlideRatio(2);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [screenwidth]);

  return (
    <Swiper
      className="w-full bg-[#444444] !flex flex-row  justify-between items-center gap-10"
      modules={[Navigation, Pagination, Scrollbar, A11y]}
      navigation={true}
      effect={"flip"}
      grabCursor={true}
      spaceBetween={30}
      slidesPerView={slideRatio}
      // onSlideChange={() => console.log("slide change")}
      // onSwiper={(swiper) => console.log(swiper)}
    >
      {clients.map((slide, index) => {
        return (
          <SwiperSlide
            key={index}
            className={`min-h-96   text-white rounded-sm p-5 !flex flex-col items-center gap-y-3 justify-center border-[#C4C4C4] border-r-2 border-l-2`}
          >
            <img
              src={slide.profile}
              alt=""
              className="w-32 h-32 rounded-full mb-3"
            />
            <h1 className="text-2xl font-medium">{slide.name}</h1>
            <p className="text-center font-light">{slide.feedback}</p>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}
