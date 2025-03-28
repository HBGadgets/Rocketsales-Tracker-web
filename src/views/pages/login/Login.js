import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { Link, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import logo from 'src/assets/brand/logo.svg' // Adjust the relative path if needed
import loginpng from '../../../../public/Login.png';
const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleRegisterRedirect = () => {
    navigate('/register')
  }

  // Handle login logic
  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })
      if (!response.ok) {
      const result = await response.json()
        throw new Error(result.message)
      }

      const data = await response.json()
      const { token } = data // Assuming the response contains the token

      // Store token in cookies and localStorage
      Cookies.set('token', token, { expires: 7 })
      localStorage.setItem('token-rs', token)
      
      // Redirect to dashboard
      navigate('/dashboard')
    } catch (error) {
      console.error('Login failed:', error)
      alert(error.message)
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center" style={{ 
      // backgroundImage: 'url("https://www.lystloc.com/blog/wp-content/uploads/2022/12/ezgif.com-gif-maker-30.webp")',
      backgroundImage: `url(${loginpng})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      minHeight: '100vh',
      width: '100vw'
    }}>
      <CContainer 
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleLogin(e); // Call the function when Enter is pressed
          }
        }}
        // Ensures the container can listen for key events
      >
        <CRow className="justify-content-center" >
          <CCol md={5}>
            <CCardGroup>
              <CCard className="p-4"style={{  borderRadius: '10px', boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.5)' }} >
                <CCardBody>
                  {/* Logo Integration */}
                  <div className="text-center mb-4">
                    <img src={logo} alt="Logo" style={{ width: '350px' }} />
                  </div>
                  <CForm>
                    <h1>Login</h1>
                    <p className="text-body-secondary">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput 
                        placeholder="Username" 
                        autoComplete="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)} 
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" className="px-4" onClick={handleLogin}>
                          Login
                        </CButton>
                      </CCol>
                      <div 
                        className="d-grid" 
                        onClick={handleRegisterRedirect} 
                        style={{ cursor: 'pointer', marginTop: '10px' }}
                      >
                        {/* <p>New Here? <strong>Register</strong></p> */}
                      </div>
                      <CCol xs={6} className="text-right">
                        {/* <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton> */}
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              {/* <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                      tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Register Now!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard> */}
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
