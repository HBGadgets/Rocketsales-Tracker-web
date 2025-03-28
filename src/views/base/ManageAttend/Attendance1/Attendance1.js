import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import {
  TableContainer,
  Paper,
  IconButton,
  Dialog,
  DialogContent,
  Typography,
  Button,
  InputBase,
  Modal,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from '@mui/material'
import { RiEdit2Fill } from 'react-icons/ri'
import { AiFillDelete } from 'react-icons/ai'
import {
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
  CFormSelect,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import TablePagination from '@mui/material/TablePagination'
import { useNavigate } from 'react-router-dom'
import Loader from '../../../../components/Loader/Loader'
import CloseIcon from '@mui/icons-material/Close'
import { MdConnectWithoutContact } from 'react-icons/md'
import { AiOutlineUpload } from 'react-icons/ai'
import ReactPaginate from 'react-paginate'
import Cookies from 'js-cookie'
import { IoMdAdd } from 'react-icons/io'
import toast, { Toaster } from 'react-hot-toast'
import * as XLSX from 'xlsx' // For Excel export
import jsPDF from 'jspdf' // For PDF export
import 'jspdf-autotable' // For table formatting in PDF
import CIcon from '@coreui/icons-react'
import GroupIcon from '@mui/icons-material/Group'
import { cilSettings } from '@coreui/icons'
import '../../../../../src/app.css'
import { COLUMNS } from './columns'
import { StyledTablePagination } from '../../../../views/PaginationCssFile/TablePaginationStyles'
// import { FaBriefcase   } from 'react-icons/fa';
import { BsFillPersonCheckFill } from 'react-icons/bs'
import '../../ReusablecodeforTable/styles.css'
import ExcelJS from 'exceljs'
import PDFExporter from '../../ReusablecodeforTable/PDFExporter'
import ExcelExporter from '../../ReusablecodeforTable/ExcelExporter'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import emptyimage from '../../images/emptyimage.jpg'
import debounce from 'lodash.debounce'
import { number } from 'prop-types'
import myGif from "../../ReusablecodeforTable/loadergif.gif"
// import { String } from 'core-js/shim'
// import { DialogContent } from "@mui/material";
// import { useNavigate } from 'react-router-dom';
const Attendance1 = () => {
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  const [pageCount, setPageCount] = useState()
  // const handleEditModalClose = () => setEditModalOpen(false)
  // const handleAddModalClose = () => setAddModalOpen(false)
  const [filteredData, setFilteredData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(25)
  const columns = COLUMNS()
  const [sortedData, setSortedData] = useState([])
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [selectedPeriod, setSelectedPeriod] = useState('today')
  const [showCustomDates, setShowCustomDates] = useState(false)
  const [sortBy, setSortBy] = useState('')
  const [sortOrder, setSortOrder] = useState('asc')
  const navigate = useNavigate()

  const styles = {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      gap: '17px',
    },
    inputGroup: {
      marginRight: '10px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    label: {
      display: 'block',
      fontWeight: 'bold',
      fontSize: '14px',
    },
    input: {
      width: '120px',
      padding: '8px',
      fontSize: '14px',
      borderRadius: '4px',
      border: '1px solid #ccc',
    },
    select: {
      padding: '8px',
      fontSize: '14px',
      borderRadius: '4px',
      border: '1px solid #ccc',
    },
    button: {
      padding: '7px 15px',
      fontSize: '16px',
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      // marginBottom: '16px',
      position: 'relative',
    },
    label: {
      fontSize: '12px',
      fontWeight: '500',
      color: 'grey', // White color for the label
      position: 'absolute',
      top: '-10px',
      left: '12px',
      background: '#f3f4f7', // Match background color
      padding: '0 4px',
      zIndex: 1,
    },
    input: {
      padding: '8px 2px',
      borderRadius: '6px',
      border: '1px solid #444', // Border color matching the dark theme
      // background: '#2b2b2b', // Input background color
      color: 'black', // White text for input
      fontSize: '14px',
      width: '136px',
    },
  }
  const formatToUTCString = (dateString) => {
    if (!dateString) return ''
    return `${dateString}:00.000Z` // Keeps the entered time and adds `.000Z`
  }

  const handlePeriodChange = (e) => {
    const value = e.target.value
    setSelectedPeriod(value)
    if (value === 'Custom') {
      setShowCustomDates(true)
    } else {
      setShowCustomDates(false)
    }
  }
  const handleApply = () => {
    const formattedStartDate = formatToUTCString(startDate)
    const formattedEndDate = formatToUTCString(endDate)
    // alert(`Start Date: ${formattedStartDate}, End Date: ${formattedEndDate}`)
    console.log(`Start Date: ${formattedStartDate}, End Date: ${formattedEndDate}`)
    fetchData(formattedStartDate, formattedEndDate, selectedPeriod)
  }

  const style = {
    position: 'absolute',
    top: '50%',
    borderRadius: '10px',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '35%',
    maxHeight: '90vh',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    overflowY: 'auto', // Enable vertical scrolling
    display: 'flex',
    flexDirection: 'column',
    padding: '1rem',
    marginTop: '8px',
  }

  const fetchData = async (startDate, endDate, selectedPeriod, page = 1) => {
    setLoading(true)
    const accessToken = Cookies.get('token')
    let url
    console.log(selectedPeriod)
    if (selectedPeriod && selectedPeriod !== 'Custom') {
      // If the period is not custom, pass the period as a filter
      url = `${import.meta.env.VITE_SERVER_URL}/api/attendence?filter=${selectedPeriod}`
    } else if (startDate && endDate) {
      // For "Custom" date range, pass the startDate and endDate as query params
      url = `${import.meta.env.VITE_SERVER_URL}/api/attendence?startDate=${startDate}&endDate=${endDate}`
    } else {
      // If "Custom" is selected but no dates are provided, just fetch all data
      url = `${import.meta.env.VITE_SERVER_URL}/api/attendence`
    }
    console.log('my url', url)
    console.log('Access Token:', accessToken)
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      })
      console.log('Response:', response.data)
      if (response.data) {
        // Filter the data based on the search query if it is not empty
        const filteredData = response.data.data
          .map((item) => ({
            ...item,
            createdAt: item.createdAt ? formatDate(item.createdAt) : null,
            salesmanName: item.salesmanId ? item.salesmanId.salesmanName : null,
            companyName: item.companyId ? item.companyId.companyName : 'N/A',
            branchName: item.branchId ? item.branchId.branchName : 'N/A',
            supervisorName: item.supervisorId ? item.supervisorId.supervisorName : null,
          }))
          .filter((item) =>
            Object.values(item).some((value) =>
              value.toString().toLowerCase().includes(searchQuery.toLowerCase()),
            ),
          )

        setData(filteredData) // Set the filtered data to `data`
        setSortedData(filteredData) // Set the filtered data to `sortedData`
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
      console.error('Error fetching data:', error)
      throw error // Re-throw the error for further handling if needed
    }
  }

  // Format the date into DD-MM-YYYY format
  function formatDate(date) {
    const d = new Date(date)
    const day = String(d.getDate()).padStart(2, '0') // Add leading zero if single digit
    const month = String(d.getMonth() + 1).padStart(2, '0') // Add leading zero to month
    const year = d.getFullYear()
    return `${day}-${month}-${year}`
  }

  // Example: parsing the formatted date string back to a Date object if needed
  function parseDate(dateString) {
    const [day, month, year] = dateString.split('-').map(Number)
    return new Date(year, month - 1, day)
  }
  useEffect(() => {
    fetchData(formatToUTCString(startDate), formatToUTCString(endDate), selectedPeriod)
  }, [])
  // useEffect(() => {
  //   setLoading(true)
  //   // fetchData() // Refetch data when searchQuery changes
  //   fetchData(formatToUTCString(startDate), formatToUTCString(endDate), selectedPeriod)
  // }, [searchQuery]) // Dependency array ensures the effect runs whenever searchQuery changes

  // ##################### Filter data by search query #######################
  const filterGroups = () => {
    if (!searchQuery) {
      setFilteredData(data) // No query, show all drivers
    } else {
      const filtered = data.filter((group) =>
        group.salesmanName.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredData(filtered)
      setCurrentPage(1)
    }
  }
  // Debounced filtering function
  const debouncedFilter = useCallback(
    debounce((query, sourceData) => {
      if (!query) {
        setFilteredData(sourceData)
        return
      }
      // const filtered = sourceData.filter(item =>
      //   Object.values(item).some(value =>
      //     value?.toString().toLowerCase().includes(query.toLowerCase())
      //   )
      // );
      const filtered = sourceData.filter((item) =>
        Object.entries(item).some(([key, value]) => {
          if (key === 'profileImgUrl') return false // Skip searching the profileImage field
          return value?.toString().toLowerCase().includes(query.toLowerCase())
        }),
      )

      setFilteredData(filtered)
    }, 500),
    [],
  )
  // Handle search input changes
  const handleSearchChange = (e) => {
    const query = e.target.value
    setSearchQuery(query)
    debouncedFilter(query, data)
  }

  // Cancel debounce on component unmount
  useEffect(() => {
    return () => debouncedFilter.cancel()
  }, [debouncedFilter])
  useEffect(() => {
    setFilteredData(data)
  }, [data])
  // useEffect(() => {
  //   filterGroups(searchQuery)
  // }, [data, searchQuery])

  const handlePageClick = (e) => {
    console.log(e.selected + 1)
    let page = e.selected + 1
    setCurrentPage(page)
    setLoading(true)
    fetchData(page)
  }

  // ###################################################################
  // ######################### Edit Group #########################
  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10)
    setRowsPerPage(newRowsPerPage === -1 ? sortedData.length : newRowsPerPage) // Set to all rows if -1
    setPage(0) // Reset to the first page
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const exportToExcel = ExcelExporter({
    mytitle: 'Attendance Data Report',
    columns: COLUMNS().slice(1),
    data: filteredData.map(({ [COLUMNS()[0]?.accessor]: _, ...rest }) => rest),
    fileName: 'Attendance_data.xlsx',
  })

  const exportToPDF = PDFExporter({
    title: 'Company Data Report',
    columns: COLUMNS().slice(1),
    data: filteredData.map(({ [COLUMNS()[0]?.accessor]: _, ...rest }) => rest),
    fileName: 'Attendance_report.pdf',
  })

  const handleStatusClick = async (item) => {
    toast(
      (t) => (
        <div>
          <p>
            Do you want to change the attendance status for <b>{item.salesmanName}</b>?
          </p>
          <div
            style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}
          >
            <button
              onClick={async () => {
                toast.dismiss(t.id)

                try {
                  const updatedStatus = item.attendenceStatus === 'Absent' ? 'Present' : 'Absent'
                  const accessToken = Cookies.get('token')

                  await axios.put(
                    `${import.meta.env.VITE_SERVER_URL}/api/attendence/${item._id}`,
                    { attendenceStatus: updatedStatus },
                    { headers: { Authorization: `Bearer ${accessToken}` } },
                  )

                  // Update local state directly
                  setData((prevData) =>
                    prevData.map((d) =>
                      d._id === item._id ? { ...d, attendenceStatus: updatedStatus } : d,
                    ),
                  )
                  setFilteredData((prevFiltered) =>
                    prevFiltered.map((d) =>
                      d._id === item._id ? { ...d, attendenceStatus: updatedStatus } : d,
                    ),
                  )

                  toast.success(
                    <span>
                      Status updated to{' '}
                      <span
                        style={{
                          color: updatedStatus === 'Absent' ? 'red' : 'green',
                          fontWeight: 'bold',
                        }}
                      >
                        {updatedStatus}
                      </span>
                    </span>,
                  )
                } catch (error) {
                  toast.error('Failed to update status')
                }
              }}
              style={{
                background: '#4CAF50',
                color: 'white',
                padding: '5px 10px',
                borderRadius: '5px',
                border: 'none',
              }}
            >
              Confirm
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              style={{
                background: '#f44336',
                color: 'white',
                padding: '5px 10px',
                borderRadius: '5px',
                border: 'none',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: Infinity },
    )
  }

  // Function to handle image click
  const [isOpen, setIsOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)

  // Function to handle image click
  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl)
    setIsOpen(true)
  }

  // Function to close image popup
  const closePopup = () => {
    setIsOpen(false)
    setSelectedImage(null)
  }
