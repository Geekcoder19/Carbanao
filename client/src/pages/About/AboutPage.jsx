import React from "react";
import Wrapper from "../../components/ui/Wrapper";
import AboutHero from "../../assets/images/about_hero.jpg";
import darkPattern from "../../assets/cutLayouts/dark_pattern.png";
import SidePattern from "../../components/ui/SidePattern";
import ServiceTrackingCard from "./ServiceTrackingCard";
import workImage from "../../assets/images/work_image.png";
import TeamWrapper from "../common/TeamWrapper";
import AnimButton from "../../components/ui/AnimButton";
import Title from "../../components/ui/Title";
import pngwing from "../../assets/images/pngwing.png";
import bar1 from "../../assets/cutLayouts/bar_pattern1.png";
import bar2 from "../../assets/cutLayouts/bar_pattern2.png";
import VisionaryCards from "./VisionaryCards";

export default function AboutPage() {
  return (
    <>
      {/* hero section of about */}

      <section className=" px-20 relative mt-20 flex flex-col items-center text-center gap-y-5 bg-gradient-to-b from-neutral-50 from-70% via-neutral-200 via-80% to-neutral-700 to-95% overflow-hidden">
        <h1 className=" font-bold text-5xl">About Us</h1>
        <p className="font-normal text-base text-black">
          We're on a mission to transform the digital landscape through
          innovative solutions and exceptional user experiences.
        </p>
        <h1 className="font-semibold text-6xl">
          Automotive industry in Pakistan.
        </h1>

        <img
          src={AboutHero}
          alt=""
          className="max-lg:h-96 rounded-3xl h-[551px] w-full object-cover opacti"
        />

        {/* free cutlyouts */}

        <SidePattern properties="bg-light-gray top-[390px]  -left-16 " />
        <SidePattern
          src={darkPattern}
          properties="bg-dark-gray top-96  -left-18"
        />
      </section>

      {/* ratings card */}

      <Wrapper properties="bg-darker-gray p-10 space-y-7 ">
        <h1 className="font-bold ml-16   text-3xl text-white">
          Our Success Numbers
        </h1>
        <ServiceTrackingCard />
      </Wrapper>

      {/* card details */}

      <Wrapper properties="flex flex-col  items-center gap-y-10 ">
        <Title text="Our Vision" />

        <div className=" relative w-full h-full">
          <div className="relative flex flex-row gap-x-10 justify-center">
            <div className="relative">
              <VisionaryCards
                title="Innovation"
                desc="We strive to redefine the automotive industry by introducing cutting-edge technology and high-quality solutions that enhance vehicle performance, aesthetics, and functionality."
                properties="top-16 relative before:content-['1'] "
              />

              <img
                src={bar1}
                alt=""
                className="max-mlg:hidden absolute -right-12 top-80 w-52"
              />
            </div>
            <div className="relative before:absolute before:size-40 before:bg-light-gray before:-left-4 before:top-48 before:-z-10 before:rounded-xl after:absolute after:size-40 after:bg-light-gray after:right-0 after:top-16 after:-z-10 after:rounded-xl">
            <img src={pngwing} alt="" className="w-60 max-w-60" />

            </div>
           
            {/* <img src={largePattern} alt="" className='absolute top-24 -z-10 translate-x-full w-72'/> */}

            <div className="relative self-center">
              <img
                src={bar1}
                alt=""
                className="max-mlg:hidden absolute w-52 -top-24 rotate-180 left-0"
              />
              <VisionaryCards
                title="Empowerment"
                desc="Our goal is to provide car owners with limitless customization options, allowing them to transform their vehicles according to their unique style, needs, and preferences."
                properties=" before:content-['2'] "
              />
            </div>
          </div>
          <div className="ml-[64%] relative">
            <VisionaryCards
              title="Personalization"
              desc="We believe that every car should be more than just a mode of transport—it should be an extension of its owner’s personality, passion, and lifestyle. Through our expertise, we turn visions into reality."
              properties="before:content-['3'] "
            />
            <img
              src={bar2}
              alt=""
              className="absolute w-20 top-0 -left-36 max-mlg:hidden"
            />
          </div>
        </div>
      </Wrapper>

      {/* our mission */}

      <Wrapper properties="flex flex-col items-center  gap-y-10 ">
        <Title text="Our Mission" />
        <div className="flex gap-7  max-mlg:w-full items-start max-mlg:flex-col">
          <img
            src={workImage}
            alt=""
            className="w-96 max-mlg:w-full max-mlg:h-96 object-cover"
          />

          <p className="ml-3 w-96 max-mlg:w-fit">
            <span className="font-extrabold text-2xl"> &#34; </span>
            Our mission is to provide top-tier automotive services with a
            commitment to quality, creativity, and customer satisfaction. We
            strive to make car customization easy, affordable, and accessible
            for everyone, ensuring every vehicle gets the care and precision it
            deserves.
            <span className="font-extrabold text-2xl"> &quot; </span>
          </p>
        </div>
      </Wrapper>

      {/* Leadership team */}
      <TeamWrapper />

      {/* Join team */}
      <Wrapper
        properties='text-white bg-green-950 text-center py-10  bg-[url("src/assets/images/about_bg.jpg")]  bg-top bg-cover    bg-no-repeat relative 
space-y-8
relative before:absolute before:w-full before:left-0 before:h-full before:top-0 before:bg-greish-green before:-z-10 z-50 before:opacity-70


'
      >
        <h1 className=" font-bold  text-2xl">Join the Carbanao team!</h1>
        <p className="font-medium text-base">
          Do you want to be part of the Carbanao team? click "join team"
        </p>
        <AnimButton text="join team!" properties="bg-black px-10" />
      </Wrapper>
    </>
  );
}
