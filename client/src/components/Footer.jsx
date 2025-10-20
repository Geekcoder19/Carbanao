import React from 'react'
import logo from "../assets/images/white_logo.png"
import SocialHandles from './ui/SocialHandles'
import Rabta from './ui/Rabta'
import { Link } from 'react-router-dom'




export default function Footer() {
  return (
   <footer className='bg-white  mt-10 px-20 pt-5 rounded-tl-lg rounded-tr-lg'>

<div className='flex flex-col justify-between  mb-10 md-tablet:flex-row  gap-x-10 gap-y-20'>
<div className='flex flex-col gap-10  sm:items-center sm:flex-row'>
 <img src={logo} alt="" className='w-48 h-20  object-cover'/>
 <Rabta/>
</div>

<div className='flex flex-row gap-10  max-sm:flex-col '>
<div className='uppercase text-white flex gap-y-2 underline flex-col'>
  <Link>My account</Link>
  <Link>blogs</Link>
  <Link>about us</Link>
  <Link>faq</Link>
</div>
  <div className='space-y-4'>
  <p className='font-normal text-base text-white'>Follow us!</p>
  <SocialHandles/>
  </div>

</div>
</div>

<hr className='bg-gray-300 h-0.5'/>

<div className='text-base font-light text-light-gray flex flex-row justify-between gap-x-10 gap-y-4 p-5 flex-wrap'>

<div className='flex flex-row gap-5'>
  <p>Privacy</p>
  <p>Terms and Conditions</p>
</div>

<p>Carbanao 2025 © All rights Reserved.</p>

</div>


   </footer>
  )
}
