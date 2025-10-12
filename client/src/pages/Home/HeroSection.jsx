import React from "react";
import Button from "../../components/ui/Button";
import heroImage from "../../assets/images/hero_image.jpg"

export default function HeroSection() {
  return (
    <section className="h-[700px] mb-10 w-full">

      {/* backcolor effect */}
      <div className="flex flex-row absolute top-0 h-[700px] items-center  justify-between w-full">
        <div className=" bg-black w-2/5 h-full"></div>
        <img src={heroImage} alt="" className='w-3/5 h-full object-cover '/>
      </div>

      <div className="pl-32 h-full relative z-50">       
       <div className="flex flex-col items-start gap-y-4 justify-center bg-[#00000026] w-[50%] max-[960px]:w-[80%] flex-1 h-[521px] absolute  top-10  py-8 pr-8">
            <h1 className="text-6xl font-extrabold text-[#F0F0F0]">3D Car Modification and Discussion Platform</h1>
            <p className="text-2xl text-white">Discover Car Banao’s amazing deals on car Modification. Select from a range of car options and local specials to get the best deal</p>
            <Button
              text="Explore now"
              className="bg-white
           text-black
            text-2xl
            relative
                z-50
                duration-300
                 before:absolute
                 before:-z-10
                 hover:translate-y-2
                 hover:translate-x-2
                 before:h-full before:w-0
                hover:before:w-full
        hover:before:transition-all
        hover:before:duration-300
          before:left-0
          before:rounded-s-sm
          before:top-0
          before:bg-black
          before:opacity-30
          py-3 px-6 "
            />
          </div>
      </div>
    </section>
  );
}
