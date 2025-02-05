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
  Autocomplete,
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
import jwt_decode from 'jwt-decode'
import { FiGitBranch } from 'react-icons/fi';
import BusinessIcon from '@mui/icons-material/Business';
import { FiUser } from "react-icons/fi";
import PersonIcon from '@mui/icons-material/Person';
import { CTooltip } from '@coreui/react';
// import { useNavigate } from 'react-router-dom';
const SalesmanExpenceManagement = () => {
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [formData, setFormData] = useState({ companyId: '', branchId: '', supervisorId: '' })
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
 const [branchError, setBranchError] = useState(false)
  const [pageCount, setPageCount] = useState()
  // const handleEditModalClose = () => setEditModalOpen(false)
  const handleAddModalClose = () => {
    setFormData({})
    setAddModalOpen(false)
  }
  const handleEditModalClose = () => {
    setFormData({})
    setEditModalOpen(false)
  }
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
  const [companyData, setCompanyData] = useState([])
  const [BranchData, setBranchData] = useState([])
  const [SupervisorData, setSupervisorData] = useState([])
  const [SalesmanData, setSalesmanData] = useState([])
  const [ExpenceType,setExpenceType]=useState([])
  const [role, setRole] = useState(null)
  const token = Cookies.get('token')
  useEffect(() => {
    const fetchRole = () => {
      const token = Cookies.get('token')
      if (token) {
        const decodedToken = jwt_decode(token)
        setRole(decodedToken.role)
      } else {
        setRole(null)
      }
    }

    fetchRole() // Call the function to fetch role
  }, [])
  // const navigate = useNavigate()

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
      url = `https://rocketsales-server.onrender.com/api/expence?filter=${selectedPeriod}`
    } else if (startDate && endDate) {
      // For "Custom" date range, pass the startDate and endDate as query params
      url = `https://rocketsales-server.onrender.com/api/expence?startDate=${startDate}&endDate=${endDate}`
    } else {
      // If "Custom" is selected but no dates are provided, fetch all expenses
      url = `https://rocketsales-server.onrender.com/api/expence`
    }

    console.log('Expense API URL:', url)
    console.log('Access Token:', accessToken)

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      })

      console.log('Response:', response.data)

      if (response.data && response.data.success) {
        // Map response data to extract relevant fields
        const filteredData = response.data.data
          .map((item) => ({
            ...item,
            createdAt: item.createdAt ? formatDate(item.createdAt) : null,
            salesmanName: item.salesmanId ? item.salesmanId.salesmanName : 'N/A',
            companyName: item.companyId ? item.companyId.companyName : 'N/A',
            companyId: item.companyId ? item.companyId._id : 'N/A',
            branchName: item.branchId ? item.branchId.branchName : 'N/A',
            branchId: item.branchId ? item.branchId._id : 'N/A',
            supervisorName: item.supervisorId ? item.supervisorId.supervisorName : 'N/A',
            supervisorId: item.supervisorId ? item.supervisorId._id : 'N/A',
            salesmanId: item.salesmanId ? item.salesmanId._id : 'N/A',
            date:item.date ? formatDate(item.date) : null,
          }))
          .filter((item) =>
            Object.values(item).some((value) =>
              value?.toString().toLowerCase().includes(searchQuery.toLowerCase()),
            ),
          )

        setData(filteredData) // Set the filtered data to `data`
        setSortedData(filteredData) // Set the filtered data to `sortedData`
      }
    } catch (error) {
      console.error('Error fetching expense data:', error)
    } finally {
      setLoading(false)
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

  const haqndleDeletesubmit = async (item) => {
    if (!item._id) {
      toast.error('Invalid item selected for deletion.')
      return
    }

    const confirmed = confirm('Do you want to delete this user?')
    if (!confirmed) return
    console.log(`https://rocketsales-server.onrender.com/api/expence/${item._id}`)
    try {
      const accessToken = Cookies.get('token')
      if (!accessToken) {
        toast.error('Authentication token is missing.')
        return
      }

      const response = await axios({
        method: 'DELETE', // Explicitly specifying DELETE method
        url: `https://rocketsales-server.onrender.com/api/expence/${item._id}`,

        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.status === 200) {
        toast.success('Group deleted successfully')
        fetchData(formatToUTCString(startDate), formatToUTCString(endDate), selectedPeriod)
      }
    } catch (error) {
      console.error('Error Details:', error.response || error.message)
      toast.error('An error occurred while deleting the group.')
    }
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
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const accessToken = Cookies.get('token');
      if (!accessToken) {
        throw new Error('Token is missing');
      }
  
      // Decode the token to get role and other details
      const decodedToken = jwt_decode(accessToken);
  
      // Determine the user's role and update formData accordingly
      if (decodedToken.role === 2) {
        formData.companyId = decodedToken.id; // Use companyId from the token
      } else if (decodedToken.role === 3) {
        formData.companyId = decodedToken.companyId; // Use companyId from the token
        formData.branchId = decodedToken.id; // Use branchId from the token
      } else if (decodedToken.role === 4) {
        formData.supervisorId = decodedToken.id; // Use supervisorId from the token
        formData.companyId = decodedToken.companyId; // Use companyId from the token
        formData.branchId = decodedToken.branchId; // Use branchId from the token
      }
  
      // Perform the POST request
      const response = await axios.post(
        `https://rocketsales-server.onrender.com/api/expence`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (response.status === 201) {
        toast.success('Branch is created successfully');
        fetchData(); // Refresh data
        setFormData({ name: '' }); // Reset form data
        setAddModalOpen(false); // Close modal
      }
    } catch (error) {
      toast.error('An error occurred');
      throw error.response ? error.response.data : new Error('An error occurred');
    }
  };
 
  const handleEditSubmit = async (e) => {
    e.preventDefault()
    console.log(formData)
    try {
      const accessToken = Cookies.get('token')
      const response = await axios.put(
        `https://rocketsales-server.onrender.com/api/expence/${formData._id}`,
        {
          ...formData,  // Ensure the formData includes billDoc
          // billDoc: '', // If billDoc is a separate field in formData
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )

      if (response.status === 200) {
        toast.success('salesmanexpencemanagement is edited successfully')
        fetchData()
        setFormData({ name: '' })
        setEditModalOpen(false)
      }
    } catch (error) {
      toast.error('An error occured')
      throw error.response ? error.response.data : new Error('An error occurred')
    }
  }

  const handleEditGroup = async (item) => {
    console.log(item)
    setEditModalOpen(true)
    setFormData({ ...item })
    console.log('this is before edit', formData)
  }
  const filteredBranches = formData.companyId
    ? BranchData.filter((branch) => branch.companyId._id === formData.companyId)
    : []
  const fetchCompany = async () => {
    const accessToken = Cookies.get('token')
    const url = `https://rocketsales-server.onrender.com/api/company`

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      })
      console.log('my data response', response.data)
      if (response.data) {
        // const companydata1 = response.data
        setCompanyData(response.data)
      }
      console.log('companies are', companyData)
    } catch (error) {
      setLoading(false)
      console.error('Error fetching data:', error)
      throw error // Re-throw the error for further handling if needed
    }
  }
  const fetchBranch = async () => {
    const accessToken = Cookies.get('token')
    const url = `https://rocketsales-server.onrender.com/api/branch`

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      })
      console.log('my data response', response.data)
      const branches = response.data.Branches || []
      if (response.data) {
        // const companydata1 = response.data
        setBranchData(branches || [])
      }
      console.log('Branches  are', BranchData)
    } catch (error) {
      setLoading(false)
      console.error('Error fetching data:', error)
      throw error // Re-throw the error for further handling if needed
    }
  }
  const fetchsupervisor = async () => {
    const accessToken = Cookies.get('token')
    const url = `https://rocketsales-server.onrender.com/api/supervisor`

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      })
      console.log('my data response', response.data)
      const supervisor = response.data.supervisors || []
      if (response.data) {
        // const companydata1 = response.data
        setSupervisorData(supervisor || [])
      }
      console.log('supervisor  are', SupervisorData)
    } catch (error) {
      setLoading(false)
      console.error('Error fetching data:', error)
      throw error // Re-throw the error for further handling if needed
    }
  }
  const fetchSalesman = async () => {
    const accessToken = Cookies.get('token')
    const url = `https://rocketsales-server.onrender.com/api/salesman` // Use the correct API endpoint
  
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      })
      console.log('Salesman data response', response.data)
      const salesmen = response.data.salesmandata || [] // Use the correct key from the response
  
      if (response.data) {
        setSalesmanData(salesmen || []) // Update the state with fetched data
      }
  
      // console.log('Salesmen are', salesmanData) // Log the fetched data
  
    } catch (error) {
      setLoading(false) // Set loading state to false on error
      console.error('Error fetching salesman data:', error)
      throw error // Re-throw the error for further handling if needed
    }
  }
  const fetchExpenceType = async () => {
    const accessToken = Cookies.get('token')
    const url = `https://rocketsales-server.onrender.com/api/expencetype`
  
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
  
      console.log('Full Response Data:', response.data)
  
     
      const expencetype = response.data.data || []
      if (response.data) {
        // const companydata1 = response.data
        setExpenceType(expencetype || [])
      }
      console.log('ExpenceType  are', expencetype)
    } catch (error) {
      console.error('Error fetching data:', error)
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchCompany()
    fetchBranch()
    fetchsupervisor()
    fetchSalesman()
    fetchExpenceType()
  }, [])
  
  return (
    <div className="d-flex flex-column mx-md-3 mt-3 h-auto">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="d-flex  justify-content-between mb-2" style={{ gap: '100px' }}>
        <div style={{ display: 'flex', gap: selectedPeriod !== 'Custom' ? '0px' : '42px' }}>
          <div>
            <h5
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: '#4c637c',
                fontWeight: '600',
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              <BsFillPersonCheckFill style={{ fontSize: '58px', color: '#4c637c' }} />
              Salesman Expense Management
            </h5>
          </div>

          <div
            style={{
              ...styles.container,
              justifyContent: selectedPeriod !== 'Custom' ? 'center' : 'space-between',
              gap: selectedPeriod !== 'Custom' ? '10px' : '0px',
            }}
          >
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
          <div
            className="add-container d-flex align-items-center"
            onClick={() => setAddModalOpen(true)}
          >
            <div className="add-icon">+</div>
            <span className="add-text ms-2">ADD</span>
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
                >
                  {col.Header}
                </CTableHeaderCell>
              ))}
              <CTableHeaderCell
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
                Actions
              </CTableHeaderCell>
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
                       {col.accessor === 'expenceDescription' ? (
                         <CTooltip content={item[col.accessor] || '--'} placement="top">
                           <span
                             style={{ cursor: 'pointer', textDecoration: 'underline' }}
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
                    <CTableDataCell
                      className={`text-center table-cell ${index % 2 === 0 ? 'table-cell-even' : 'table-cell-odd'}`}
                    >
                      <IconButton
                        aria-label="edit"
                        onClick={() => handleEditGroup(item)}
                        className="icon-button icon-button-edit"
                      >
                        <RiEdit2Fill className="icon-button-icon" />
                      </IconButton>

                      <IconButton
                        aria-label="delete"
                        onClick={() => haqndleDeletesubmit(item)}
                        className="icon-button icon-button-delete"
                      >
                        <AiFillDelete className="icon-button-icon" />
                      </IconButton>
                    </CTableDataCell>
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
      <Modal
        open={addModalOpen}
        onClose={handleAddModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="d-flex justify-content-between">
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Add New UserManage
            </Typography>
            <IconButton onClick={handleAddModalClose}>
              <CloseIcon />
            </IconButton>
          </div>
          <DialogContent>
            <form onSubmit={handleAddSubmit}>
              <FormControl style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {role == 1 ? (
                  <>
                    <FormControl variant="outlined" sx={{ marginBottom: '10px' }} fullWidth>
                      <Autocomplete
                        id="searchable-company-select"
                        options={Array.isArray(companyData) ? companyData : []}
                        getOptionLabel={(option) => option.companyName || ''}
                        value={
                          companyData.find((company) => company._id == formData.companyId) || null
                        }
                        onChange={(event, newValue) => {
                          setFormData({
                            ...formData,
                            companyId: newValue?._id || '',
                            branchId: '', // Reset branch when company changes
                            supervisorId: '', // Reset supervisor when company changes
                            salesmanId:'',
                            expenceTypeId:'',
                          })
                          setBranchError(false) // Clear branch error
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Company Name"
                            variant="outlined"
                            name="companyId"
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: (
                                <InputAdornment position="start">
                                  <BusinessIcon />
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      />
                    </FormControl>

                    {/* Branch Dropdown */}
                    <FormControl variant="outlined" sx={{ marginBottom: '10px' }} fullWidth>
                      <Autocomplete
                        id="searchable-branch-select"
                        options={filteredBranches}
                        getOptionLabel={(option) => option.branchName || ''}
                        value={
                          filteredBranches.find((branch) => branch._id == formData.branchId) || null
                        }
                        onChange={(event, newValue) => {
                          if (!formData.companyId) {
                            setBranchError(true)
                          } else {
                            setFormData({
                              ...formData,
                              branchId: newValue?._id || '',
                             
                              supervisorId: '', // Reset supervisor when branch changes
                            salesmanId:'',
                            expenceTypeId:'',
                            })
                            setBranchError(false)
                          }
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Branch Name"
                            variant="outlined"
                            name="branchId"
                            error={branchError} // Show error state
                            helperText={
                              branchError && formData.companyId
                                ? 'Please select a company first'
                                : ''
                            }
                            placeholder={
                              !formData.companyId ? 'Select Company First' : 'Select Branch'
                            }
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: (
                                <InputAdornment position="start">
                                  <FiGitBranch />
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                        disabled={!formData.companyId} // Disable if no company is selected
                      />
                    </FormControl>

                    <FormControl variant="outlined" sx={{ marginBottom: '10px' }} fullWidth>
                      <Autocomplete
                        id="searchable-supervisor-select"
                        options={
                          formData.companyId && formData.branchId
                            ? SupervisorData.filter(
                                (supervisor) =>
                                  supervisor.companyId?._id === formData.companyId &&
                                  supervisor.branchId?._id === formData.branchId,
                              )
                            : []
                        }
                        getOptionLabel={(option) => option.supervisorName || ''}
                        value={
                          SupervisorData.find(
                            (supervisor) => supervisor._id === formData.supervisorId,
                          ) || null
                        }
                        onChange={(event, newValue) =>
                          setFormData({
                            ...formData,
                            supervisorId: newValue?._id || '',
                          })
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Supervisor"
                            variant="outlined"
                            name="supervisorId"
                            placeholder={
                              !formData.companyId
                                ? 'Select Company First'
                                : !formData.branchId
                                  ? 'Select Branch First'
                                  : 'Select Supervisor'
                            }
                            disabled={!formData.companyId || !formData.branchId}
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: (
                                <InputAdornment position="start">
                                  <FiUser />
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                        disabled={!formData.branchId} // Disable if branch is not selected
                      />
                    </FormControl>
                    <FormControl variant="outlined" sx={{ marginBottom: '10px' }} fullWidth>
  <Autocomplete
    id="searchable-salesman-select"
    options={
      formData.companyId && formData.branchId && formData.supervisorId
        ? SalesmanData.filter(
            (salesman) =>
              salesman.companyId?._id === formData.companyId &&
              salesman.branchId?._id === formData.branchId &&
              salesman.supervisorId?._id === formData.supervisorId
          )
        : []
    }
    getOptionLabel={(option) => option.salesmanName || ''}
    value={
      SalesmanData.find((salesman) => salesman._id === formData.salesmanId) || null
    }
    onChange={(event, newValue) =>
      setFormData({
        ...formData,
        salesmanId: newValue?._id || '',
      })
    }
    renderInput={(params) => (
      <TextField
        {...params}
        label="Salesman"
        variant="outlined"
        name="salesmanId"
        placeholder={
          !formData.companyId
                                ? 'Select Company First'
                                : !formData.branchId
                                  ? 'Select Branch First'
                                  :!formData.supervisorId
                                  ?'Select Supervisor First':
                                  'Select Salesman'
        }
        disabled={!formData.companyId || !formData.branchId || !formData.supervisorId} // Disable if supervisor is not selected
        InputProps={{
          ...params.InputProps,
          startAdornment: (
            <InputAdornment position="start">
              <PersonIcon />
            </InputAdornment>
          ),
        }}
      />
    )}
    disabled={!formData.supervisorId} // Disable if supervisor is not selected
  />
</FormControl>

<FormControl variant="outlined" sx={{ marginBottom: '10px' }} fullWidth>
      <Autocomplete
        id="searchable-expencetype-select"
        options={
          formData.companyId && formData.branchId
            ? ExpenceType.filter(
                (expence) =>
                  expence.companyId?._id === formData.companyId &&
                  expence.branchId?._id === formData.branchId
              )
            : []
        }
        getOptionLabel={(option) => option.expenceType || ''}
        value={
          ExpenceType.find((expence) => expence.expenceType === formData.expenceType) || null
        }
        onChange={(event, newValue) =>
          setFormData({
            ...formData,
            expenceType: newValue?.expenceType || '',
          })
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label="Expense Type"
            variant="outlined"
            name="expenceTypeId"
            placeholder={
              !formData.companyId
                ? 'Select Company First'
                : !formData.branchId
                ? 'Select Branch First'
                : 'Select Expense Type'
            }
            disabled={!formData.companyId || !formData.branchId}
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <BusinessIcon />
                </InputAdornment>
              ),
            }}
          />
        )}
        disabled={!formData.branchId} // Disable if branch is not selected
      />
    </FormControl>
                  </>
                ) : role == 2 ? (
                  <>
                    <FormControl variant="outlined" sx={{ marginBottom: '10px' }} fullWidth>
                      <Autocomplete
                        id="searchable-branch-select"
                        options={Array.isArray(BranchData) ? BranchData : []}
                        getOptionLabel={(option) => option.branchName || ''}
                        value={
                          Array.isArray(BranchData)
                            ? BranchData.find((branch) => branch._id == formData.branchId)
                            : null
                        }
                        onChange={(event, newValue) =>
                          setFormData({
                            ...formData,
                            branchId: newValue?._id || '', // Update branch
                            supervisorId: '', // Reset supervisor
                            salesmanId:'',
                            expenceType:'',
                          })
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Branch Name"
                            variant="outlined"
                            name="branchId"
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: (
                                <InputAdornment position="start">
                                  <FiGitBranch />
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      />
                    </FormControl>

                    <FormControl variant="outlined" sx={{ marginBottom: '10px' }} fullWidth>
                      <Autocomplete
                        id="searchable-supervisor-select"
                        options={
                          formData.branchId // Only show supervisors if branch is selected
                            ? SupervisorData.filter(
                                (supervisor) => supervisor.branchId?._id === formData.branchId,
                              )
                            : []
                        }
                        getOptionLabel={(option) => option.supervisorName || ''}
                        value={
                          formData.supervisorId
                            ? SupervisorData.find(
                                (supervisor) => supervisor._id === formData.supervisorId,
                              )
                            : null // Ensure it is null if supervisorId is empty
                        }
                        onChange={(event, newValue) =>
                          setFormData({
                            ...formData,
                            supervisorId: newValue?._id || '', // Update supervisor
                            salesmanId:'',
                          })
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Supervisor"
                            variant="outlined"
                            name="supervisorId"
                            placeholder={
                              !formData.branchId ? 'Select Branch First' : 'Select Supervisor'
                            }
                            disabled={!formData.branchId} // Disable when no branch is selected
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: (
                                <InputAdornment position="start">
                                  <FiGitBranch />
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      />
                    </FormControl>
                    <FormControl variant="outlined" sx={{ marginBottom: '10px' }} fullWidth>
  <Autocomplete
    id="searchable-salesman-select"
    options={
       formData.branchId && formData.supervisorId
        ? SalesmanData.filter(
            (salesman) =>
             
              salesman.branchId?._id === formData.branchId &&
              salesman.supervisorId?._id === formData.supervisorId
          )
        : []
    }
    getOptionLabel={(option) => option.salesmanName || ''}
    value={
      SalesmanData.find((salesman) => salesman._id === formData.salesmanId) || null
    }
    onChange={(event, newValue) =>
      setFormData({
        ...formData,
        salesmanId: newValue?._id || '',
      })
    }
    renderInput={(params) => (
      <TextField
        {...params}
        label="Salesman"
        variant="outlined"
        name="salesmanId"
        placeholder={
         
                               !formData.branchId
                                  ? 'Select Branch First'
                                  :!formData.supervisorId
                                  ?'Select Supervisor First':
                                  'Select Salesman'
        }
        disabled={ !formData.branchId || !formData.supervisorId} // Disable if supervisor is not selected
        InputProps={{
          ...params.InputProps,
          startAdornment: (
            <InputAdornment position="start">
              <PersonIcon />
            </InputAdornment>
          ),
        }}
      />
    )}
    disabled={!formData.supervisorId} // Disable if supervisor is not selected
  />
</FormControl>

<FormControl variant="outlined" sx={{ marginBottom: '10px' }} fullWidth>
      <Autocomplete
        id="searchable-expencetype-select"
        options={
              formData.branchId
            ? ExpenceType.filter(
                (expence) =>
                
                  expence.branchId?._id === formData.branchId
              )
            : []
        }
        getOptionLabel={(option) => option.expenceType || ''}
        value={
          ExpenceType.find((expence) => expence.expenceType === formData.expenceType) || null
        }
        onChange={(event, newValue) =>
          setFormData({
            ...formData,
            expenceType: newValue?.expenceType || '',
          })
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label="Expense Type"
            variant="outlined"
            name="expenceTypeId"
            placeholder={
              !formData.branchId
                ? 'Select Branch First'
                : 'Select Expense Type'
            }
            disabled={!formData.branchId}
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <BusinessIcon />
                </InputAdornment>
              ),
            }}
          />
        )}
        disabled={!formData.branchId} // Disable if branch is not selected
      />
    </FormControl>
                  </>
                ) : role == 3 ? (
                  <>
                    <FormControl variant="outlined" sx={{ marginBottom: '10px' }} fullWidth>
                      <Autocomplete
                        id="searchable-supervisor-select"
                        options={Array.isArray(SupervisorData) ? SupervisorData : []} // Ensure SupervisorData is an array
                        getOptionLabel={(option) => option.supervisorName || ''} // Display supervisor name
                        value={
                          Array.isArray(SupervisorData)
                            ? SupervisorData.find(
                                (supervisor) => supervisor._id === formData.supervisorId,
                              )
                            : null
                        } // Safely find the selected supervisor
                        onChange={(event, newValue) =>
                          setFormData({
                            ...formData,
                            supervisorId: newValue?._id || '', // Update the supervisorId in formData
                            salesmanId:'',
                          })
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Supervisor"
                            variant="outlined"
                            name="supervisorId"
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: (
                                <InputAdornment position="start">
                                  <FiGitBranch />
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      />
                    </FormControl>
                    <FormControl variant="outlined" sx={{ marginBottom: '10px' }} fullWidth>
  <Autocomplete
    id="searchable-salesman-select"
    options={
      formData.supervisorId
        ? SalesmanData.filter(
            (salesman) =>
              // salesman.companyId?._id === formData.companyId &&
              // salesman.branchId?._id === formData.branchId &&
              salesman.supervisorId?._id === formData.supervisorId
          )
        : []
    }
    getOptionLabel={(option) => option.salesmanName || ''}
    value={
      SalesmanData.find((salesman) => salesman._id === formData.salesmanId) || null
    }
    onChange={(event, newValue) =>
      setFormData({
        ...formData,
        salesmanId: newValue?._id || '',
      })
    }
    renderInput={(params) => (
      <TextField
        {...params}
        label="Salesman"
        variant="outlined"
        name="salesmanId"
        placeholder={
         !formData.supervisorId
                                  ?'Select Supervisor First':
                                  'Select Salesman'
        }
        disabled={ !formData.supervisorId} // Disable if supervisor is not selected
        InputProps={{
          ...params.InputProps,
          startAdornment: (
            <InputAdornment position="start">
              <PersonIcon />
            </InputAdornment>
          ),
        }}
      />
    )}
    disabled={!formData.supervisorId} // Disable if supervisor is not selected
  />
</FormControl>

<FormControl variant="outlined" sx={{ marginBottom: '10px' }} fullWidth>
      <Autocomplete
        id="searchable-expencetype-select"
        options={
          ExpenceType||''
        }
        getOptionLabel={(option) => option.expenceType || ''}
        value={
          ExpenceType.find((expence) => expence.expenceType === formData.expenceType) || null
        }
        onChange={(event, newValue) =>
          setFormData({
            ...formData,
            expenceType: newValue?.expenceType || '',
          })
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label="Expense Type"
            variant="outlined"
            name="expenceTypeId"
            placeholder={
              'Select Expense Type'
            }
            disabled={!formData.companyId || !formData.branchId}
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <BusinessIcon />
                </InputAdornment>
              ),
            }}
          />
        )}
        // disabled={!formData.branchId} // Disable if branch is not selected
      />
    </FormControl>
                  </>
                ) : role == 4 ? (
                  <>
                    <FormControl variant="outlined" sx={{ marginBottom: '10px' }} fullWidth>
  <Autocomplete
    id="searchable-salesman-select"
    options={
     SalesmanData  
    }
    getOptionLabel={(option) => option.salesmanName || ''}
    value={
      SalesmanData.find((salesman) => salesman._id === formData.salesmanId) || null
    }
    onChange={(event, newValue) =>
      setFormData({
        ...formData,
        salesmanId: newValue?._id || '',
      })
    }
    renderInput={(params) => (
      <TextField
        {...params}
        label="Salesman"
        variant="outlined"
        name="salesmanId"
        placeholder={        
                                  'Select Salesman'
        }
        // disabled={!formData.companyId || !formData.branchId || !formData.supervisorId} // Disable if supervisor is not selected
        InputProps={{
          ...params.InputProps,
          startAdornment: (
            <InputAdornment position="start">
              <PersonIcon />
            </InputAdornment>
          ),
        }}
      />
    )}
    // disabled={!formData.supervisorId} // Disable if supervisor is not selected
  />
</FormControl>

<FormControl variant="outlined" sx={{ marginBottom: '10px' }} fullWidth>
      <Autocomplete
        id="searchable-expencetype-select"
        options={
         ExpenceType
        }
        getOptionLabel={(option) => option.expenceType || ''}
        value={
          ExpenceType.find((expence) => expence.expenceType === formData.expenceType) || null
        }
        onChange={(event, newValue) =>
          setFormData({
            ...formData,
            expenceType: newValue?.expenceType || '',
          })
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label="Expense Type"
            variant="outlined"
            name="expenceTypeId"
            placeholder={
              !formData.branchId
                ? 'Select Branch First'
                : 'Select Expense Type'
            }
            // disabled={!formData.companyId || !formData.branchId}
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <BusinessIcon />
                </InputAdornment>
              ),
            }}
          />
        )}
        // disabled={!formData.branchId} // Disable if branch is not selected
      />
    </FormControl>
                  </>
                ) : null}
               {COLUMNS()
  .slice(2, -4)
  .map((column) => (
    column.accessor === "date" ? (
      <TextField
        key={column.accessor}
        label={column.Header}
        type="datetime-local"
        name={column.accessor}
        value={formData[column.accessor] || ""}
        onChange={(e) => {
          const selectedDate = e.target.value;
          const currentDateTime = new Date().toISOString().slice(0, 16); // Get current datetime in 'YYYY-MM-DDTHH:MM' format
    
          if (selectedDate > currentDateTime) {
            setFormData({ ...formData, [column.accessor]: "" }); // Reset invalid input
          } else {
            setFormData({ ...formData, [column.accessor]: selectedDate });
          }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">{column.icon}</InputAdornment>
          ),
        }}
        error={formData[column.accessor] > new Date().toISOString().slice(0, 16)}
        helperText={
          formData[column.accessor] > new Date().toISOString().slice(0, 16)
            ? "Date cannot be in the future"
            : ""
        }
        sx={{
          width: "100%",
          "& input": {
            padding: "10px",
          },
        }}
        inputProps={{
          max: new Date().toISOString().slice(0, 16), // Restrict future dates
        }}
      />
    ) 
    
     : (
      <TextField
        key={column.accessor}
        label={column.Header}
        name={column.accessor}
        value={formData[column.accessor] || ""}
        onChange={(e) =>
          setFormData({ ...formData, [column.accessor]: e.target.value })
        }
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">{column.icon}</InputAdornment>
          ),
        }}
      />
    )
  ))}

              </FormControl>

              <Button
                variant="contained"
                color="primary"
                type="submit"
                style={{ marginTop: '20px' }}
              >
                Submit
              </Button>
            </form>
          </DialogContent>
        </Box>
      </Modal>
   <Modal
  open={editModalOpen}
  onClose={handleEditModalClose}
  aria-labelledby="modal-modal-title"
  aria-describedby="modal-modal-description"
