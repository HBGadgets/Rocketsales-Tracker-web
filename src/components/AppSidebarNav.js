// import React, { useState } from 'react'
// import PropTypes from 'prop-types'
// import { NavLink } from 'react-router-dom'
// import SimpleBar from 'simplebar-react'
// import 'simplebar-react/dist/simplebar.min.css'
// import { useSelector } from 'react-redux'
// import { CBadge, CNavLink, CSidebarNav } from '@coreui/react'
// import { useDispatch } from 'react-redux';



// export const AppSidebarNav = ({ items }) => {
//   const dispatch = useDispatch()
//   const sidebarShow = useSelector((state) => state.sidebar.sidebarShow)
//   const unfoldable = useSelector((state) => state.sidebar.Unfoldable)
//   console.log(sidebarShow,'ddd')
//   console.log(unfoldable,'ssss')
//   // Utility function to create the navigation link structure
//   const navLink = (name, icon, badge, indent = false) => (
//     <>
//       {icon
//         ? icon
//         : indent && (
//             <span className="nav-icon">
//               <span className="nav-icon-bullet"></span>
//             </span>
//           )}
//       {name}
//       {badge && (
//         <CBadge color={badge.color} className="ms-auto">
//           {badge.text}
//         </CBadge>
//       )}
//     </>
//   )

//   // Function to create individual navigation items
//   const navItem = (item, index, indent = false) => {
//     const { component: Component, name, badge, icon, ...rest } = item
//     return (
//       <Component as="div" key={index}>
//         {rest.to || rest.href ? (
//           <CNavLink {...(rest.to && { as: NavLink })} {...rest}>
//             {navLink(name, icon, badge, indent)}
//           </CNavLink>
//         ) : (
//           navLink(name, icon, badge, indent)
//         )}
//       </Component>
//     )
//   }

//   const [searchTerm, setSearchTerm] = useState('')
//   const navGroup = (item, index) => {
//     const { component: Component, name, icon, items: subItems, ...rest } = item
//     const filteredSubItems = subItems?.filter((subItem) =>
//       subItem.name.toLowerCase().includes(searchTerm.toLowerCase()),
//     )
//     return (
//       <Component compact as="div" key={index} {...rest}>
//         <div className="nav-search me-3 d-none d-md-block ml-2">
//           <input
//             type="text"
//             placeholder="🔍 Search here..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="sidebar-search-input"
//             style={{
//               margin: '10px',
//               height: '40px', // Ensure consistent height
//               padding: '8px 12px',
//               fontSize: '16px',
//               borderRadius: '20px', // Fully rounded corners
//               border: '1px solid rgba(255, 255, 255, 0.3)', // Subtle border color
//               backgroundColor: 'rgba(255, 255, 255, 0.1)', // Transparent effect
//               color: 'white', // White text
//               boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Soft shadow
//               outline: 'none', // Remove default outline
//               transition: 'box-shadow 0.3s ease, border 0.3s ease', // Smooth hover effect
//             }}
//             onFocus={(e) =>
//               // e.target.style.boxShadow = "0 4px 12px rgba(0, 255, 255, 0.6)" // Add glow on focus
//               (e.target.style.boxShadow = '0 4px 12px rgba(250, 254, 254, 0.6)')
//             }
//             onBlur={
//               (e) => (e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)') // Reset shadow on blur
//             }
//           />
//           <style>
//             {`
//       .sidebar-search-input::placeholder {
//         color: white !important; // Set placeholder text color to white
//       }
//     `}
//           </style>
//         </div>

//         {filteredSubItems?.map((subItem, subIndex) =>
//           subItem.items ? navGroup(subItem, subIndex) : navItem(subItem, subIndex, true),
//         )}
//       </Component>
//     )
//   }
//   // Selectors to determine which section to show
//   const { home, management, manageAttendance, manageOrder, reportManagement } = useSelector(
//     (state) => state.navbar,
//   )

//   // Filter items based on active section dashboard
//   const filterItemsForSection = (section) => {
//     console.log('Filtering for master dashboard:', section)
//     if (section === 'home') {
//       return items.filter((item) => item.name === 'Dashboard')
//     }
//     return items
//   }

