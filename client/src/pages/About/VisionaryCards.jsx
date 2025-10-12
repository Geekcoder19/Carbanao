import React from 'react'

export default function VisionaryCards({title,desc,properties}) {
  return (
    <div className={`bg-black h-fit max-w-80 text-white rounded-lg py-3 space-y-5 px-5 ${properties} relative before:absolute before:size-8 before:rounded-full before:bg-black before:left-0 before:-top-10  before:font-bold  before:flex before:items-center before:justify-center`}>
      <h1 className='font-semibold text-base'>{title}</h1>
      <p className='text-[12px] font-normal'>{desc}</p>
    </div>
  )
}
