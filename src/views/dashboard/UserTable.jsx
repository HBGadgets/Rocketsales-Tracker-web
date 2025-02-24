import React from 'react'
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CAvatar,
  CButton,
  // CIcon,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import avatar1 from 'src/assets/images/avatars/1.jpg'
import avatar2 from 'src/assets/images/avatars/2.jpg'
import avatar3 from 'src/assets/images/avatars/3.jpg'
import avatar4 from 'src/assets/images/avatars/4.jpg'
import avatar5 from 'src/assets/images/avatars/5.jpg'
import avatar6 from 'src/assets/images/avatars/6.jpg'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'
import { columns } from './columns'
import TablePagination from '@mui/material/TablePagination'
import { CSpinner } from '@coreui/react';
import {
  cibCcAmex,
  cibCcApplePay,
  cibCcMastercard,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,
  cibGoogle,
  cibFacebook,
  cibLinkedin,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifPl,
  cifUs,
  cibTwitter,
  cilCloudDownload,
  cilPeople,
  cilUser,
  cilUserFemale,
} from '@coreui/icons'
import { StyledTablePagination } from '../../views/PaginationCssFile/TablePaginationStyles'
import { Modal, Button, FormControlLabel, Checkbox } from '@mui/material'
import { io } from 'socket.io-client'
import emptyimage from '../../views/base/images/emptyimage.jpg'
import CloseIcon from '@mui/icons-material/Close'
import { useNavigate } from 'react-router-dom'
const UserTable = () => {
  const [data, setData] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(25)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()

  // const handleTrackSalesman = (salesman) => {
  //   // Temporary dummy coordinates for testing
  //   const salesmanWithDummyLocation = {
  //     ...salesman,
  //     location: {
  //       coordinates: [78.4867, 17.3850] // [longitude, latitude]
  //     }
  //   }
    
  //   navigate('/live-map', { state: { salesman: salesmanWithDummyLocation } })
  // }
  const handleTrackSalesman = (salesman) => {
    console.log("Navigating with salesman:", salesman);
    console.log("notifiacation",salesman._id);
    navigate('/live-map', { state: { salesman } });
};

  
  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10)
    setRowsPerPage(newRowsPerPage === -1 ? data.length : newRowsPerPage) // Set to full length
    setPage(0) // Reset to first page when changing rows per page
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }
  const filteredData = data.filter((item) =>
    Object.values(item).some((value) =>
      value?.toString().toLowerCase().includes(searchQuery.toLowerCase()),
    ),
  )
  const displayedData =
    rowsPerPage === -1
      ? filteredData
      : filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  const [visibleColumns, setVisibleColumns] = useState(
    columns.reduce((acc, col) => ({ ...acc, [col.accessor]: true }), {}),
  )
  const [openModal, setOpenModal] = useState(false)

  const handleColumnToggle = (accessor) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [accessor]: !prev[accessor],
    }))
  }
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '300px',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
  }
  
  const [salesmenData, setSalesmenData] = useState(null)

  const SOCKET_SERVER_URL = 'http://104.251.218.102:8080'
  useEffect(() => {
    const socket = io(SOCKET_SERVER_URL, { transports: ['websocket'] });
  
    socket.on('connect', () => {
      console.log('✅ Connected to Socket Server:', socket.id);
  
      // Listen for live salesman location updates
      socket.on('liveSalesmanData', (data) => {
        console.log('📩 Received live location data:', data);
        
        const modifiedData = data.map(item => ({
          ...item,
          _id:item._id || 'unknown',
          companyName: item.companyId?.companyName || 'Unknown',
          branchName: item.branchId?.branchName || 'Unknown',
          supervisorName: item.supervisorId?.supervisorName || 'Unknown',
        }));
  console.log("modifiedData",modifiedData)
        setData(modifiedData);
        setLoading(false); // Data received, stop loading
      });
    });
  
    socket.on('disconnect', (reason) => {
      console.log('❌ Disconnected from server:', reason);
    });
  
    return () => {
      socket.disconnect();
    };
  }, []);
  
  const [isOpen, setIsOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl)
    setIsOpen(true)
  }
  const closePopup = () => {
    setIsOpen(false)
    setSelectedImage(null)
  }
  return (
    <>
      <div className="nav-search me-3 d-none d-md-flex ml-2 justify-content-end align-items-center">
 
        <Button
          variant="contained"
          size="small" // Makes the button smaller
          onClick={() => setOpenModal(true)}
          style={{
            backgroundColor: '#1d3d5f',
            color: 'white', // Ensures text is visible
            padding: '9px 10px',
            fontSize: '12px',
            borderRadius: '17px',
          }}
        >
          Manage Columns
        </Button>
        <input
          type="text"
          placeholder="🔍 Search here..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="sidebar-search-input"
          style={{
            margin: '10px',
            height: '40px',
            padding: '8px 12px',
            fontSize: '16px',
            borderRadius: '20px',
            border: '1px solid rgba(0, 0, 0, 0.3)', // Slightly darker border
            backgroundColor: 'rgba(255, 255, 255, 0.9)', // More visible white
            color: '#333', // Darker text for contrast
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)', // Soft shadow for depth
            outline: 'none',
            transition: 'box-shadow 0.3s ease, border 0.3s ease',
          }}
          onFocus={
            (e) => (e.target.style.boxShadow = '0 4px 12px rgba(23, 55, 90, 0.4)') // Blue glow on focus
          }
          onBlur={
            (e) => (e.target.style.boxShadow = '0 4px 8px rgba(116, 80, 80, 0.15)') // Reset shadow
          }
        />
        <style>
          {`
      .sidebar-search-input::placeholder {
        color: rgba(0, 0, 0, 0.5) !important; // Darker placeholder for contrast
      }
    `}
        </style>
      </div>

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <div style={modalStyle}>
          <h3>Manage Columns</h3>
          {columns.map((col) => (
            <FormControlLabel
              key={col.accessor}
              control={
                <Checkbox
                  checked={visibleColumns[col.accessor]}
                  onChange={() => handleColumnToggle(col.accessor)}
                />
              }
              label={col.Header}
            />
          ))}
          <div style={{ marginTop: '10px', textAlign: 'right' }}>
            <Button
              onClick={() => setOpenModal(false)}
              variant="contained"
              sx={{ backgroundColor: '#1d3d5f', '&:hover': { backgroundColor: '#162c46' } }}
            >
              Done
            </Button>
          </div>
        </div>
      </Modal>
      <div>
        <CTable
          style={{
            fontFamily: 'Roboto, sans-serif',
            fontSize: '14px',
            borderCollapse: 'collapse',
            width: '100%',
            border: '1px solid #e0e0e0',
          }}
          align="middle"
          className="mb-0 border"
          hover
          responsive
        >
          {/* Table Header */}
          <CTableHead>
            <CTableRow>
              {columns
                .filter((col) => visibleColumns[col.accessor])
                .map((col) => (
                  <CTableHeaderCell
                    key={col.accessor}
                    style={{
                      backgroundColor: '#1d3d5f',
                      color: 'white',
                      padding: '10px 12px',
                      textAlign: 'center',
                      verticalAlign: 'middle',
                      borderBottom: '1px solid #e0e0e0',
                    }}
                  >
                    {col.Header}
                  </CTableHeaderCell>
                
                ))}
                <CTableHeaderCell
                    
                    style={{
                      backgroundColor: '#1d3d5f',
                      color: 'white',
                      padding: '10px 12px',
                      textAlign: 'center',
                      verticalAlign: 'middle',
                      borderBottom: '1px solid #e0e0e0',
                    }}
                  >
                    Track Salesman
                  </CTableHeaderCell>
            </CTableRow>
          </CTableHead>

          {/* Table Body */}
          <CTableBody>
  {loading ? (
    // Show Loader
    <CTableRow>
      <CTableDataCell colSpan={columns.length} style={{ textAlign: 'center', padding: '20px' }}>
        <CSpinner color="primary" />
      </CTableDataCell>
    </CTableRow>
  ) : displayedData.length > 0 ? (
    displayedData.map((item, index) => (
      <CTableRow
        key={index}
        style={{
          backgroundColor: index % 2 === 0 ? 'transparent' : '#f1f8fd',
          transition: 'background-color 0.3s ease',
          borderBottom: '1px solid #e0e0e0',
        }}
        hover
      >
        {columns
          .filter((col) => visibleColumns[col.accessor])
          .map((col) => (
            <CTableDataCell
              key={col.accessor}
              style={{
                padding: '8px 12px',
                color: '#242424',
                fontSize: '13px',
                textAlign: 'center',
                backgroundColor: index % 2 === 0 ? 'transparent' : '#f1f8fd',
              }}
            >
              {col.accessor === 'profileImage' ? (
                item[col.accessor] ? (
                  <img
                    src={`data:image/png;base64,${item[col.accessor]}`}
                    alt="Profile"
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      padding: '9px',
                      cursor: 'pointer',
                    }}
                    onClick={() =>
                      handleImageClick(`data:image/png;base64,${item[col.accessor]}`)
                    }
                  />
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    <img
                      src={emptyimage}
                      alt="Empty"
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        padding: '9px',
                      }}
                      onClick={() => handleImageClick(emptyimage)}
                    />
                  </div>
                )
              ) : col.accessor === 'createdAt' ? (
                item[col.accessor] ? new Date(item[col.accessor]).toLocaleDateString() : 'N/A'
              ) : (
                item[col.accessor] || 'N/A'
              )}        {isOpen && (
                <div
                  onClick={closePopup} // Clicking outside closes the popup
                  style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    backgroundColor: "transparent",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 1000,
                  }}
                >
                  <div
                    onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside
                    style={{
                      position: "relative",
                      width: "500px",
                      height: "500px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "white",
                      borderRadius: "10px",
                      overflow: "hidden",
                    }}
                  >
                    {/* Close Button */}
                    <button
                      onClick={closePopup}
                      style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        background: "white",
                        border: "none",
                        borderRadius: "50%",
                        width: "30px",
                        height: "30px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: "pointer",
                        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
                      }}
                    >
                      <CloseIcon />
                    </button>
        
                    {/* Fixed Size Image */}
                    <img
                      src={selectedImage}
                      alt="Profile"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                </div>
              )}
                              </CTableDataCell>
                            ))}

           

        {/* Track Salesman Button */}
        <CTableDataCell
          style={{
            padding: '8px 12px',
            textAlign: 'center',
            backgroundColor: index % 2 === 0 ? 'transparent' : '#f1f8fd',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CButton
  style={{
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    fontSize: '13px',
    cursor: 'pointer',
  }}
  size="sm"
  onClick={() => handleTrackSalesman(item)}
>
  Track Salesman
</CButton>
        </CTableDataCell>
      </CTableRow>
    ))
  ) : (
    // No Data Available Message
    <CTableRow>
      <CTableDataCell colSpan={columns.length} style={{ textAlign: 'center', padding: '20px' }}>
        No data available
      </CTableDataCell>
    </CTableRow>
  )}
</CTableBody>
        </CTable>
      </div>
      <StyledTablePagination>
        <TablePagination
          rowsPerPageOptions={[{ label: 'All', value: -1 }, 1, 10, 25, 100, 1000]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage === data.length ? -1 : rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => {
            console.log('Page changed:', newPage)
            handleChangePage(event, newPage)
          }}
          onRowsPerPageChange={(event) => {
            console.log('Rows per page changed:', event.target.value)
            handleChangeRowsPerPage(event)
          }}
        />
      </StyledTablePagination>
    </>
  )
}

export default UserTable
