import React from 'react'
import TeamCrousel from './TeamCarousel'
import Wrapper from '../../components/ui/Wrapper'
import Title from '../../components/ui/Title'


export default function TeamWrapper() {
  return (
     <Wrapper properties='w-full flex flex-col items-center'>
           
            <Title text="Our FYP Team"/>
            <p className="text-2xl font-normal text-center">
              Meet the people behind our project
            </p>
    
            <TeamCrousel />
          </Wrapper>
  )
}
