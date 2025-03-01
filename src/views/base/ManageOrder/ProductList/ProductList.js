// ProductList.js
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
import {
    Autocomplete,
  } from '@mui/material'
import TablePagination from '@mui/material/TablePagination'
import { useNavigate } from 'react-router-dom'
import Loader from '../../../../components/Loader/Loader'
import CloseIcon from '@mui/icons-material/Close'
import { FaEdit, FaSearch } from 'react-icons/fa'
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
import jwt_decode from 'jwt-decode';
import BusinessIcon from '@mui/icons-material/Business';
import { FiUser } from "react-icons/fi";


import { FiGitBranch } from 'react-icons/fi';
import PDFExporter from '../../ReusablecodeforTable/PDFExporter'
import ExcelExporter from '../../ReusablecodeforTable/ExcelExporter'
import { LazyLoadImage } from 'react-lazy-load-image-component'
// import { useNavigate } from 'react-router-dom';

const ProductList = () => {
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
const [branchError, setBranchError] = useState(false)

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
    const [BranchData, setBranchData] = useState([]);

  
  const [selectedPeriod, setSelectedPeriod] = useState('today')
  const [showCustomDates, setShowCustomDates] = useState(false)
  const [role, setRole] = useState(null);
    const [companyData, setCompanyData] = useState([]);
    const [SupervisorData, setSupervisorData] = useState([]);
    const [SalesmanData, setSalesmanData] = useState([]);
  const [sortBy, setSortBy] = useState('')
    const [sortOrder, setSortOrder] = useState('asc')
  const navigate = useNavigate()
  const handleEditModalClose = () => {
    setFormData({})
    setEditModalOpen(false)
  }
  const handleEditSubmit = async (e) => {
    e.preventDefault()
    console.log(formData)
    try {
      const accessToken = Cookies.get('token')
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/product/${formData._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )

      if (response.status === 200) {
        toast.success('order is edited successfully')
        fetchData()
        setFormData({ name: '' })
        setEditModalOpen(false)
      }
    } catch (error) {
      toast.error('An error occured')
      throw error.response ? error.response.data : new Error('An error occurred')
    }
  }
  const styles = {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      gap: '17px',
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
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
      color: 'black', // White text for input
      fontSize: '14px',
      width: '136px',
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
  }
  useEffect(() => {
      const fetchRole = () => {
        const token = Cookies.get("token");
        if (token) {
          const decodedToken = jwt_decode(token);
          setRole(decodedToken.role);
        } else {
          setRole(null);
        }
      };
    
      fetchRole(); // Call the function to fetch role
    }, []); 
    const filteredBranches = formData.companyId
? BranchData.filter((branch) => branch.companyId._id === formData.companyId)
: []
const handleEditGroup = async (item) => {
    console.log(item)
    setEditModalOpen(true)
    setFormData({ ...item })
    console.log('this is before edit', formData)
  }
  const handleAddModalClose = () => {
    setFormData({})
    setAddModalOpen(false)
  }
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
        // formData.supervisorId = decodedToken.id; // Use supervisorId from the token
        formData.companyId = decodedToken.companyId; // Use companyId from the token
        formData.branchId = decodedToken.branchId; // Use branchId from the token
      }
      const finalData = {
        products: [formData],
      };
      // Perform the POST request
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/product`,
        finalData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (response.status === 201) {
        toast.success('Product is created successfully');
        fetchData(); // Refresh data
        setFormData({ name: '' }); // Reset form data
        setAddModalOpen(false); // Close modal
      }
    } catch (error) {
      toast.error('An error occurred');
      throw error.response ? error.response.data : new Error('An error occurred');
    }
  };
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
      url = `${import.meta.env.VITE_SERVER_URL}/api/product?filter=${selectedPeriod}`
    } else if (startDate && endDate) {
      // For "Custom" date range, pass the startDate and endDate as query params
      url = `${import.meta.env.VITE_SERVER_URL}/api/product?startDate=${startDate}&endDate=${endDate}`
    } else {
      // If "Custom" is selected but no dates are provided, just fetch all data
      url = `${import.meta.env.VITE_SERVER_URL}/api/product`
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
            companyId: item.companyId ? item.companyId._id : 'N/A',
            branchName: item.branchId ? item.branchId.branchName : 'N/A',
            branchId: item.branchId ? item.branchId._id : 'N/A',
            supervisorName: item.supervisorId ? item.supervisorId.supervisorName : 'N/A',
            supervisorId: item.supervisorId ? item.supervisorId._id : 'N/A',
          }))
          // .filter((item) =>
          //   Object.values(item).some((value) =>
          //     value.toString().toLowerCase().includes(searchQuery.toLowerCase()),
          //   ),
          // )
          .filter((item) =>
            Object.values(item).some((value) =>
              value !== null && value !== undefined && value.toString().toLowerCase().includes(searchQuery.toLowerCase())
            )
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
  const fetchCompany = async () => {
    const accessToken = Cookies.get('token');
    const url = `${import.meta.env.VITE_SERVER_URL}/api/company`;
  
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      });
  console.log("my data response",response.data)
      if (response.data) {
      
        // const companydata1 = response.data
        setCompanyData( response.data);
       
      }
      console.log("companies are",companyData);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching data:', error);
      throw error; // Re-throw the error for further handling if needed
    }
  };
  const fetchBranch = async () => {
    const accessToken = Cookies.get('token');
    const url = `${import.meta.env.VITE_SERVER_URL}/api/branch`;
  
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      });
  console.log("my data response",response.data)
  const branches = response.data.Branches || []; 
      if (response.data) {
      
        // const companydata1 = response.data
        setBranchData(branches ||[]);
       
      }
      console.log("Branches  are",BranchData);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching data:', error);
      throw error; // Re-throw the error for further handling if needed
    }
  };
  const fetchsupervisor = async () => {
    const accessToken = Cookies.get('token');
    const url = `${import.meta.env.VITE_SERVER_URL}/api/supervisor`;
  
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      });
  console.log("my data response",response.data)
  const supervisor = response.data.supervisors || []; 
      if (response.data) {
      
        // const companydata1 = response.data
        setSupervisorData(supervisor ||[]);
       
      }
      console.log("supervisor  are",SupervisorData);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching data:', error);
      throw error; // Re-throw the error for further handling if needed
    }
  };
  const fetchsalesman = async () => {
    const accessToken = Cookies.get('token');
    const url = `${import.meta.env.VITE_SERVER_URL}/api/salesman`;
  
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      });
  console.log("my data response",response.data)
  const salesman = response.data.salesman || []; 
      if (response.data) {
      
        // const companydata1 = response.data
        setSalesmanData(salesman ||[]);
       
      }
      console.log("salesman  are",SalesmanData);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching data:', error);
      throw error; // Re-throw the error for further handling if needed
    }
  };
  
 
  
  useEffect(() => {
    fetchCompany();
    fetchBranch();
    fetchsupervisor();
    fetchsalesman();
  }, []);

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
  // const filterGroups = () => {
  //   if (!searchQuery) {
  //     setFilteredData(data) // No query, show all drivers
  //   } else {
  //     const filtered = data.filter((group) =>
  //       group.salesmanName.toLowerCase().includes(searchQuery.toLowerCase()),
  //     )
  //     setFilteredData(filtered)
  //     setCurrentPage(1)
  //   }
  // }
  const filterGroups = () => {
    if (!searchQuery) {
      setFilteredData(data);
    } else {
      const filtered = data.filter((item) =>
        Object.values(item).some((value) => {
          if (value === null || value === undefined) return false;
          return value.toString().toLowerCase().includes(searchQuery.toLowerCase());
        })
      );
      setFilteredData(filtered);
      setCurrentPage(1);
    }
  };

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

  // Uncomment and modify the following block if you need deletion functionality
  const haqndleDeletesubmit = async (item) => {
    if (!item._id) {
      toast.error('Invalid item selected for deletion.')
      return
    }
  
    const confirmed = confirm('Do you want to delete this order?')
    if (!confirmed) return
    console.log(`${import.meta.env.VITE_SERVER_URL}/api/product/${item._id}`)
    try {
      const accessToken = Cookies.get('token')
      if (!accessToken) {
        toast.error('Authentication token is missing.')
        return
      }
  
      const response = await axios({
        method: 'DELETE', // Explicitly specifying DELETE method
        url: `${import.meta.env.VITE_SERVER_URL}/api/product/${item._id}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })
  
      toast.success('Order deleted successfully')
      fetchData(formatToUTCString(startDate), formatToUTCString(endDate), selectedPeriod)
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

  const handleStatusClick = async (item) => {
    try {
      // Toggle the attendance status between 'Absent' and 'Present'
      const updatedStatus = item.attendenceStatus === 'Absent' ? 'Present' : 'Absent'

      // Prepare the data for the PUT request
      const updatedData = {
        attendenceStatus: updatedStatus, // Update the attendenceStatus field
      }

      // Make the PUT request to update the attendance status
      const accessToken = Cookies.get('token')
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/attendence/${item._id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )

      if (response.status === 200) {
        alert('Attendance status updated successfully!')
      }
      fetchData(formatToUTCString(startDate), formatToUTCString(endDate), selectedPeriod)
    } catch (error) {
      alert('Failed to update attendance status')
    }
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
              <FaEdit style={{ fontSize: '24px', color: '#4c637c' }} />
              Products
            </h2>
          </div>

          {/* <div style={styles.container}>
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
          </div> */}
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
                height: '40px',
                padding: '8px 12px',
                fontSize: '16px',
                borderRadius: '8px',
                border: '1px solid #ccc',
              }}
            />
          </div>

          {/* Add Button */}
          <div
            className="add-container d-flex align-items-center"
            onClick={() => setAddModalOpen(true)}
          >
            <div className="add-icon">+</div>
            <span className="add-text ms-2">New Product</span>
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
            border: '1px solid #e0e0e0',
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
                  padding: '5px 12px',
                  borderBottom: '1px solid #e0e0e0',
                  textAlign: 'center',
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
                    padding: '5px 12px',
                    borderBottom: '1px solid #e0e0e0',
                    textAlign: 'center',
                    verticalAlign: 'middle',
                    backgroundColor: '#1d3d5f',
                    color: 'white',
                  }}
                  onClick={()=>handleSort(col.accessor)}
                >
                  {col.Header}
                  {sortBy===col.accessor && (
                    <span style={{ marginLeft: '5px' }}>
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
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
                      backgroundColor: index % 2 === 0 ? 'transparent' : '#f1f8fd',
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
                            <>
                              {console.log('mm')}
                              <img
                                src={`data:image/png;base64,${item[col.accessor]}`}
                                alt="Profile"
                                style={{
                                  width: '80px',
                                  height: '80px',
                                  borderRadius: '50%',
                                  padding: '9px',
                                }}
                              />
                            </>
                          ) : (
                            <span>No Image</span>
                          )
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
    value={companyData.find((company) => company._id == formData.companyId) || null}
    onChange={(event, newValue) => {
      setFormData({
        ...formData,
        companyId: newValue?._id || '',
        branchId: '', // Reset branch when company changes
        // supervisorId: '', // Reset supervisor when company changes
        // salesmanId: '', // Reset salesman when company changes
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
    value={filteredBranches.find((branch) => branch._id == formData.branchId) || null}
    onChange={(event, newValue) => {
      if (!formData.companyId) {
        setBranchError(true)
      } else {
        setFormData({ 
          ...formData, 
          branchId: newValue?._id || '', 
          // supervisorId: '', // Reset supervisor when branch changes
        //   salesmanId: '' ,// Reset salesman when branch changes  
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
        placeholder={!formData.companyId ? 'Select Company First' : 'Select Branch'}
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

{/* <FormControl variant="outlined" sx={{ marginBottom: '10px' }} fullWidth>
  <Autocomplete
    id="searchable-supervisor-select"
    options={
      formData.companyId && formData.branchId
        ? SupervisorData.filter(
            (supervisor) =>
              supervisor.companyId?._id === formData.companyId &&
              supervisor.branchId?._id === formData.branchId
          )
        : []
    }
    getOptionLabel={(option) => option.supervisorName || ''}
    value={
      SupervisorData.find((supervisor) => supervisor._id === formData.supervisorId) || null
    }
    onChange={(event, newValue) =>
      setFormData({
        ...formData,
        supervisorId: newValue?._id || '',
        // salesmanId: '', // Reset salesman when supervisor changes
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
</FormControl> */}
{/* Salesman Dropdown */}
{/* <FormControl variant="outlined" sx={{ marginBottom: '10px' }} fullWidth>
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
    disabled={!formData.companyId || !formData.branchId || !formData.supervisorId}
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
            : !formData.supervisorId
            ? 'Select Supervisor First'
            : 'Select Salesman'
        }
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
  />
</FormControl> */}



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
        // supervisorId: '', // Reset supervisor
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

{/* <FormControl variant="outlined" sx={{ marginBottom: '10px' }} fullWidth>
  <Autocomplete
    id="searchable-supervisor-select"
    options={
      formData.branchId // Only show supervisors if branch is selected
        ? SupervisorData.filter((supervisor) => supervisor.branchId?._id === formData.branchId)
        : []
    }
    getOptionLabel={(option) => option.supervisorName || ''}
    value={
      formData.supervisorId
        ? SupervisorData.find((supervisor) => supervisor._id === formData.supervisorId)
        : null // Ensure it is null if supervisorId is empty
    }
    onChange={(event, newValue) =>
      setFormData({
        ...formData,
        supervisorId: newValue?._id || '', // Update supervisor
      })
    }
    renderInput={(params) => (
      <TextField
        {...params}
        label="Supervisor"
        variant="outlined"
        name="supervisorId"
        placeholder={!formData.branchId ? 'Select Branch First' : 'Select Supervisor'}
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
</FormControl> */}



            </>
          ) :role==3?(
            <>
         
            {/* <FormControl variant="outlined" sx={{ marginBottom: '10px' }} fullWidth>
<Autocomplete
  id="searchable-supervisor-select"
  options={Array.isArray(SupervisorData) ? SupervisorData : []} // Ensure SupervisorData is an array
  getOptionLabel={(option) => option.supervisorName || ''} // Display supervisor name
  value={
    Array.isArray(SupervisorData)
      ? SupervisorData.find((supervisor) => supervisor._id === formData.supervisorId)
      : null
  } // Safely find the selected supervisor
  onChange={(event, newValue) =>
    setFormData({
      ...formData,
      supervisorId: newValue?._id || '', // Update the supervisorId in formData
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
</FormControl> */}
          </>

          ): null}
          {COLUMNS().slice(0, -3).map((column) => (
            <TextField
              key={column.accessor}
              label={column.Header}
              name={column.accessor}
              value={formData[column.accessor] || ''}
              onChange={(e) =>
                setFormData({ ...formData, [column.accessor]: e.target.value })
              }
              // Remove required attribute
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {column.icon}
                  </InputAdornment>
                ),
              }}
            />
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
    value={companyData.find((company) => company._id == formData.companyId) || null}
    onChange={(event, newValue) => {
      setFormData({
        ...formData,
        companyId: newValue?._id || '',
        branchId: '', // Reset branch when company changes
        // supervisorId: '', // Reset supervisor when company changes
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
    value={filteredBranches.find((branch) => branch._id == formData.branchId) || null}
    onChange={(event, newValue) => {
      if (!formData.companyId) {
        setBranchError(true)
      } else {
        setFormData({ 
          ...formData, 
          branchId: newValue?._id || '', 
          // supervisorId: '' // Reset supervisor when branch changes
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
        placeholder={!formData.companyId ? 'Select Company First' : 'Select Branch'}
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

{/* <FormControl variant="outlined" sx={{ marginBottom: '10px' }} fullWidth>
  <Autocomplete
    id="searchable-supervisor-select"
    options={
      formData.companyId && formData.branchId
        ? SupervisorData.filter(
            (supervisor) =>
              supervisor.companyId?._id === formData.companyId &&
              supervisor.branchId?._id === formData.branchId
          )
        : []
    }
    getOptionLabel={(option) => option.supervisorName || ''}
    value={
      SupervisorData.find((supervisor) => supervisor._id === formData.supervisorId) || null
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
</FormControl> */}
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
        branchId: newValue?._id || '',
        // supervisorId: '', // Reset supervisor when branch changes
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

{/* <FormControl variant="outlined" sx={{ marginBottom: '10px' }} fullWidth>
  <Autocomplete
    id="searchable-supervisor-select"
    options={
      formData.branchId // Only filter if branch is selected
        ? SupervisorData.filter((supervisor) => supervisor.branchId?._id === formData.branchId)
        : []
    }
    getOptionLabel={(option) => option.supervisorName || ''}
    value={
      Array.isArray(SupervisorData)
        ? SupervisorData.find((supervisor) => supervisor._id === formData.supervisorId)
        : null
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
        placeholder={!formData.branchId ? 'Select Branch First' : 'Select Supervisor'}
        disabled={!formData.branchId} // Disable when branch is not selected
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
</FormControl> */}

            </>
          ) :role==3?(
            <>
         
            {/* <FormControl variant="outlined" sx={{ marginBottom: '10px' }} fullWidth>
<Autocomplete
  id="searchable-supervisor-select"
  options={Array.isArray(SupervisorData) ? SupervisorData : []} // Ensure SupervisorData is an array
  getOptionLabel={(option) => option.supervisorName || ''} // Display supervisor name
  value={
    Array.isArray(SupervisorData)
      ? SupervisorData.find((supervisor) => supervisor._id === formData.supervisorId)
      : null
  } // Safely find the selected supervisor
  onChange={(event, newValue) =>
    setFormData({
      ...formData,
      supervisorId: newValue?._id || '', // Update the supervisorId in formData
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
</FormControl> */}
          </>

          ): null}
         
          {COLUMNS().slice(0, -3).map((column) => (
            <TextField
              key={column.accessor}
              label={column.Header}
              name={column.accessor}
              value={formData[column.accessor] || ''}
              onChange={(e) =>
                setFormData({ ...formData, [column.accessor]: e.target.value })
              }
              // Remove required attribute
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {column.icon}
                  </InputAdornment>
                ),
              }}
            />
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

export default ProductList 