//   // Filter items based on active section master
//   const filterItemsForSection1 = (section) => {
//     console.log('Filtering for master section:', section)
//     if (section === 'management') {
//       const filteredItems = items.filter((item) => item.name === 'Management')
//       console.log('Filtered items for master:', filteredItems)
//       return filteredItems
//     }
//     return items
//   }

//   // Filter items based on active section Reports
//   const filterItemsForSection2 = (section) => {
//     console.log('Filtering for reports section:', section)
//     if (section === 'manageAttendance') {
//       return items.filter((item) => item.name === 'Manage Attendance')
//     }
//     return items
//   }

//   // Filter items based on active section Expense Management
//   const filterItemsForSection3 = (section) => {
//     console.log('Filtering for Expense management section:', section)
//     if (section === 'manageOrder') {
//       return items.filter((item) => item.name === 'Manage Order')
//     }
//     return items
//   }
//   const filterItemsForSection4 = (section) => {
//     console.log('Filtering for Expense management section:', section)
//     if (section === 'reportManagement') {
//       return items.filter((item) => item.name === 'Report Management')
//     }
//     return items
//   }
//   // Render the sidebar navigation
//   return (
//     <>
//       {home && (
//         <CSidebarNav as={SimpleBar}>
//           {filterItemsForSection('home').map((item, index) =>
//             item.items ? navGroup(item, index) : navItem(item, index),
//           )}
//         </CSidebarNav>
//       )}

//       {management && (
//         <CSidebarNav as={SimpleBar}>
//           {filterItemsForSection1('management').map((item, index) =>
//             item.items ? navGroup(item, index) : navItem(item, index),
//           )}
//         </CSidebarNav>
//       )}

//       {manageAttendance && (
//         <CSidebarNav as={SimpleBar}>
//           {filterItemsForSection2('manageAttendance').map((item, index) =>
//             item.items ? navGroup(item, index) : navItem(item, index),
//           )}
//         </CSidebarNav>
//       )}

//       {manageOrder && (
//         <CSidebarNav as={SimpleBar}>
//           {filterItemsForSection3('manageOrder').map((item, index) =>
//             item.items ? navGroup(item, index) : navItem(item, index),
//           )}
//         </CSidebarNav>
//       )}

//       {reportManagement && (
//         <CSidebarNav as={SimpleBar}>
//           {filterItemsForSection4('reportManagement').map((item, index) =>
//             item.items ? navGroup(item, index) : navItem(item, index),
//           )}
//         </CSidebarNav>
//       )}
//     </>
//   )
// }

// AppSidebarNav.propTypes = {
//   items: PropTypes.arrayOf(PropTypes.any).isRequired,
// }


import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'
import { useSelector } from 'react-redux'
import { CBadge, CNavLink, CSidebarNav } from '@coreui/react'
import { useDispatch } from 'react-redux';



