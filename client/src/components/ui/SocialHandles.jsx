import React from 'react'
import {FaFacebookF,FaWhatsapp,FaTwitter,FaInstagram} from "react-icons/fa6"
import {Link} from "react-router-dom"

export default function SocialHandles({properties=""}) {
  return (

    // social links
    <div className={`flex flex-row items-center text-base gap-x-6 text-white ${properties}`}>
       
       <Link to="" className='p-2.5 bg-blend-gray  rounded-full'><FaFacebookF/></Link>
       <Link to="" className='p-2.5 bg-blend-gray rounded-full'><FaTwitter/></Link>
       <Link to="" className='p-2.5 bg-blend-gray rounded-full'><FaInstagram/></Link>
      
    </div>
  )
}
