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
import { Autocomplete } from '@mui/material'
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
import { FaThumbsUp } from 'react-icons/fa'
import { CTooltip } from '@coreui/react'
import debounce from 'lodash.debounce'
import myGif from '../../ReusablecodeforTable/loadergif.gif'
// import { useNavigate } from 'react-router-dom';
const SalesmanTaskReport = () => {
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
  const [status, setStatus] = useState('');

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
  
    console.log("Selected Period:", selectedPeriod);
    console.log("Selected Salesmen:", selectedSalesmen);
    console.log("Selected Status:", status);
  
    // Convert selected salesmen array into a comma-separated string
    const salesmanIds = selectedSalesmen.length > 0 ? selectedSalesmen.join(",") : "";
  
    // Construct the base URL
    url = `${import.meta.env.VITE_SERVER_URL}/api/taskreport?`;
  
    // Append IDs if selected
    if (salesmanIds) {
      url += `ids=${salesmanIds}&`;
    }
  
    // Append Status if selected and it's NOT "All"
    if (status && status !== "All") {
      url += `status=${status}&`;
    }
  
    // Handle date range and period logic
    if (selectedPeriod && selectedPeriod !== "Custom") {
      url += `filter=${selectedPeriod}`;
    } else if (startDate && endDate) {
      url += `startDate=${startDate}&endDate=${endDate}`;
    }
  
    // Remove the trailing '&' if it exists
    url = url.endsWith("&") ? url.slice(0, -1) : url;
  
    console.log("Final URL:", url);
    console.log("Access Token:", accessToken);
  
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      console.log("Response:", response.data);
  
      if (response.data.tasks) {
        // Format response data correctly
        const formattedData = response.data.tasks.map((item) => ({
          ...item,
          createdAt: item.createdAt ? formatDate(item.createdAt) : null,
          updatedAt: item.updatedAt ? formatDate(item.updatedAt) : null,
          salesmanName: item.assignedTo ? item.assignedTo.salesmanName : null,
          companyName: item.companyId ? item.companyId.companyName : null,
          branchName: item.branchId ? item.branchId.branchName : null,
          supervisorName: item.supervisorId ? item.supervisorId.supervisorName : null,
        }));
  
        setData(formattedData);
        setSortedData(formattedData);
        setLoading(false);
      } else {
        console.error("Error: No tasks found in response.");
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
      throw error;
    }
  };
  
  
  // cc

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
  const debouncedFilter = useCallback(
    debounce((query, sourceData) => {
      if (!query) {
        setFilteredData(sourceData)
        return
      }
      const filtered = sourceData.filter((item) =>
        Object.values(item).some((value) =>
          value?.toString().toLowerCase().includes(query.toLowerCase()),
        ),
      )
      // const filtered = sourceData.filter(item =>
      //   Object.entries(item).some(([key, value]) => {
      //     if (key === 'profileImgUrl') return false; // Skip searching the profileImage field
      //     return value?.toString().toLowerCase().includes(query.toLowerCase());
      //   })
      // );

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

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10)
    setRowsPerPage(newRowsPerPage === -1 ? sortedData.length : newRowsPerPage) // Set to all rows if -1
    setPage(0) // Reset to the first page
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const exportToExcel = ExcelExporter({
    mytitle: 'Approved Request Data',
    columns: COLUMNS(),
    data: filteredData,
    fileName: 'Approve_Request_data.xlsx',
  })

  const exportToPDF = PDFExporter({
    title: 'Approved Request Data',
    columns: COLUMNS(),
    data: filteredData,
    fileName: 'Approve_Request_report.pdf',
  })

  const handleSort = (accessor) => {
    if (sortBy === accessor) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(accessor)
      setSortOrder('asc')
    }
  }
  useEffect(() => {
    if (sortBy) {
      const sorted = [...filteredData].sort((a, b) => {
        const aValue = a[sortBy]
        const bValue = b[sortBy]

        // Handle different data types
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortOrder === 'asc' ? aValue - bValue : bValue - aValue
        }

        // Handle dates
        if (aValue instanceof Date && bValue instanceof Date) {
          return sortOrder === 'asc' ? aValue - bValue : bValue - aValue
        }

        // Default string comparison
        return sortOrder === 'asc'
          ? String(aValue).localeCompare(String(bValue))
          : String(bValue).localeCompare(String(aValue))
      })

      setSortedData(sorted)
    } else {
      setSortedData(filteredData)
    }
  }, [filteredData, sortBy, sortOrder])

  const [selectedSalesmen, setSelectedSalesmen] = useState('')
