import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import DashCon from '../../dashboard/DashCon'

const DashBoard = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const token = Cookies.get('token') // Get token from cookies
    if (!token) {
      navigate('/login') // Redirect to login if token is missing
    }
  }, [navigate])

  return <DashCon />
}

export default DashBoard