>
  <Box sx={style}>
    <div className="d-flex justify-content-between">
      <Typography id="modal-modal-title" variant="h6" component="h2">
        Edit UserManage
      </Typography>
      <IconButton onClick={handleEditModalClose}>
        <CloseIcon />
      </IconButton>
    </div>
    <DialogContent>
      <form onSubmit={handleEditSubmit}>
      <FormControl style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {role == 1 ? (
            <>
             <FormControl variant="outlined" sx={{ marginBottom: '10px' }} fullWidth>
                      <Autocomplete
                        id="searchable-company-select"
                        options={Array.isArray(companyData) ? companyData : []}
                        getOptionLabel={(option) => option.companyName || ''}
                        value={
                          companyData.find((company) => company._id == formData.companyId) || null
                        }
                        onChange={(event, newValue) => {
                          setFormData({
                            ...formData,
                            companyId: newValue?._id || '',
                            branchId: '', // Reset branch when company changes
                            supervisorId: '', // Reset supervisor when company changes
                            salesmanId:'',
                            expenceType:'',
                          })
                          setBranchError(false) // Clear branch error
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Company Name"
                            variant="outlined"
                            name="companyId"
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: (
                                <InputAdornment position="start">
                                  <BusinessIcon />
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      />
                    </FormControl>

                    {/* Branch Dropdown */}
                    <FormControl variant="outlined" sx={{ marginBottom: '10px' }} fullWidth>
                      <Autocomplete
                        id="searchable-branch-select"
                        options={filteredBranches}
                        getOptionLabel={(option) => option.branchName || ''}
                        value={
                          filteredBranches.find((branch) => branch._id == formData.branchId) || null
                        }
                        onChange={(event, newValue) => {
                          if (!formData.companyId) {
                            setBranchError(true)
                          } else {
                            setFormData({
                              ...formData,
                              branchId: newValue?._id || '',
                             
                              supervisorId: '', // Reset supervisor when branch changes
                            salesmanId:'',
                            expenceType:'',
                            })
                            setBranchError(false)
                          }
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Branch Name"
                            variant="outlined"
                            name="branchId"
                            error={branchError} // Show error state
                            helperText={
                              branchError && formData.companyId
                                ? 'Please select a company first'
                                : ''
                            }
                            placeholder={
                              !formData.companyId ? 'Select Company First' : 'Select Branch'
                            }
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: (
                                <InputAdornment position="start">
                                  <FiGitBranch />
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                        disabled={!formData.companyId} // Disable if no company is selected
                      />
                    </FormControl>

                    <FormControl variant="outlined" sx={{ marginBottom: '10px' }} fullWidth>
                      <Autocomplete
                        id="searchable-supervisor-select"
                        options={
                          formData.companyId && formData.branchId
                            ? SupervisorData.filter(
                                (supervisor) =>
                                  supervisor.companyId?._id === formData.companyId &&
                                  supervisor.branchId?._id === formData.branchId,
                              )
                            : []
                        }
                        getOptionLabel={(option) => option.supervisorName || ''}
                        value={
                          SupervisorData.find(
                            (supervisor) => supervisor._id === formData.supervisorId,
                          ) || null
                        }
                        onChange={(event, newValue) =>
                          setFormData({
                            ...formData,
                            supervisorId: newValue?._id || '',
                          })
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Supervisor"
                            variant="outlined"
                            name="supervisorId"
                            placeholder={
                              !formData.companyId
                                ? 'Select Company First'
                                : !formData.branchId
                                  ? 'Select Branch First'
                                  : 'Select Supervisor'
                            }
                            disabled={!formData.companyId || !formData.branchId}
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: (
                                <InputAdornment position="start">
                                  <FiUser />
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                        disabled={!formData.branchId} // Disable if branch is not selected
                      />
                    </FormControl>
                    <FormControl variant="outlined" sx={{ marginBottom: '10px' }} fullWidth>
  <Autocomplete
    id="searchable-salesman-select"
    options={
      formData.companyId && formData.branchId && formData.supervisorId
        ? SalesmanData.filter(
            (salesman) =>
              salesman.companyId?._id === formData.companyId &&
              salesman.branchId?._id === formData.branchId &&
              salesman.supervisorId?._id === formData.supervisorId
          )
        : []
    }
    getOptionLabel={(option) => option.salesmanName || ''}
    value={
      SalesmanData.find((salesman) => salesman._id === formData.salesmanId) || null
    }
    onChange={(event, newValue) =>
      setFormData({
        ...formData,
        salesmanId: newValue?._id || '',
      })
    }
    renderInput={(params) => (
      <TextField
        {...params}
        label="Salesman"
        variant="outlined"
        name="salesmanId"
        placeholder={
          !formData.companyId
                                ? 'Select Company First'
                                : !formData.branchId
                                  ? 'Select Branch First'
                                  :!formData.supervisorId
                                  ?'Select Supervisor First':
                                  'Select Salesman'
        }
        disabled={!formData.companyId || !formData.branchId || !formData.supervisorId} // Disable if supervisor is not selected
        InputProps={{
          ...params.InputProps,
          startAdornment: (
            <InputAdornment position="start">
              <PersonIcon />
            </InputAdornment>
          ),
        }}
      />
    )}
    disabled={!formData.supervisorId} // Disable if supervisor is not selected
  />
</FormControl>

<FormControl variant="outlined" sx={{ marginBottom: '10px' }} fullWidth>
      <Autocomplete
        id="searchable-expencetype-select"
        options={
          formData.companyId && formData.branchId
            ? ExpenceType.filter(
                (expence) =>
                  expence.companyId?._id === formData.companyId &&
                  expence.branchId?._id === formData.branchId
              )
            : []
        }
        getOptionLabel={(option) => option.expenceType || ''}
        value={
          ExpenceType.find((expence) => expence.expenceType === formData.expenceType) || null
        }
        onChange={(event, newValue) =>
          setFormData({
            ...formData,
            expenceType: newValue?.expenceType || '',
          })
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label="Expense Type"
            variant="outlined"
            name="expenceTypeId"
            placeholder={
              !formData.companyId
                ? 'Select Company First'
                : !formData.branchId
                ? 'Select Branch First'
                : 'Select Expense Type'
            }
            disabled={!formData.companyId || !formData.branchId}
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <BusinessIcon />
                </InputAdornment>
              ),
            }}
          />
        )}
        disabled={!formData.branchId} // Disable if branch is not selected
      />
    </FormControl>
            </>
          ) : role == 2 ? (
            <>
            
            <FormControl variant="outlined" sx={{ marginBottom: '10px' }} fullWidth>
                      <Autocomplete
                        id="searchable-branch-select"
                        options={Array.isArray(BranchData) ? BranchData : []}
                        getOptionLabel={(option) => option.branchName || ''}
                        value={
                          Array.isArray(BranchData)
                            ? BranchData.find((branch) => branch._id == formData.branchId)
                            : null
                        }
                        onChange={(event, newValue) =>
                          setFormData({
                            ...formData,
                            branchId: newValue?._id || '', // Update branch
                            supervisorId: '', // Reset supervisor
                            salesmanId:'',
                            expenceType:'',
                          })
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Branch Name"
                            variant="outlined"
                            name="branchId"
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: (
                                <InputAdornment position="start">
                                  <FiGitBranch />
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      />
                    </FormControl>

                    <FormControl variant="outlined" sx={{ marginBottom: '10px' }} fullWidth>
                      <Autocomplete
                        id="searchable-supervisor-select"
                        options={
                          formData.branchId // Only show supervisors if branch is selected
                            ? SupervisorData.filter(
                                (supervisor) => supervisor.branchId?._id === formData.branchId,
                              )
                            : []
                        }
                        getOptionLabel={(option) => option.supervisorName || ''}
                        value={
                          formData.supervisorId
                            ? SupervisorData.find(
                                (supervisor) => supervisor._id === formData.supervisorId,
                              )
                            : null // Ensure it is null if supervisorId is empty
                        }
                        onChange={(event, newValue) =>
                          setFormData({
                            ...formData,
                            supervisorId: newValue?._id || '', // Update supervisor
                            salesmanId:'',
                          })
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Supervisor"
                            variant="outlined"
                            name="supervisorId"
                            placeholder={
                              !formData.branchId ? 'Select Branch First' : 'Select Supervisor'
                            }
                            disabled={!formData.branchId} // Disable when no branch is selected
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: (
                                <InputAdornment position="start">
                                  <FiGitBranch />
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      />
                    </FormControl>
                    <FormControl variant="outlined" sx={{ marginBottom: '10px' }} fullWidth>
  <Autocomplete
    id="searchable-salesman-select"
    options={
       formData.branchId && formData.supervisorId
        ? SalesmanData.filter(
            (salesman) =>
             
              salesman.branchId?._id === formData.branchId &&
              salesman.supervisorId?._id === formData.supervisorId
          )
        : []
    }
    getOptionLabel={(option) => option.salesmanName || ''}
    value={
      SalesmanData.find((salesman) => salesman._id === formData.salesmanId) || null
    }
    onChange={(event, newValue) =>
      setFormData({
        ...formData,
        salesmanId: newValue?._id || '',
      })
    }
    renderInput={(params) => (
      <TextField
        {...params}
        label="Salesman"
        variant="outlined"
        name="salesmanId"
        placeholder={
         
                               !formData.branchId
                                  ? 'Select Branch First'
                                  :!formData.supervisorId
                                  ?'Select Supervisor First':
                                  'Select Salesman'
        }
        disabled={ !formData.branchId || !formData.supervisorId} // Disable if supervisor is not selected
        InputProps={{
          ...params.InputProps,
          startAdornment: (
            <InputAdornment position="start">
              <PersonIcon />
            </InputAdornment>
          ),
        }}
      />
    )}
    disabled={!formData.supervisorId} // Disable if supervisor is not selected
  />
</FormControl>

<FormControl variant="outlined" sx={{ marginBottom: '10px' }} fullWidth>
      <Autocomplete
        id="searchable-expencetype-select"
        options={
              formData.branchId
            ? ExpenceType.filter(
                (expence) =>
                
                  expence.branchId?._id === formData.branchId
              )
            : []
        }
        getOptionLabel={(option) => option.expenceType || ''}
        value={
          ExpenceType.find((expence) => expence.expenceType === formData.expenceType) || null
        }
        onChange={(event, newValue) =>
          setFormData({
            ...formData,
            expenceType: newValue?.expenceType || '',
          })
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label="Expense Type"
            variant="outlined"
            name="expenceTypeId"
            placeholder={
              !formData.branchId
                ? 'Select Branch First'
                : 'Select Expense Type'
            }
            disabled={!formData.branchId}
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <BusinessIcon />
                </InputAdornment>
              ),
            }}
          />
        )}
        disabled={!formData.branchId} // Disable if branch is not selected
      />
    </FormControl>
            </>
          ) :role==3?(
            <>
         
         <FormControl variant="outlined" sx={{ marginBottom: '10px' }} fullWidth>
                      <Autocomplete
                        id="searchable-supervisor-select"
                        options={Array.isArray(SupervisorData) ? SupervisorData : []} // Ensure SupervisorData is an array
                        getOptionLabel={(option) => option.supervisorName || ''} // Display supervisor name
                        value={
                          Array.isArray(SupervisorData)
                            ? SupervisorData.find(
                                (supervisor) => supervisor._id === formData.supervisorId,
                              )
                            : null
                        } // Safely find the selected supervisor
                        onChange={(event, newValue) =>
                          setFormData({
                            ...formData,
                            supervisorId: newValue?._id || '', // Update the supervisorId in formData
                            salesmanId:'',
                          })
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Supervisor"
                            variant="outlined"
                            name="supervisorId"
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: (
                                <InputAdornment position="start">
                                  <FiGitBranch />
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      />
                    </FormControl>
                    <FormControl variant="outlined" sx={{ marginBottom: '10px' }} fullWidth>
  <Autocomplete
    id="searchable-salesman-select"
    options={
      formData.supervisorId
        ? SalesmanData.filter(
            (salesman) =>
              // salesman.companyId?._id === formData.companyId &&
              // salesman.branchId?._id === formData.branchId &&
              salesman.supervisorId?._id === formData.supervisorId
          )
        : []
    }
    getOptionLabel={(option) => option.salesmanName || ''}
    value={
      SalesmanData.find((salesman) => salesman._id === formData.salesmanId) || null
    }
    onChange={(event, newValue) =>
      setFormData({
        ...formData,
        salesmanId: newValue?._id || '',
      })
    }
    renderInput={(params) => (
      <TextField
        {...params}
        label="Salesman"
        variant="outlined"
        name="salesmanId"
        placeholder={
         !formData.supervisorId
                                  ?'Select Supervisor First':
                                  'Select Salesman'
        }
        disabled={ !formData.supervisorId} // Disable if supervisor is not selected
        InputProps={{
          ...params.InputProps,
          startAdornment: (
            <InputAdornment position="start">
              <PersonIcon />
            </InputAdornment>
          ),
        }}
      />
    )}
    disabled={!formData.supervisorId} // Disable if supervisor is not selected
  />
</FormControl>

<FormControl variant="outlined" sx={{ marginBottom: '10px' }} fullWidth>
      <Autocomplete
        id="searchable-expencetype-select"
        options={
          ExpenceType||''
        }
        getOptionLabel={(option) => option.expenceType || ''}
        value={
          ExpenceType.find((expence) => expence.expenceType === formData.expenceType) || null
        }
        onChange={(event, newValue) =>
          setFormData({
            ...formData,
            expenceType: newValue?.expenceType || '',
          })
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label="Expense Type"
            variant="outlined"
            name="expenceTypeId"
            placeholder={
              'Select Expense Type'
            }
            disabled={!formData.companyId || !formData.branchId}
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <BusinessIcon />
                </InputAdornment>
              ),
            }}
          />
        )}
        // disabled={!formData.branchId} // Disable if branch is not selected
      />
    </FormControl>
          </>

          ): null}
         
         {COLUMNS()
  .slice(2, -4)
  .map((column) => (
    column.accessor === "date" ? (
      <TextField
        key={column.accessor}
        label={column.Header}
        type="datetime-local"
        name={column.accessor}
        // Ensure the value is in the correct format (YYYY-MM-DDTHH:MM)
        value={formData[column.accessor] ? new Date(formData[column.accessor]).toISOString().slice(0, 16) : ""}
        onChange={(e) => {
          const selectedDate = e.target.value;
          const currentDateTime = new Date().toISOString().slice(0, 16); // Get current datetime in 'YYYY-MM-DDTHH:MM' format
      
          if (selectedDate > currentDateTime) {
            setFormData({ ...formData, [column.accessor]: "" }); // Reset invalid input
          } else {
            setFormData({ ...formData, [column.accessor]: selectedDate });
          }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">{column.icon}</InputAdornment>
          ),
        }}
        error={formData[column.accessor] > new Date().toISOString().slice(0, 16)}
        helperText={
          formData[column.accessor] > new Date().toISOString().slice(0, 16)
            ? "Date cannot be in the future"
            : ""
        }
        sx={{
          width: "100%",
          "& input": {
            padding: "10px",
          },
        }}
        inputProps={{
          max: new Date().toISOString().slice(0, 16), // Restrict future dates
        }}
      />
    )
    
     : (
      <TextField
        key={column.accessor}
        label={column.Header}
        name={column.accessor}
        value={formData[column.accessor] || ""}
        onChange={(e) =>
          setFormData({ ...formData, [column.accessor]: e.target.value })
        }
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">{column.icon}</InputAdornment>
          ),
        }}
      />
    )
  ))}
         
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          style={{ marginTop: '20px' }}
        >
          Submit
        </Button>
      </form>
    </DialogContent>
  </Box>
</Modal>
    </div>
  )
}

export default SalesmanExpenceManagement