const [salesmen, setSalesmen] = useState([])
  useEffect(() => {
    const fetchDatasalesman = async () => {
      const accessToken = Cookies.get('token')
      const url = `${import.meta.env.VITE_SERVER_URL}/api/salesman`

      try {
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })

        if (response.data && response.data.salesmandata) {
          const formattedData = response.data.salesmandata.map((item) => ({
            _id: item._id,
            username: item.username,
            salesmanName: item.salesmanName || 'Unknown',
          }))
          setSalesmen(formattedData)
        } else {
          console.error('Salesman data is missing or incorrectly structured.')
        }
      } catch (error) {
        console.error('Error fetching salesman data:', error)
      }
    }

    fetchDatasalesman()
  }, [])

  // const options = salesmen.map((salesman) => ({
  //   value: salesman.username,
  //   label: salesman.salesmanName,
  // }))
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
              <FaThumbsUp style={{ fontSize: '24px', color: '#4c637c' }} />
              Task Report
            </h2>
          </div>
          <div style={styles.container}>
            <div style={styles.inputGroup}>
              <label htmlFor="salesman" style={styles.label}>
                Salesman:
              </label>
             <FormControl fullWidth>
  <Autocomplete
    multiple
    id="searchable-salesman-select"
    options={Array.isArray(salesmen) ? salesmen : []} // Ensure it's an array
    getOptionLabel={(option) => option?.salesmanName || 'Unknown'} // Avoid undefined errors
    value={salesmen?.filter((salesman) =>
      selectedSalesmen?.includes(salesman?._id),
    ) || []} // Ensure proper filtering
    onChange={(event, newValue) => {
      const selectedUsernames = newValue?.map((salesman) => salesman?._id) || [];
      setSelectedSalesmen(selectedUsernames); // Update state safely
      console.log('Selected Salesmen:', selectedUsernames);
    }}
    renderInput={(params) => (
      <TextField
        {...params}
        placeholder={selectedSalesmen?.length > 0 ? '' : 'Select Salesman'} // Fix variable name
        variant="outlined"
        sx={{
          '& .MuiOutlinedInput-root': {
            height: '38px',
            minWidth: '150px',
            paddingRight: '32px',
          },
          '& input': {
            padding: '8px 14px',
          },
        }}
      />
    )}
  />
</FormControl>

            </div>
          </div>
          <div style={styles.container}>
          <div style={styles.inputGroup}>
    <label htmlFor="status" style={styles.label}>Status:</label>
    <FormControl fullWidth>
      <Select
        id="status-select"
        value={status}
        onChange={(event) => setStatus(event.target.value)}
        displayEmpty
        variant="outlined"
        sx={{
          '& .MuiOutlinedInput-root': {
            height: '38px',
            minWidth: '150px',
            paddingRight: '32px',
          },
          '& .MuiSelect-select': {
            padding: '8px 14px',
          },
        }}
      >
        <MenuItem value="">Select Status</MenuItem>
        <MenuItem value="All">All</MenuItem>
        <MenuItem value="Pending">Pending</MenuItem>
        <MenuItem value="Completed">Completed</MenuItem>
      </Select>
    </FormControl>
  </div>
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
                <option value="thisweek">This Week</option>
                <option value="prevweek">Previous Week</option>
                <option value="thismonth">This Month</option>
                <option value="lastmonth">Previous Month</option>
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
                  onClick={() => handleSort(col.accessor)}
                >
                  {col.Header}
                  {sortBy === col.accessor && (
                    <span style={{ marginLeft: '5px' }}>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
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

export default SalesmanTaskReport
