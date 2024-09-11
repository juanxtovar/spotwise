import React from 'react'

export default function Container({ children }) {
  return (
    <div style={{
        padding:0,
        margin:0,
        display: 'flex',
        height: '100vh',
        overflow:'hidden'
    }}>
        {children}
    </div>
  )
}
