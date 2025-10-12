import React from 'react'
import Wrapper from '../../components/ui/Wrapper'
import FormContainer from './FormContainer'


export default function ContactPage() {
  return (
    <>
    <Wrapper properties='mt-20 space-y-10' >
        <div className='space-y-3'>
        <h1 className=' font-bold text-4xl text-center'>Contact Us</h1>
        <p className='text-center font-medium text-base text-medium-gray'>Any question or remarks? Just write us a message!</p>
        </div>
        

<FormContainer/>

    </Wrapper>
    
    </>
  )
}