const handleSort=(accessor)=>{
  if(sortBy===accessor){
    setSortOrder(sortOrder==='asc'?'desc':'asc')
  }else{
    setSortBy(accessor);
    setSortOrder('asc');
  }
}
useEffect(() => {
  if (sortBy) {
    const sorted = [...filteredData].sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      // Handle different data types
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      // Handle dates
      if (aValue instanceof Date && bValue instanceof Date) {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      // Default string comparison
      return sortOrder === 'asc' 
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });

    setSortedData(sorted);
  } else {
    setSortedData(filteredData);
  }
}, [filteredData, sortBy, sortOrder]);
  return (
    <div className="d-flex flex-column mx-md-3 mt-3 h-auto">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="d-flex justify-content-between mb-2">
        <div style={{ display: 'flex', gap: '42px' }}>
          <div>
            <h2
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: '#4c637c',
                fontWeight: '600',
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              <BsFillPersonCheckFill style={{ fontSize: '24px', color: '#4c637c' }} />
              Attendance
            </h2>
          </div>

          <div style={styles.container}>
            <div style={styles.inputGroup}>
              <label htmlFor="period" style={styles.label}>
                Period:
              </label>
              <select
                id="period"
                value={selectedPeriod}
                onChange={handlePeriodChange}
                style={styles.select}
              >
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="thisWeek">This Week</option>
                <option value="lastWeek">Previous Week</option>
                <option value="thisMonth">This Month</option>
                <option value="preMonth">Previous Month</option>
                <option value="Custom">Custom</option>
              </select>
            </div>

            {showCustomDates && (
              <>
                <div style={styles.inputGroup}>
                  <label htmlFor="startDate" style={styles.label}>
                    From
                  </label>
                  <input
                    type="datetime-local"
                    id="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    style={styles.input}
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label htmlFor="endDate" style={styles.label}>
                    To
                  </label>
                  <input
                    type="datetime-local"
                    id="endDate"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    style={styles.input}
                  />
                </div>
              </>
            )}

            <button onClick={handleApply} style={styles.button}>
              Apply
            </button>
          </div>
        </div>

        <div className="d-flex align-items-center">
          <div className="me-3 d-none d-md-block">
            <input
              type="search"
              className="form-control"
              placeholder="🔍 Search here..."
              value={searchQuery}
              // onChange={(e) => setSearchQuery(e.target.value)}
              onChange={handleSearchChange}
              style={{
                height: '40px', // Ensure consistent height
                padding: '8px 12px',
                fontSize: '16px',
                borderRadius: '8px',
                border: '1px solid #ccc',
              }}
            />
          </div>

          {/* Settings Dropdown */}

          {/* Add Button */}
          <div
            className="add-container d-flex align-items-center"
            onClick={() => navigate('/manual-attendance')}
          >
            <div className="add-icon">+</div>
            <span className="add-text ms-2">Manual Attendance</span>
          </div>
          <CDropdown className="position-relative me-3">
            <CDropdownToggle
              color="secondary"
              style={{
                borderRadius: '50%',
                padding: '10px',
                height: '48px',
                width: '48px',
                marginLeft: '12px',
              }}
            >
              <CIcon icon={cilSettings} />
            </CDropdownToggle>
            <CDropdownMenu>
              {/* <CDropdownItem onClick={exportToPDF}>PDF</CDropdownItem> */}
              <CDropdownItem onClick={exportToPDF}>PDF</CDropdownItem>

              <CDropdownItem onClick={exportToExcel}>Excel</CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
        </div>
      </div>
      <div className="d-md-none mb-2">
        <input
          type="search"
          className="form-control"
          placeholder="search here..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <TableContainer
        component={Paper}
        sx={{
          height: 'auto',
          overflowX: 'auto',
        }}
      >
        <CTable
          style={{
            fontFamily: 'Roboto, sans-serif',
            fontSize: '14px',
            borderCollapse: 'collapse',
            width: '100%',
            border: '1px solid #e0e0e0', // Light border
          }}
          bordered
          align="middle"
          className="mb-2"
          hover
          responsive
        >
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell
                className="text-center"
                style={{
                  backgroundColor: '#1d3d5f',
                  padding: '5px 12px', // Reduced padding for top and bottom
                  borderBottom: '1px solid #e0e0e0', // Light border under headers
                  textAlign: 'center', // Center header text
                  verticalAlign: 'middle',
                  color: 'white',
                }}
              >
                SN
              </CTableHeaderCell>
              {columns.map((col) => (
                <CTableHeaderCell
                  key={col.accessor}
                  className="text-center"
                  style={{
                    padding: '5px 12px', // Reduced padding for top and bottom
                    borderBottom: '1px solid #e0e0e0', // Light border under headers
                    textAlign: 'center', // Center header text
                    verticalAlign: 'middle',
                    backgroundColor: '#1d3d5f',
                    color: 'white',
                  }}
                  onClick={()=>handleSort(col.accessor)}
                >
                  {sortBy===col.accessor && (
                    <span style={{ marginLeft: '5px' }}>
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                  {col.Header}
                </CTableHeaderCell>
              ))}
            </CTableRow>
          </CTableHead>

          <CTableBody>
            {loading ? (
              <CTableRow>
                <CTableDataCell
                  colSpan={columns.length + 2}
                  className="text-center"
                  style={{
                    padding: '20px 0',
                    fontSize: '16px',
                    color: '#999',
                  }}
                >
                  <img src={myGif} alt="Animated GIF" width="100" />
                </CTableDataCell>
              </CTableRow>
            ) : sortedData.length > 0 ? (
              sortedData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item, index) => (
                  <CTableRow
                    key={index}
                    style={{
                      backgroundColor: index % 2 === 0 ? 'transparent' : '#f1f8fd', // Grey for even rows, transparent for odd rows
                      transition: 'background-color 0.3s ease',
                      borderBottom: '1px solid #e0e0e0',
                    }}
                    hover
                  >
                    <CTableDataCell
                      className="text-center"
                      style={{
                        padding: '0px 12px',
                        color: '#242424',
                        fontSize: '13px',
                        backgroundColor: index % 2 === 0 ? 'transparent' : '#f1f8fd',
                      }}
                    >
                      {index + 1}
                    </CTableDataCell>

                    {columns.map((col) => (
                      <CTableDataCell
                        key={col.accessor}
                        className="text-center"
                        style={{
                          padding: '0px 12px',
                          color: '#242424',
                          fontSize: '13px',
                          backgroundColor: index % 2 === 0 ? 'transparent' : '#f1f8fd',
                        }}
                      >
                        {col.accessor === 'attendenceStatus' ? (
                          <button
                            style={{
                              padding: '6px 12px',
                              backgroundColor: item[col.accessor] === 'Absent' ? 'red' : 'green',
                              color: 'white',
                              border: 'none',
                              borderRadius: '5px',
                              cursor: 'pointer',
                              fontSize: '13px',
                            }}
                            onClick={() => handleStatusClick(item)}
                          >
                            {item[col.accessor]}
                          </button>
                        ) : col.accessor === 'profileImgUrl' ? (
                          item[col.accessor] ? (
                            <img
                              src={`data:image/png;base64,${item[col.accessor]}`}
                              alt="Profile"
                              style={{
                                width: '80px',
                                height: '80px',
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
                                  width: '80px',
                                  height: '80px',
                                  borderRadius: '50%',
                                  padding: '9px',
                                }}
                                onClick={() => handleImageClick(`${emptyimage}`)}
                              />
                            </div>
                          )
                        ) : (
                          item[col.accessor] || '--'
                        )}

                        {/* Custom Image Popup */}
                        {isOpen && (
                          <div
                            onClick={closePopup} // Clicking outside closes the popup
                            style={{
                              position: 'fixed',
                              top: 0,
                              left: 0,
                              width: '100vw',
                              height: '100vh',
                              backgroundColor: 'transparent',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              zIndex: 1000,
                            }}
                          >
                            <div
                              onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside
                              style={{
                                position: 'relative',
                                width: '500px',
                                height: '500px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: 'white',
                                borderRadius: '10px',
                                overflow: 'hidden',
                              }}
                            >
                              {/* Close Button */}
                              <button
                                onClick={closePopup}
                                style={{
                                  position: 'absolute',
                                  top: '10px',
                                  right: '10px',
                                  background: 'white',
                                  border: 'none',
                                  borderRadius: '50%',
                                  width: '30px',
                                  height: '30px',
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  cursor: 'pointer',
                                  boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
                                }}
                              >
                                <CloseIcon />
                              </button>

                              {/* Fixed Size Image */}
                              <img
                                src={selectedImage}
                                alt="Profile"
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </CTableDataCell>
                    ))}
                  </CTableRow>
                ))
            ) : (
              <CTableRow>
                <CTableDataCell
                  colSpan={columns.length + 2}
                  className="text-center"
                  style={{
                    padding: '20px 0',
                    fontSize: '16px',
                    color: '#999',
                  }}
                >
                  No data available
                </CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>
      </TableContainer>

      <StyledTablePagination>
        <TablePagination
          rowsPerPageOptions={[{ label: 'All', value: -1 }, 1, 10, 25, 100, 1000]}
          component="div"
          count={sortedData.length}
          rowsPerPage={rowsPerPage === sortedData.length ? -1 : rowsPerPage}
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
    </div>
  )
}

export default Attendance1
