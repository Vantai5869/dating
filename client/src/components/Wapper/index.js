import React from 'react'
import './style.css';

export default function Wapper({children}) {
  return (
    <div className="wapper">{children}</div>
  )
}
