import React from 'react'

export default function Title({text,properties=""}) {
  return (
  <h1 className={`font-bold text-5xl border-t-4 pt-1 w-fit text-center ${properties}`}>{text}</h1>
  )
}
