import React from 'react'
import { FaEnvelope, FaPhone, FaLocationArrow } from "react-icons/fa6";
import notificationPopup from '../../notifications/NotificationPopup';
export default function Rabta() {

    const numberCopied = async (event) =>{

        const targetedWrapper = event.target;
       const number = targetedWrapper.textContent;
       
       try{
          await navigator.clipboard.writeText(number);
        
           notificationPopup("Successfully Copied", "success");
          
       }
       catch (error) {
       console.log("Failed coping")
       
       }
       }







  return (
    <div className="space-y-7 ">
                  <div className="flex flex-row items-center gap-x-7 text-white">
                    <FaPhone />
                    <button className="font-normal text-base" onClick={numberCopied}>1234567890</button>
                  </div>
                  <div className="flex flex-row items-center gap-x-7 text-white">
                    <FaEnvelope />
                    <p className="font-normal text-base">carbanao@gmail.com</p>
                  </div>
                  <div className="flex flex-row items-center gap-x-7 text-white">
                    <FaLocationArrow />
                    <p className="font-normal text-base">Hyderabad</p>
                  </div>
                </div>
  )
}
