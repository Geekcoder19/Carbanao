import React from 'react'
import { FaRegUser,FaStar } from "react-icons/fa6";


export default function ServiceTrackingCard() {
  return (
    <div className='rounded-3xl gap-5  max-md:flex-wrap max-md:gap-y-16  bg-black py-10 px-5 flex flex-row items-end justify-evenly'>


        {/* Modified car number */}
      <div className='text-white flex flex-col items-center gap-y-5'>
<h1 className='font-extrabold text-5xl max-lg:text-3xl'>6,500,00</h1>
<p className='font-normal text-base'>Total car Modified</p>
      </div>

{/* number of reviews */}
      <div className='text-white flex flex-col items-center gap-y-5'>
      <FaStar className='text-3xl'/>
<h1 className='font-extrabold text-5xl max-lg:text-3xl'>+1,000</h1>
<p className='font-normal text-base'>Average start review. 4,5 stars</p>
      </div>


{/* number of clients */}
      <div className='text-white flex flex-col items-center gap-y-5'>
        <FaRegUser className='text-3xl'/>
<h1 className='font-extrabold text-5xl max-lg:text-3xl'>+20,000</h1>
<p className='font-normal text-base'>Number of clients</p>
      </div>






    </div>
  )
}
