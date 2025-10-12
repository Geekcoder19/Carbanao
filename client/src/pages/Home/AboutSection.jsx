import React from 'react'
import Wrapper from '../../components/ui/Wrapper'
import aboutImage1 from "../../assets/images/about_image1.jpg";
import aboutImage2 from "../../assets/images/about_image2.jpg";
import Title from '../../components/ui/Title';


export default function AboutSection() {
  return (
    <Wrapper properties={"flex flex-col items-center gap-y-5"}>
   <Title text="About Us"/>
    <p className="text-2xl font-normal text-center">Car Banao is an innovative startup revolutionizing the automotive industry in Pakistan. We specialize in providing custom car-building solutions, vehicle design services, and personalized automotive experiences.</p>
    
    <div className="grid grid-cols-2 grid-flow-row gap-5 ">
    <img src={aboutImage1} alt="" className="rounded-4xl h-80 col-span-2 w-full object-cover"/>
    <div className="flex flex-col justify-center gap-y-3 max-[980px]:col-span-2">
      <h1 className="font-bold text-5xl">Our Mission</h1>
      <p className="font-normal">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
      <div className="text-white flex flex-row gap-3">
        <div className="bg-black rounded-lg p-6 flex-1">
          <h1 className="text-2xl font-bold">Innovation</h1>
          <p>Pushing boundaries</p>
        </div>
    <div className="bg-black rounded-lg p-6 flex-1">
    <h1 className="text-2xl font-bold">Community</h1>
    <p>Building together</p>
    </div>
      </div>
    </div>
    <img src={aboutImage2} alt="" className="rounded-4xl h-80 w-full object-cover max-[980px]:col-span-2 max-[980px]:row-start-3 "/>
    </div>
    
    
    
    
    
    
    
    
    
    </Wrapper>
  )
}
