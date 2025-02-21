// import React, { useState } from 'react'
// import {
//   TableContainer,
//   Paper,
//   IconButton,
//   Dialog,
//   DialogContent,
//   Typography,
//   Button,
//   InputBase,
// } from '@mui/material'
// import { RiEdit2Fill } from 'react-icons/ri'
// import { AiFillDelete } from 'react-icons/ai'
// import SearchIcon from '@mui/icons-material/Search'
// import girl1 from './/Images/girl-1.jpg'
// import girls3 from './Images/girls-3.jpg'
// import girls5 from './Images/girls-5.jpg'
// import mens1 from './Images/mens-1.jpg'
// import mens2 from './Images/mens-2.jpg'
// import mens4 from './Images/mens-4.jpg'
// import {
//   CTable,
//   CTableBody,
//   CTableDataCell,
//   CTableHead,
//   CTableHeaderCell,
//   CTableRow,
//   CImage,
// } from '@coreui/react'

// const data = [
//   {
//     id: 101,
//     name: 'John',
//     mobile: '9045116165',
//     status: 'Present',
//     statu: 'Absent',
//     image: girl1,
//   },
//   {
//     id: 102,
//     name: 'Dom',
//     mobile: '90451161554',
//     status: 'Present',
//     statu: 'Absent',
//     image: mens1,
//   },
//   {
//     id: 103,
//     name: 'Paul',
//     mobile: '9045886165',
//     status: 'Present',
//     statu: 'Absent',
//     image: girls3,
//   },
//   {
//     id: 104,
//     name: 'Whick',
//     mobile: '9045116165',
//     status: 'Present',
//     statu: 'Absent',
//     image: mens2,
//   },
//   {
//     id: 105,
//     name: 'Kavin',
//     mobile: '909996165',
//     status: 'Present',
//     statu: 'Absent',
//     image: mens4,
//   },
//   {
//     id: 106,
//     name: 'Olive',
//     mobile: '9088116165',
//     status: 'Present',
//     statu: 'Absent',
//     image: girls5,
//   },
// ]

// // Function to get status color
// const getStatusColor = (status) => {
//   return status === 'Present' ? 'green' : 'red'
// }

// const Manual = () => {
//   const [open, setOpen] = useState(false) // Dialog state for image zoom
//   const [selectedImage, setSelectedImage] = useState(null) // Holds the currently selected image for zoom
//   const [showSearch, setShowSearch] = useState(false) // Toggles the search bar visibility
//   const [searchQuery, setSearchQuery] = useState('') // Holds the user's search input

//   // Function to handle image click and open zoom modal
//   const handleImageClick = (image) => {
//     setSelectedImage(image)
//     setOpen(true) // Opens the dialog/modal
//   }

//   // Function to close the modal
//   const handleClose = () => {
//     setOpen(false)
//     setSelectedImage(null)
//   }

//   const handleSearchIconClick = () => {
//     setShowSearch(!showSearch)
//     if (showSearch) setSearchQuery('') // Reset the search when collapsing
//   }

//   // Filter data based on search query for Name, Mobile No, and ID
//   const filteredData = data.filter((item) => {
//     const searchLower = searchQuery.toLowerCase()
//     return (
//       item.name.toLowerCase().includes(searchLower) ||
//       item.mobile.toLowerCase().includes(searchLower) ||
//       item.id.toString().toLowerCase().includes(searchLower)
//     )
//   })

//   return (
//     <div>
//       <div
//         style={{
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           paddingBottom: '10px',
//         }}
//       >
//         <Typography variant="h6" gutterBottom>
//           Manual Attendance
//         </Typography>
//         <div style={{ display: 'flex', alignItems: 'center' }}>
//           {showSearch && (
//             <InputBase
//               placeholder="Search..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               style={{
//                 marginRight: '5px',
//                 backgroundColor: '#f0f0f0',
//                 borderRadius: '3px',
//                 padding: '5px 10px',
//                 transition: 'width 0.5s',
//                 width: showSearch ? '200px' : '0px',
//               }}
//             />
//           )}
//           <IconButton onClick={handleSearchIconClick} style={{ color: 'grey' }}>
//             <SearchIcon />
//           </IconButton>
//         </div>
//       </div>

