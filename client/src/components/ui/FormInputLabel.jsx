import React from 'react'


export default function FormInputLabel({children,textNode}) {





  return (
    <label className="text-slate-gray text-[12px] font-medium flex flex-col gap-y-1">
        {textNode}
{children}
    </label>
  )
}
