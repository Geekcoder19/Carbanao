import React from 'react'

export default function Button({className,text}) {
  return (
   <button className={`rounded-sm ${className} py-2 px-6 rounded-sm cursor-pointer color=black`}>{text}</button>
  )
}
