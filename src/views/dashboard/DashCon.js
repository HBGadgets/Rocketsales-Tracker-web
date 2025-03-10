import React from 'react'
import {  
  CCard, 
  CCardBody, 
  CCardHeader, 
  CCol, 
  CRow 
} from '@coreui/react'

import WidgetsBrand from '../widgets/WidgetsBrand'
import WidgetsDropdown from '../widgets/WidgetsDropdown'
import MainMap from '../Map/MapComponent'
import UserTable from './UserTable'
import TraficAndSales from './TraficAndSales'
import Progress from './Progress'
import "./styledash.css"
import CardContainerCount from './CardContainerCount'
import SalesmanCard from './dashboardCard/SalesmanCard'
const Dashboard = () => {
  return (
    <>
      <CCard className="mb-4">
        <CCardBody className="content">
          <CRow>
            <CCol sm={7} className="d-none d-md-block"></CCol>
          </CRow>
          <MainMap />
        </CCardBody>
        <Progress />
      </CCard>

      {/* <CardContainerCount className="mb-4" /> */}

      {/* <WidgetsBrand className="mb-4" withCharts /> */}

      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            {/* <CCardHeader>Traffic & Sales</CCardHeader> */}
            <CCardBody>
              {/* <TraficAndSales /> */}
              <br />
              <UserTable />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
