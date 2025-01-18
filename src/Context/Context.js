import axios from 'axios'
import { createContext, useEffect, useState  } from 'react'
import Cookies from 'js-cookie'
import jwt_decode from 'jwt-decode'

export const GlobalContext = createContext(null)

export default function GlobalState({ children }) {
  const [salesManList, setSalesManList] = useState([])
  const [salesman, setSalesman] = useState([]);
  const [role, setRole] = useState('') // State to manage the role


  const [salesManPosition, setSalesmanPosition] = useState([
    {
      lat: 21.1458,
      lng: 79.0882,
    },
  ])

  const [selectedSalesMan, setSelectedSalesMan] = useState()

  useEffect(() => {
    const token = Cookies.get('token') // Get token from cookies
    if (token) {
      try {
        const decodedToken = jwt_decode(token)
        if (decodedToken && decodedToken.role) {
          setRole(decodedToken.role) // Set the role from the decoded token
        } else {
          console.warn('Role not found in the decoded token.')
        }
      } catch (error) {
        console.error('Error decoding token:', error)
      }
    } else {
      console.warn('Token not found. Ensure the user is logged in.')
    }

    const getSalesmanPosition = async () => {
      try {
        const username = 'schoolmaster'
        const password = '123456'
        const token = btoa(`${username}:${password}`)
        const response = await axios.get('https://rocketsalestracker.com/api/positions', {
          headers: {
            Authorization: `Basic ${token}`,
          },
        })

        if (response.status === 200) {
          console.log(response.data)

          if (response.data && response.data.length > 0) {
            setSalesManList(response.data);

            const newMarkers = response.data.map((item) => ({
              lat: item.latitude,
              lng: item.longitude,
            }))
            setSalesmanPosition(newMarkers)
          }
        }
      } catch (error) {
        console.log('Error:', error)
      }
    }
    const getSalesman = async () => {
      try {
        const username = 'schoolmaster'
        const password = '123456'
        const token = btoa(`${username}:${password}`)
        const response = await axios.get('https://rocketsalestracker.com/api/devices', {
          headers: {
            Authorization: `Basic ${token}`,
          },
        })

        if (response.status === 200) {
          setSalesman(response.data)
          console.log(response.data)
        }
      } catch (error) {
        console.log('Error:', error)
      }
    }

    getSalesman()

    getSalesmanPosition()
  }, [])

  return (
    <GlobalContext.Provider value={{ salesManPosition,salesman, salesManList, selectedSalesMan, setSelectedSalesMan,  role,setRole }}>
      {children}
    </GlobalContext.Provider>
  )
}
