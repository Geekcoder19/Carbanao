import React from 'react'
import { teamData } from '../../data/homePageData'



export default function TeamCrousel() {
  return (
    <div className='flex w-full flex-row flex-wrap  text-white mt-10 justify-center gap-5'>


{
teamData.map((member,index)=>{


return (
  <div key={index} className=' w-full bg-black flex flex-col min-w-48 items-center flex-1 rounded-lg p-6'>
    {/* profile pic */}
<img src={member.profile}  className='w-32 h-32 rounded-full mb-3'/>
{/* name */}
<h1 className='font-bold'>{member.name}</h1>
{/* position */}
<p className='text-[12px] font-light'>{member.position}</p>
  </div>
)



})
}
    </div>
  )
}