//       <div
//         style={{
//           overflowX: 'auto',
//           backgroundColor: '#212631',
//           borderRadius: '10px',
//         }}
//       >
//         <TableContainer component={Paper} style={{ width: '100%' }}>
//           <CTable align="middle" className="mb-0 border" hover responsive>
//             <CTableHead className="text-nowrap">
//               <CTableRow>
//                 <CTableHeaderCell className="bg-body-tertiary text-center">Image</CTableHeaderCell>
//                 <CTableHeaderCell className="bg-body-tertiary text-center">ID</CTableHeaderCell>
//                 <CTableHeaderCell className="bg-body-tertiary text-center">Name</CTableHeaderCell>
//                 <CTableHeaderCell className="bg-body-tertiary text-center">
//                   Mobile No
//                 </CTableHeaderCell>
//                 <CTableHeaderCell className="bg-body-tertiary text-center">Status</CTableHeaderCell>
//                 <CTableHeaderCell className="bg-body-tertiary text-center">
//                   Actions
//                 </CTableHeaderCell>
//               </CTableRow>
//             </CTableHead>
//             <CTableBody>
//               {filteredData.map((item, index) => (
//                 <CTableRow key={index}>
//                   <CTableDataCell className="text-center">
//                     <CImage
//                       rounded
//                       thumbnail
//                       src={item.image}
//                       onClick={() => handleImageClick(item.image)}
//                       style={{ width: '60px', height: '60px', cursor: 'pointer' }} // Image size handling
//                     />
//                   </CTableDataCell>
//                   <CTableDataCell className="text-center">{item.id}</CTableDataCell>
//                   <CTableDataCell className="text-center">{item.name}</CTableDataCell>
//                   <CTableDataCell className="text-center">{item.mobile}</CTableDataCell>
//                   <CTableDataCell className="text-center">
//                     <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
//                       <Typography
//                         style={{
//                           backgroundColor: getStatusColor(item.status),
//                           color: 'white',
//                           padding: '4px 10px',
//                           borderRadius: '10px',
//                           display: 'inline-block',
//                         }}
//                       >
//                         {item.status}
//                       </Typography>
//                       <Typography
//                         style={{
//                           backgroundColor: getStatusColor(item.statu),
//                           color: 'white',
//                           padding: '4px 10px',
//                           borderRadius: '10px',
//                           display: 'inline-block',
//                         }}
//                       >
//                         {item.statu}
//                       </Typography>
//                     </div>
//                   </CTableDataCell>
//                   <CTableDataCell className="text-center">
//                     <IconButton aria-label="edit">
//                       <RiEdit2Fill style={{ fontSize: '25px', color: 'blue' }} />
//                     </IconButton>
//                     <IconButton aria-label="delete">
//                       <AiFillDelete style={{ fontSize: '25px', color: 'brown' }} />
//                     </IconButton>
//                   </CTableDataCell>
//                 </CTableRow>
//               ))}
//             </CTableBody>
//           </CTable>
//         </TableContainer>
//       </div>

//       {/* Modal for zoomed image */}
//       <Dialog
//         open={open}
//         onClose={handleClose}
//         PaperProps={{
//           style: {
//             overflow: 'hidden',
//             borderRadius: '0',
//             maxWidth: 'none',
//           },
//         }}
//       >
//         <DialogContent style={{ padding: 0 }}>
//           {selectedImage && (
//             <img
//               src={selectedImage}
//               alt="Zoomed"
//               style={{
//                 width: '500px', // Zoomed image size
//                 height: '500px',
//                 objectFit: 'cover',
//                 borderRadius: '0',
//               }}
//             />
//           )}
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }

// export default Manual

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
import { BsBuildingsFill } from 'react-icons/bs'
// import '../../ReusablecodeforTable/styles.css';
import '../../ReusablecodeforTable/Styles.css'
import ExcelJS from 'exceljs';
import PDFExporter from '../../ReusablecodeforTable/PDFExporter'
import ExcelExporter from '../../ReusablecodeforTable/ExcelExporter'
// import { BsFillPersonCheckFill } from 'react-icons/bs'
import { BsClipboardCheck } from 'react-icons/bs';
import debounce from 'lodash.debounce';

const Manual = () => {
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
    const url = `${import.meta.env.VITE_SERVER_URL}/api/manualattendence`;

    console.log("Token:", accessToken);

    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (response.data && response.data.absentSalesmen) {
            // Process and filter the absent salesmen data
            const filteredData = response.data.absentSalesmen
                .map((item) => ({
                    ...item,
                    createdAt: item.createdAt ? formatDate(item.createdAt) : null, // Format date
                    salesmanName: item.salesmanName || 'N/A', // Fallback in case name is missing
                    salesmanId:item._id||'N/A',
                    salesmanEmail: item.salesmanEmail || 'N/A', // Fallback in case email is missing
                    salesmanPhone: item.salesmanPhone || 'N/A', // Fallback in case phone is missing
                    companyName: item.companyId ? item.companyId.companyName : 'N/A', // Fallback for company name
                    branchName: item.branchId ? item.branchId.branchName : 'N/A', // Fallback for branch name
                    supervisorName: item.supervisorId ? item.supervisorId.supervisorName : 'N/A', // Fallback for supervisor name
                    companyId: item.companyId ? item.companyId._id : 'N/A', // Fallback for company name
                    branchId: item.branchId ? item.branchId._id : 'N/A', // Fallback for branch name
                    supervisorId: item.supervisorId ? item.supervisorId._id : 'N/A', // Fallback for supervisor name
                  }))
                .filter((item) =>
                    Object.values(item).some((value) =>
                        value !== null && value.toString().toLowerCase().includes(searchQuery.toLowerCase())
                    )
                );

            setData(filteredData); // Set the filtered data to `data`
            setSortedData(filteredData); // Set the filtered data to `sortedData`
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
    setLoading(true);
    fetchData();
  }, []);
  // useEffect(() => {
  //   setLoading(true)
  //   fetchData() // Refetch data when searchQuery changes
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
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const debouncedFilter = useCallback(
    debounce((query, data) => {
      if (!query) {
        setFilteredData(data);
      } else {
        // const filtered = data.filter((item) =>
        //   Object.values(item).some((value) =>
        //     value.toString().toLowerCase().includes(query.toLowerCase())
        //   )
        // );
        const filtered = data.filter((item) =>
          Object.entries(item).some(([key, value]) =>
            key !== "profileImage" && (value?.toString() ?? "").toLowerCase().includes(query.toLowerCase())
          )
        );            
        
        setFilteredData(filtered);
      }
    }, 500),
    []
  );
  useEffect(() => {
    if (data && data.length > 0) {
      debouncedFilter(searchQuery, data);
    }
  }, [searchQuery, data, debouncedFilter]);
  
  useEffect(() => {
    return () => debouncedFilter.cancel();
  }, [debouncedFilter]);

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
    mytitle:'Branches Data Report',
    columns: COLUMNS(),
    data: filteredData,
    fileName: 'Manual_data.xlsx',
   
  });

