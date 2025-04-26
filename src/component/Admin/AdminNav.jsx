import React from 'react'
import { Link } from 'react-router-dom'
import './admin.css'

function AdminNav() {
  return (
    <div className="admin-nav">
        <Link to='bookinfo'>Book Info</Link>
        <Link to='sellbook'>Sell Book</Link> 
        {/* <Link to='addevent'>Add Evnet Book</Link> 
        <Link to='eventinfo'>Event Info</Link> */}
        <Link to='advatice'>My Ads</Link>

    </div>
  )
}

export default AdminNav
