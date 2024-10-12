import React from 'react'

export default function ContainerDashboard({ children }) {
  return (
    <div style={{
        padding:0,
        margin:0,
        display: 'flex',
        flexDirection:'column',
        height: '100vh',
        overflowX:'hidden',
        overflowY:'auto'
    }}>
        {children}
    </div>
  )
}
