import React, { useState } from 'react'
import SocialHandles from '../../components/ui/SocialHandles'

import Border from "../../assets/cutLayouts/corner-border-circle.png"
import { toast } from 'react-toastify';
import notificationPopup from '../../notifications/NotificationPopup';
import Rabta from '../../components/ui/Rabta';



export default function ContactInformation() {




  return (
    <>
     <div className="overflow-hidden lg:h-[545px] h-auto lg:w-96 w-full   bg-black p-8  rounded-xl flex flex-col gap-y-16  relative">
            {/* heading */}
            <div className="space-y-1.5">
              <h1 className="text-white text-3xl">Contact Information</h1>
              <p className="font-normal text-base text-light-gray">
                Say something to start a live chat!
              </p>
            </div>

            <div className='flex flex-row gap-x-16 gap-y-16 lg:flex-col '>
            {/* contact Address */}
            <Rabta/>
            {/* Social links */}
    <SocialHandles properties ="max-lg:flex-col gap-y-2"/>    
    </div>
    
    
    <img src={Border} alt="Corner-border" className="absolute -right-14 -bottom-12 w-60" />
    


          </div>  
          </>
  )
}
