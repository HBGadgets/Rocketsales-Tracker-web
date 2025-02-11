import React, { useState, useEffect } from 'react'
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
import { FaThumbsDown } from 'react-icons/fa';
import { CTooltip } from '@coreui/react';

// import { useNavigate } from 'react-router-dom';
const DeniedRequest = () => {
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
    setLoading(true);
    const accessToken = Cookies.get('token');
    let url;
    console.log(selectedPeriod);
  
    if (selectedPeriod && selectedPeriod !== 'Custom') {
      // If the period is not custom, pass the period as a filter
      url = `${import.meta.env.VITE_SERVER_URL}/api/leaverequest?status=Reject&filter=${selectedPeriod}`;
    } else if (startDate && endDate) {
      // For "Custom" date range, pass the startDate and endDate as query params
      url = `${import.meta.env.VITE_SERVER_URL}/api/leaverequest?status=Reject&startDate=${startDate}&endDate=${endDate}`;
    } else {
      // If "Custom" is selected but no dates are provided, just fetch all data
      url = `${import.meta.env.VITE_SERVER_URL}/api/leaverequest?status=Reject`;
    }
  
    console.log('my url', url);
    console.log('Access Token:', accessToken);
  
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      });
      console.log('Response:', response.data);
  
      if (response.data.success) {
        // Extract and map over the data
        const formattedData = response.data.data
          .map((item) => ({
            ...item,
            createdAt: item.createdAt ? formatDate(item.createdAt) : null,
            updatedAt: item.updatedAt ? formatDate(item.updatedAt) : null,
            salesmanName: item.salesmanId ? item.salesmanId.salesmanName : null,
            companyName: item.companyId ? item.companyId.companyName : null,
            branchName: item.branchId ? item.branchId.branchName : null,
            supervisorName: item.supervisorId ? item.supervisorId.supervisorName : null,
          }))
          .filter((item) =>
            Object.values(item).some((value) =>
              value.toString().toLowerCase().includes(searchQuery.toLowerCase()),
            ),
          );
  
        setData(formattedData); // Set the formatted data to `data`
        setSortedData(formattedData); // Set the formatted data to `sortedData`
        setLoading(false);
      } else {
        // Handle case when success is false
        console.error('Error: ' + response.data.message);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error fetching data:', error);
      throw error; // Re-throw the error for further handling if needed
    }
  };
  

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
    setLoading(true)
    // fetchData() // Refetch data when searchQuery changes
    fetchData(formatToUTCString(startDate), formatToUTCString(endDate), selectedPeriod)
  }, [searchQuery]) // Dependency array ensures the effect runs whenever searchQuery changes

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

  useEffect(() => {
    filterGroups(searchQuery)
  }, [data, searchQuery])

  const handlePageClick = (e) => {
    console.log(e.selected + 1)
    let page = e.selected + 1
    setCurrentPage(page)
    setLoading(true)
    fetchData(page)
  }


  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10)
    setRowsPerPage(newRowsPerPage === -1 ? sortedData.length : newRowsPerPage) // Set to all rows if -1
    setPage(0) // Reset to the first page
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }


  const exportToExcel = ExcelExporter({
    mytitle:'Approved Request Data',
    columns: COLUMNS(),
    data: filteredData,
    fileName: 'Rejected_Request_data.xlsx',
   
  });

const exportToPDF = PDFExporter({
  title: 'Denied Request Data',
  columns: COLUMNS(),
  data: filteredData,
  fileName: 'Rejected_Request_report.pdf',
});
 
  
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
              <FaThumbsDown style={{ fontSize: '24px', color: '#4c637c' }} />
              Rejected
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
              onChange={(e) => setSearchQuery(e.target.value)}
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
                >
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
        Loading...
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
              padding: '12px',
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
                padding: '12px',
                color: '#242424',
                fontSize: '13px',
                backgroundColor: index % 2 === 0 ? 'transparent' : '#f1f8fd',
              }}
            >
              {col.accessor === 'reason' ? (
                <CTooltip content={item[col.accessor] || '--'} placement="top">
                  <span
                    style={{
                      cursor: 'pointer',
                      textDecoration: 'underline',
                    }}
                    onClick={() => {
                      // Handle the click event here
                      // alert('Reason clicked: ' + (item[col.accessor] || '--'));
                    }}
                  >
                    {item[col.accessor]
                      ? item[col.accessor].split(' ').slice(0, 2).join(' ') + '...'
                      : '--'}
                  </span>
                </CTooltip>
              ) : (
                item[col.accessor] || '--'
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

export default DeniedRequest
