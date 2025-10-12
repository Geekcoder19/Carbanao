import React from 'react'

export default function Wrapper({children,properties=""}) {
  return (
    <section className={`px-20 mb-20  ${properties}`}>
        {children}
    </section>
  )
}
