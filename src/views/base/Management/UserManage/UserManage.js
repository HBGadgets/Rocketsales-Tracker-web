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
import { StyledTablePagination } from '../../../PaginationCssFile/TablePaginationStyles'
// import { FaBriefcase   } from 'react-icons/fa';
import { FiGitBranch } from 'react-icons/fi';
import BusinessIcon from '@mui/icons-material/Business';
import '../../ReusablecodeforTable/styles.css';
import ExcelJS from 'exceljs';
import PDFExporter from '../../ReusablecodeforTable/PDFExporter'
import ExcelExporter from '../../ReusablecodeforTable/ExcelExporter'
import jwt_decode from 'jwt-decode';
import { FiUser } from "react-icons/fi";
const token=Cookies.get("token");
// let role=null
// if(token){
//   const decodetoken=jwt_decode(token);
//    role=decodetoken.role;
// }
// console.log("n",role)
const UserManage = () => {
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [formData, setFormData] = useState({})
  // const [formData, setFormData] = useState({ companyId: '', branchId: '',supervisorId:'' })
    const [branchError, setBranchError] = useState(false)
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
  const [companyData, setCompanyData] = useState([]);
  const [BranchData, setBranchData] = useState([]);
  const [SupervisorData, setSupervisorData] = useState([]);
  const handleEditModalClose = () => {
    setFormData({})
    setEditModalOpen(false)
  }

  const handleAddModalClose = () => {
    setFormData({})
    setAddModalOpen(false)
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
const [role, setRole] = useState(null);

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
  // ##################### getting data  ###################
  const fetchData = async (page = 1) => {
    const accessToken = Cookies.get('token');
    const url = `https://rocketsales-server.onrender.com/api/salesman`;
  
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      });
  
      // Log the full response data to inspect its structure
      console.log("Full Response Data:", response.data);
  
      // Process the salesmandata
      const salesmandata = response.data.salesmandata.map((item) => ({
        ...item,
        companyName: item.companyId?.companyName || null, // Extract companyName or set null
        companyId: item.companyId?._id || null,          // Extract companyId or set null
        branchName: item.branchId?.branchName || null,   // Extract branchName or set null
        branchId: item.branchId?._id || null,            // Extract branchId or set null
        supervisorName: item.supervisorId?.supervisorName || null, // Extract supervisorName or set null
        supervisorId: item.supervisorId?._id || null,    // Extract supervisorId or set null
      }));
  
      console.log("Processed Data:", salesmandata);
  
      if (salesmandata) {
        // Filter the data based on the search query if it is not empty
        const filteredData = salesmandata
          .map((item) => {
            // Apply the formatDate method to 'createdAt' field if it exists
            if (item.createdAt) {
              item.createdAt = formatDate(item.createdAt); // Use your custom formatDate method
            }
  
            return item;
          })
          .filter((item) =>
            Object.values(item).some((value) =>
              value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
            )
          );
  
        setData(filteredData); // Set the filtered data to `data`
        setSortedData(filteredData); // Set the filtered data to `sortedData`
        setLoading(false);
      } else {
        console.error('Salesman data is missing or incorrectly structured.');
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error fetching data:', error);
      throw error; // Re-throw the error for further handling if needed
    }
  };
  
  
  
  const fetchCompany = async () => {
    const accessToken = Cookies.get('token');
    const url = `https://rocketsales-server.onrender.com/api/company`;
  
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
    const url = `https://rocketsales-server.onrender.com/api/branch`;
  
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
    const url = `https://rocketsales-server.onrender.com/api/supervisor`;
  
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
  useEffect(() => {
    fetchCompany();
    fetchBranch();
    fetchsupervisor();
  }, []);
  // Format the date into DD-MM-YYYY format
  function formatDate(date) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0'); // Add leading zero if single digit
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Add leading zero to month
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }
  
  // Example: parsing the formatted date string back to a Date object if needed
  function parseDate(dateString) {
    const [day, month, year] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  }
  
  useEffect(() => {
    setLoading(true)
    // fetchcompany()
    fetchData() // Refetch data when searchQuery changes
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

  // const handleAddSubmit = async (e) => {
  //   e.preventDefault()
  //   console.log(formData)
  //   try {
  //     const accessToken = Cookies.get('token')
  //     const response = await axios.post(`https://rocketsales-server.onrender.com/api/salesman`, formData, {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //         'Content-Type': 'application/json',
  //       },
  //     })

  //     if (response.status === 201) {
  //       toast.success('Branch is created successfully')
  //       fetchData()
  //       setFormData({ name: '' })
  //       setAddModalOpen(false)
  //     }
  //     fetchData();
  //   } catch (error) {
  //     toast.error('An error occured')
  //     throw error.response ? error.response.data : new Error('An error occurred')
  //   }
  // }
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
        `https://rocketsales-server.onrender.com/api/salesman`,
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
  const handleEditSubmit = async (e) => {
    e.preventDefault()
    console.log(formData)
    try {
      const accessToken = Cookies.get('token')
      const response = await axios.put(
        `https://rocketsales-server.onrender.com/api/salesman/${formData._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )

      if (response.status === 200) {
        toast.success('group is edited successfully')
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

 
  const haqndleDeletesubmit = async (item) => {
    if (!item._id) {
      toast.error('Invalid item selected for deletion.')
      return
    }

    const confirmed = confirm('Do you want to delete this user?')
    if (!confirmed) return

    try {
      const accessToken = Cookies.get('token')
      if (!accessToken) {
        toast.error('Authentication token is missing.')
        return
      }

      const response = await axios({
        method: 'DELETE', // Explicitly specifying DELETE method
        // url: `https://rocketsales-server.onrender.com/api/delete-branch/${item._id}`,
        url: `https://rocketsales-server.onrender.com/api/salesman/${item._id}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.status === 200) {
        toast.success('Group deleted successfully')
        fetchData()
      }
    } catch (error) {
      console.error('Error Details:', error.response || error.message)
      toast.error('An error occurred while deleting the group.')
    }
  }


  
  const exportToExcel = ExcelExporter({
  
    columns: COLUMNS(),
    data: filteredData,
    fileName: 'UserManage_data.xlsx',
    mytitle:'UserManage Data Report',
  });

const exportToPDF = PDFExporter({
  title: 'UserManage Data Report',
  columns: COLUMNS(),
  data: filteredData,
  fileName: 'UserManage_data_report.pdf',
});
const filteredBranches = formData.companyId
? BranchData.filter((branch) => branch.companyId._id === formData.companyId)
: []
  return (
    <div className="d-flex flex-column mx-md-3 mt-3 h-auto">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="d-flex justify-content-between mb-2">
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
            <FiGitBranch  style={{ fontSize: '24px', color: '#4c637c' }} />
            Manage User
          </h2>
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
        height: "40px", // Ensure consistent height
        padding: "8px 12px",
        fontSize: "16px",
        borderRadius: "8px",
        border: "1px solid #ccc",
      }}
    />
  </div>

  {/* Settings Dropdown */}


  {/* Add Button */}
  <div className="add-container d-flex align-items-center" onClick={() => setAddModalOpen(true)}>
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
        marginLeft:'12px'
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
                      backgroundColor: index % 2 === 0 ? 'transparent':  '#f1f8fd', // Grey for even rows, transparent for odd rows
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
                        backgroundColor: index % 2 === 0 ? 'transparent':'#f1f8fd'  ,
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
                          backgroundColor: index % 2 === 0 ?'transparent' : '#f1f8fd',
                        }}
                      >
                        {item[col.accessor] || '--'}
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
        supervisorId: '', // Reset supervisor when company changes
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
          supervisorId: '' // Reset supervisor when branch changes
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

<FormControl variant="outlined" sx={{ marginBottom: '10px' }} fullWidth>
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
</FormControl>
          </>

          ): null}
          {COLUMNS().slice(0, -4).map((column) => (
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
        supervisorId: '', // Reset supervisor when company changes
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
          supervisorId: '' // Reset supervisor when branch changes
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

<FormControl variant="outlined" sx={{ marginBottom: '10px' }} fullWidth>
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
</FormControl>
            </>
          ) : role == 2 ? (
            <>
              {/* <FormControl variant="outlined" sx={{ marginBottom: '10px' }} fullWidth>
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
        supervisorId: '', // Reset supervisor when branch changes
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
</FormControl>
          </>

          ): null}
         
          {COLUMNS().slice(0, -4).map((column) => (
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

export default UserManage
