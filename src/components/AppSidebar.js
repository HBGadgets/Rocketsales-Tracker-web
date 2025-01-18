import React , { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  CCloseButton,
  CHeaderToggler,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
  CTooltip,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'

import logo from 'src/assets/brand/logo.svg'
import { sygnet } from 'src/assets/brand/sygnet'

// sidebar nav config
// import navigation from '../_nav'
import createNav from '../_nav'; 
import { useNavigate } from 'react-router-dom'
import { cilDelete, cilMenu } from '@coreui/icons'
import rocketimg from './image.png';
import "./AppSidebar.css"
const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebar.sidebarShow)
console.log(unfoldable,"k");
const [show, setShow] = useState(false);
// console.log(sidebarUnfoldable,"myyy")
  const navigate = useNavigate()
  const [navigatingNav, setNavigatingNav] = useState(null)
  const toggle = useSelector((state) => state.navbar)
 const navigation = createNav(); 
  // console.log("toggle starte",toggle)
  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={sidebarShow}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand to="/dashboard">
          <img src={logo} alt="Logo" className="sidebar-brand-full" height={45} width={200} />
          <img src={logo} alt="Logo" className="sidebar-brand-narrow" height={32} width={32} />
          {/* <CIcon customClassName="sidebar-brand-narrow" icon={rocketimg} height={32} /> */}
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: true })}
        />
      </CSidebarHeader>
      <AppSidebarNav items={navigation} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable }) ,console.log("hi") }
          
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
