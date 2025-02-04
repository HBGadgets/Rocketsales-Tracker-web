

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
import { BsBuildingsFill } from 'react-icons/bs'
import '../../ReusablecodeforTable/styles.css';
import ExcelJS from 'exceljs';
import PDFExporter from '../../ReusablecodeforTable/PDFExporter'
import ExcelExporter from '../../ReusablecodeforTable/ExcelExporter'
import { BsCalendarCheck } from 'react-icons/bs';
import { FaClock } from 'react-icons/fa';
import { CTooltip } from '@coreui/react';
const SalesmanLeaveRequest = () => {
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
  const handleEditModalClose = () => {
    setFormData({})
    setEditModalOpen(false)
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

  // ##################### getting data  ###################
  const fetchData = async (page = 1) => {
    const accessToken = Cookies.get('token');
    const url = `https://rocketsales-server.onrender.com/api/leaverequest`;

    console.log("Token:", accessToken);

    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        console.log("Response Data:", response.data);

        if (response.data && response.data.data) {
            // Process and map the leave request data
            const processedData = response.data.data.map((item) => ({
                _id: item._id,
                createdAt: item.createdAt ? formatDate(item.createdAt) : 'N/A', 
                leaveRequestStatus: item.leaveRequestStatus || 'N/A',
                leaveStartdate: item.leaveStartdate || 'N/A',
                leaveEnddate: item.leaveEnddate || 'N/A',
                reason: item.reason || 'N/A',
                salesmanName: item.salesmanId?item.salesmanId.salesmanName : 'N/A',
                salesmanId: item.salesmanId?._id || 'N/A',
                companyName: item.companyId?.companyName || 'N/A',
                companyId: item.companyId?._id || 'N/A',
                branchName: item.branchId?.branchName || 'N/A',
                branchId: item.branchId?._id || 'N/A',
                supervisorName: item.supervisorId?.supervisorName || 'N/A',
                supervisorId: item.supervisorId?._id || 'N/A',
            }));

            setData(processedData);
            setSortedData(processedData);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        setLoading(false);
    }
};




  
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
    mytitle:'Branches Data Report',
    columns: COLUMNS(),
    data: filteredData,
    fileName: 'SalesmanLeaveRequest_data.xlsx',
   
  });

const exportToPDF = PDFExporter({
  title: 'SalesmanLeaveRequest Data Report',
  columns: COLUMNS(),
  data: filteredData,
  fileName: 'SalesmanLeaveRequest_data_report.pdf',
});


const handleMarkApprove = async (item) => {
  try {
    console.log(`Request Approved Successfully!`);
    console.log("mnb",`https://rocketsales-server.onrender.com/api/leaverequest/${item._id}`)
    const absentData = {
      leaveRequestStatus: 'Approve',
    };
console.log("MYAA",absentData)
    const accessToken = Cookies.get('token');

    const response = await axios.put(
      `https://rocketsales-server.onrender.com/api/leaverequest/${item._id}`,
      absentData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.status == 200) {
      alert(`${item.salesmanName} Request Approved successfully!`);
      fetchData();
    }

   
    
  } catch (error) {
    console.error('Error marking salesman request approve:', error);
    if (error.response) {
      console.error('Error Response:', error.response.data);
    }
    alert('Failed to mark the salesman request approve');
  }
};



// Handler for marking a salesman as present
const handleMarkReject= async (item) => {
  try {
    console.log(`Request Rejected Successfully!`);
    
    const absentData = {
      leaveRequestStatus: 'Reject',
    };
console.log("MYAA",absentData)
    const accessToken = Cookies.get('token');

    const response = await axios.put(
      `https://rocketsales-server.onrender.com/api/leaverequest/${item._id}`,
      absentData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.status == 200) {
      alert(`${item.salesmanName} Request Rejected successfully!`);
      fetchData();
    }

   
    
  } catch (error) {
    console.error('Error marking salesman as Reject:', error);
    if (error.response) {
      console.error('Error Response:', error.response.data);
    }
    alert('Failed to mark the salesman request reject');
  }
};

// Inline CSS for buttons
const approveButtonStyle = {
  backgroundColor: 'red',
  color: 'white',
  border: 'none',
  padding: '5px 10px',
  cursor: 'pointer',
  marginRight: '5px',
  borderRadius:'17px'
};

const rejectButtonStyle = {
  backgroundColor: 'green',
  color: 'white',
  border: 'none',
  padding: '5px 10px',
  cursor: 'pointer',
  borderRadius:'17px'
};

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
            <FaClock  style={{ fontSize: '24px', color: '#4c637c' }} />
            Salesman Leave Request
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
      backgroundColor: index % 2 === 0 ? 'transparent' : '#f1f8fd',
    }}
  >
    {col.accessor === 'reason' ? (
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
       <button
                onClick={() => handleMarkApprove(item)}  // Call your method to mark as absent
                style={approveButtonStyle}  // Apply inline CSS
            >
                Approve
            </button>

            <button
                onClick={() => handleMarkReject(item)}  // Call your method to mark as present
                style={rejectButtonStyle}  // Apply inline CSS
            >
                Reject
            </button>
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
    </div>
  )
}

export default SalesmanLeaveRequest
