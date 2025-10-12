import React from 'react'
import { useForm } from 'react-hook-form';


export default function FormInputField({type,attribute,handle,errors,register}) {




  return (
    <>
    <input 
    type={type} 
    className='outline-none border-b-[1px] focus:border-b-medium-black border-b-slate-gray pb-1 text-slate-gray' 
    {...register}
    // onChange={handle}
    />
   {}
     <p role="alert" className="text-red-500">{errors[attribute]?.message}</p>
    </>
  )
}