export const AppSidebarNav = ({ items }) => {
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebar.sidebarShow)
  const unfoldable = useSelector((state) => state.sidebar.Unfoldable)
  console.log(sidebarShow,'ddd')
  console.log(unfoldable,'ssss')
  // Utility function to create the navigation link structure
  const navLink = (name, icon, badge, indent = false) => (
    <>
      {icon
        ? icon
        : indent && (
            <span className="nav-icon">
              <span className="nav-icon-bullet"></span>
            </span>
          )}
      {name}
      {badge && (
        <CBadge color={badge.color} className="ms-auto">
          {badge.text}
        </CBadge>
      )}
    </>
  )

  // Function to create individual navigation items
  const navItem = (item, index, indent = false) => {
    const { component: Component, name, badge, icon, ...rest } = item
    return (
      <Component as="div" key={index}>
        {rest.to || rest.href ? (
          <CNavLink {...(rest.to && { as: NavLink })} {...rest}>
            {navLink(name, icon, badge, indent)}
          </CNavLink>
        ) : (
          navLink(name, icon, badge, indent)
        )}
      </Component>
    )
  }

  const [searchTerm, setSearchTerm] = useState('')
  const navGroup = (item, index) => {
    const { component: Component, name, icon, items: subItems, ...rest } = item
    const filteredSubItems = subItems?.filter((subItem) =>
      subItem.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    return (
      <Component compact as="div" key={index} {...rest}>
        <div className="nav-search me-3 d-none d-md-block ml-2">
          <input
            type="text"
            placeholder="🔍 Search here..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="sidebar-search-input"
            style={{
              margin: '10px',
              height: '40px', // Ensure consistent height
              padding: '8px 12px',
              fontSize: '16px',
              borderRadius: '20px', // Fully rounded corners
              border: '1px solid rgba(255, 255, 255, 0.3)', // Subtle border color
              backgroundColor: 'rgba(255, 255, 255, 0.1)', // Transparent effect
              color: 'white', // White text
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Soft shadow
              outline: 'none', // Remove default outline
              transition: 'box-shadow 0.3s ease, border 0.3s ease', // Smooth hover effect
            }}
            onFocus={(e) =>
              //  e.target.style.boxShadow = "0 4px 12px rgba(0, 255, 255, 0.6)" // Add glow on focus
               (e.target.style.boxShadow = '0 4px 12px rgba(250, 254, 254, 0.6)')
            }
            onBlur={
              (e) => (e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)') // Reset shadow on blur
            }
          />
          <style>
            {`
      .sidebar-search-input::placeholder {
        color: white !important; // Set placeholder text color to white
      }
    `}
          </style>
        </div>

        {filteredSubItems?.map((subItem, subIndex) =>
          subItem.items ? navGroup(subItem, subIndex) : navItem(subItem, subIndex, true),
        )}
      </Component>
    )
  }
  // Selectors to determine which section to show
  const { home, management, manageAttendance, manageOrder, reportManagement } = useSelector(
    (state) => state.navbar,
  )

  // Filter items based on active section dashboard
  const filterItemsForSection = (section) => {
    console.log('Filtering for master dashboard:', section)
    if (section === 'home') {
      return items.filter((item) => item.name === 'Dashboard')
    }
    return items
  }

  // Filter items based on active section master
  const filterItemsForSection1 = (section) => {
    console.log('Filtering for master section:', section)
    if (section === 'management') {
      const filteredItems = items.filter((item) => item.name === 'Management')
      console.log('Filtered items for master:', filteredItems)
      return filteredItems
    }
    return items
  }

  // Filter items based on active section Reports
  const filterItemsForSection2 = (section) => {
    console.log('Filtering for reports section:', section)
    if (section === 'manageAttendance') {
      return items.filter((item) => item.name === 'Manage Attendance')
    }
    return items
  }

  // Filter items based on active section Expense Management
  const filterItemsForSection3 = (section) => {
    console.log('Filtering for Expense management section:', section)
    if (section === 'manageOrder') {
      return items.filter((item) => item.name === 'Manage Order')
    }
    return items
  }
  const filterItemsForSection4 = (section) => {
    console.log('Filtering for Expense management section:', section)
    if (section === 'reportManagement') {
      return items.filter((item) => item.name === 'Report Management')
    }
    return items
  }
  // Render the sidebar navigation
  return (
    <>
      {home && (
        <CSidebarNav as={SimpleBar}>
          {filterItemsForSection('home').map((item, index) =>
            item.items ? navGroup(item, index) : navItem(item, index),
          )}
        </CSidebarNav>
      )}

      {management && (
        <CSidebarNav as={SimpleBar}>
          {filterItemsForSection1('management').map((item, index) =>
            item.items ? navGroup(item, index) : navItem(item, index),
          )}
        </CSidebarNav>
      )}

      {manageAttendance && (
        <CSidebarNav as={SimpleBar}>
          {filterItemsForSection2('manageAttendance').map((item, index) =>
            item.items ? navGroup(item, index) : navItem(item, index),
          )}
        </CSidebarNav>
      )}

      {manageOrder && (
        <CSidebarNav as={SimpleBar}>
          {filterItemsForSection3('manageOrder').map((item, index) =>
            item.items ? navGroup(item, index) : navItem(item, index),
          )}
        </CSidebarNav>
      )}

      {reportManagement && (
        <CSidebarNav as={SimpleBar}>
          {filterItemsForSection4('reportManagement').map((item, index) =>
            item.items ? navGroup(item, index) : navItem(item, index),
          )}
        </CSidebarNav>
      )}
    </>
  )
}

AppSidebarNav.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
}