const exportToPDF = PDFExporter({
  title: 'Manual Data Report',
  columns: COLUMNS(),
  data: filteredData,
  fileName: 'Manual_data_report.pdf',
});


const handleMarkAbsent = async (item) => {
  try {
    console.log(`${item.salesmanName} marked as absent`);
    
    const absentData = {
      salesmanId: item._id,
      salesmanName: item.salesmanName,
      companyId: item.companyId !== "N/A" ? item.companyId : null,
      branchId: item.branchId !== "N/A" ? item.branchId : null,
      supervisorId: item.supervisorId !== "N/A" ? item.supervisorId : null,
      attendenceStatus: 'Absent',
    };
console.log("MYAA",absentData)
    const accessToken = Cookies.get('token');

    const response = await axios.post(
      `${import.meta.env.VITE_SERVER_URL}/api/attendence`,
      absentData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.status == 201) {
      // toast.success(`${item.salesmanName} has been marked as absent successfully!`);
      // toast.success(
      //   <span>
         
      //     <span style={{ color: 'red', fontWeight: 'bold' }}> {item.salesmanName} has been marked as{' '} Absent successfully!</span> 
      //   </span>
      // );
      toast.success(
        <span>
          {item.salesmanName} has been marked as{' '}
          <span style={{ color: 'red', fontWeight: 'bold' }}>Absent</span> successfully!
        </span>
      );
    

      fetchData();
    }

   
    
  } catch (error) {
    console.error('Error marking salesman as absent:', error);
    if (error.response) {
      console.error('Error Response:', error.response.data);
    }
    alert('Failed to mark the salesman as absent');
  }
};



// Handler for marking a salesman as present
const handleMarkPresent = async (item) => {
  try {
    console.log(`${item.salesmanName} marked as absent`);
    
    const absentData = {
      salesmanId: item._id,
      salesmanName: item.salesmanName,
      companyId: item.companyId !== "N/A" ? item.companyId : null,
      branchId: item.branchId !== "N/A" ? item.branchId : null,
      supervisorId: item.supervisorId !== "N/A" ? item.supervisorId : null,
      attendenceStatus: 'Present',
    };
console.log("MYAA",absentData)
    const accessToken = Cookies.get('token');

    const response = await axios.post(
      `${import.meta.env.VITE_SERVER_URL}/api/attendence`,
      absentData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.status == 201) {
      // toast.success(`${item.salesmanName} has been marked as present successfully!`);
      toast.success(
        <span>
          {item.salesmanName} has been marked as{' '}
          <span style={{ color: 'green', fontWeight: 'bold' }}>Present</span> successfully!
        </span>
      );
      fetchData();
    }

   
    
  } catch (error) {
    console.error('Error marking salesman as absent:', error);
    if (error.response) {
      console.error('Error Response:', error.response.data);
    }
    alert('Failed to mark the salesman as absent');
  }
};

// Inline CSS for buttons
const absentButtonStyle = {
  backgroundColor: 'red',
  color: 'white',
  border: 'none',
  padding: '5px 10px',
  cursor: 'pointer',
  marginRight: '5px',
  borderRadius:'17px'
};

const presentButtonStyle = {
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
            <BsClipboardCheck style={{ fontSize: '24px', color: '#4c637c' }} />
            Manual Attendance
          </h2>
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
            ) : filteredData.length > 0 ? (
              filteredData
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
       <button
                onClick={() => handleMarkAbsent(item)}  // Call your method to mark as absent
                style={absentButtonStyle}  // Apply inline CSS
            >
                Absent
            </button>

            <button
                onClick={() => handleMarkPresent(item)}  // Call your method to mark as present
                style={presentButtonStyle}  // Apply inline CSS
            >
                Present
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

export default Manual
