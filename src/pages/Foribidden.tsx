import React from 'react'

function Foribidden() {

  return (
    <div style={{
        backgroundColor: '#000', // Dark background
        color: '#fff', // Contrasting font color
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '3rem', // Large font size
        fontWeight: 'bold'
    }}>
      Foribidden
      <button 
        onClick={() => {
            window.location.href = '/' // Redirect to home page

        }} 
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          fontSize: '1rem',
          color: '#000',
          backgroundColor: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Go Back
      </button>
    </div>
  )
}

export default Foribidden