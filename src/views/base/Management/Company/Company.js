// import React, { useState } from 'react'
// import {
//   CTable,
//   CTableBody,
//   CTableDataCell,
//   CTableHead,
//   CTableHeaderCell,
//   CTableRow,
//   CImage,
//   CModal,
//   CModalBody,
//   CBadge,
// } from '@coreui/react'
// import { IconButton } from '@mui/material'
// import { RiEdit2Fill } from 'react-icons/ri'
// import { AiFillDelete } from 'react-icons/ai'
// import girl1 from './Images/girl-1.jpg'
// import girls3 from './Images/girls-3.jpg'
// import girls5 from './Images/girls-5.jpg'
// import mens1 from './Images/mens-1.jpg'
// import mens2 from './Images/mens-2.jpg'
// import mens4 from './Images/mens-4.jpg'

// const data = [
//   {
//     id: 101,
//     name: 'John',
//     mobile: '123-456-7890',
//     taskName: 'Task A',
//     location: 'New York',
//     completionDate: '2023-09-01',
//     deadline: '2023-09-10',
//     lastStatus: 'Complete',
//     image: girl1,
//   },
//   {
//     id: 102,
//     name: 'Dom',
//     mobile: '123-456-7449',
//     taskName: 'Task B',
//     location: 'London',
//     completionDate: '2023-08-28',
//     deadline: '2023-09-05',
//     lastStatus: 'In Process',
//     image: mens1,
//   },
//   {
//     id: 103,
//     name: 'Paul',
//     mobile: '123-456-7449',
//     taskName: 'Task C',
//     location: 'Paris',
//     completionDate: '2023-09-05',
//     deadline: '2023-09-12',
//     lastStatus: 'Pending',
//     image: girls3,
//   },
//   {
//     id: 104,
//     name: 'Whick',
//     mobile: '123-456-7449',
//     taskName: 'Task D',
//     location: 'Berlin',
//     completionDate: '2023-09-03',
//     deadline: '2023-09-15',
//     lastStatus: 'Complete',
//     image: mens2,
//   },
//   {
//     id: 105,
//     name: 'Kavin',
//     mobile: '123-456-7449',
//     taskName: 'Task E',
//     location: 'Madrid',
//     completionDate: '2023-09-07',
//     deadline: '2023-09-14',
//     lastStatus: 'In Process',
//     image: mens4,
//   },
//   {
//     id: 106,
//     name: 'Olive',
//     mobile: '123-456-7449',
//     taskName: 'Task F',
//     location: 'Tokyo',
//     completionDate: '2023-09-08',
//     deadline: '2023-09-16',
//     lastStatus: 'Pending',
//     image: girls5,
//   },
// ]

// const Company = () => {
//   const [open, setOpen] = useState(false)
//   const [selectedImage, setSelectedImage] = useState(null)

//   const handleImageClick = (image) => {
//     setSelectedImage(image)
//     setOpen(true)
//   }

//   const handleClose = () => {
//     setOpen(false)
//     setSelectedImage(null)
//   }

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'Complete':
//         return 'success'
//       case 'In Process':
//         return 'warning'
//       case 'Pending':
//         return 'danger'
//       default:
//         return 'secondary'
//     }
//   }

//   return (
//     <div>
//       <CTable align="middle" hover responsive>
//         <CTableHead>
//           <CTableRow>
//             <CTableHeaderCell className="center">Image</CTableHeaderCell>
//             <CTableHeaderCell className="center">ID</CTableHeaderCell>
//             <CTableHeaderCell className="center">Name</CTableHeaderCell>
//             <CTableHeaderCell className="center">Mobile No</CTableHeaderCell>
//             <CTableHeaderCell className="center">Task Name</CTableHeaderCell>
//             <CTableHeaderCell className="center">Location</CTableHeaderCell>
//             <CTableHeaderCell className="center">Completion Date</CTableHeaderCell>
//             <CTableHeaderCell className="center">Deadline</CTableHeaderCell>
//             <CTableHeaderCell className="center">Last Status</CTableHeaderCell>
//             <CTableHeaderCell className="center">Actions</CTableHeaderCell>
//           </CTableRow>
//         </CTableHead>
//         <CTableBody>
//           {data.map((item, index) => (
//             <CTableRow
//               key={index}
//               style={{
//                 backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#e0e0e0', // Alternating colors
//               }}
//             >
//               <CTableDataCell>
//                 <CImage
//                   rounded
//                   thumbnail
//                   src={item.image}
//                   onClick={() => handleImageClick(item.image)}
//                   style={{ width: '60px', height: '60px' }}
//                 />
//               </CTableDataCell>
//               <CTableDataCell>{item.id}</CTableDataCell>
//               <CTableDataCell>{item.name}</CTableDataCell>
//               <CTableDataCell>{item.mobile}</CTableDataCell>
//               <CTableDataCell>{item.taskName}</CTableDataCell>
//               <CTableDataCell>{item.location}</CTableDataCell>
//               <CTableDataCell>{item.completionDate}</CTableDataCell>
//               <CTableDataCell>{item.deadline}</CTableDataCell>
//               <CTableDataCell>
//                 <CBadge
//                   style={{
//                     padding: '10px 10px',
//                     borderRadius: '5px',
//                     display: 'inline-block',
//                   }}
//                   color={getStatusColor(item.lastStatus)}
//                 >
//                   {item.lastStatus}
//                 </CBadge>
//               </CTableDataCell>
//               <CTableDataCell>
//                 <div
//                   style={{
//                     display: 'flex',
//                     justifyContent: 'center',
//                     alignItems: 'center',
//                     gap: '10px',
//                   }}
//                 >
//                   <IconButton>
//                     <RiEdit2Fill color="lightBlue" />
//                   </IconButton>
//                   <IconButton>
//                     <AiFillDelete color="brown" />
//                   </IconButton>
//                 </div>
//               </CTableDataCell>
//             </CTableRow>
//           ))}
//         </CTableBody>
//       </CTable>

//       {/* Modal for Image Preview */}
//       <CModal alignment="center" visible={open} onClose={handleClose}>
//         <CModalBody>
//           <CImage src={selectedImage} style={{ width: '100%', height: 'auto' }} />
//         </CModalBody>
//       </CModal>
//     </div>
//   )
// }

// export default Company 

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
  InputAdornment
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
import TablePagination from "@mui/material/TablePagination";
import { useNavigate } from 'react-router-dom'
import Loader from '../../../../components/Loader/Loader';
import CloseIcon from '@mui/icons-material/Close';
import { MdConnectWithoutContact } from 'react-icons/md'
import { AiOutlineUpload } from 'react-icons/ai'
import ReactPaginate from 'react-paginate'
import Cookies from 'js-cookie'
import { IoMdAdd } from 'react-icons/io'
import toast, { Toaster } from 'react-hot-toast'
import * as XLSX from 'xlsx'; // For Excel export
import jsPDF from 'jspdf'; // For PDF export
import 'jspdf-autotable'; // For table formatting in PDF
import CIcon from '@coreui/icons-react'
import GroupIcon from '@mui/icons-material/Group'
import { cilSettings } from '@coreui/icons'
import "../../../../../src/app.css";
import { COLUMNS } from './columns';
import { StyledTablePagination } from "../../../../views/PaginationCssFile/TablePaginationStyles";

const Company = () => {
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  const [pageCount, setPageCount] = useState()
  // const handleEditModalClose = () => setEditModalOpen(false)
  // const handleAddModalClose = () => setAddModalOpen(false)
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const columns = COLUMNS();
const [sortedData, setSortedData] = useState([]);
  const handleEditModalClose = () => {
    setFormData({})
    setEditModalOpen(false)}


  const handleAddModalClose = () => {
    setFormData({})
    setAddModalOpen(false)}

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
  const fetchGroupData = async (page = 1) => {
    const accessToken = Cookies.get('token');
    const url = `https://rocketsales-server.onrender.com/api/get-companies`;
  
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      });
  
      if (response.data) {
        // Filter the data based on the search query if it is not empty
        const filteredData = response.data.filter(item =>
          Object.values(item).some(value =>
            value.toString().toLowerCase().includes(searchQuery.toLowerCase())
          )
        );
        
        setData(filteredData);  // Set the filtered data to `data`
        setSortedData(filteredData);  // Set the filtered data to `sortedData`
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error fetching data:', error);
      throw error; // Re-throw the error for further handling if needed
    }
  };
  useEffect(() => {
    setLoading(true);
    fetchGroupData();  // Refetch data when searchQuery changes
  }, [searchQuery]);  // Dependency array ensures the effect runs whenever searchQuery changes
  
 

  // ##################### Filter data by search query #######################
  const filterGroups = () => {
    if (!searchQuery) {
      setFilteredData(data); // No query, show all drivers
    } else {
      const filtered = data.filter(
        (group) =>
          group.companyName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredData(filtered);
      setCurrentPage(1)
    }
  };

 

  useEffect(() => {
    filterGroups(searchQuery);
  }, [data, searchQuery]);

  const handlePageClick = (e) => {
    console.log(e.selected + 1)
    let page = e.selected + 1
    setCurrentPage(page)
    setLoading(true)
    fetchGroupData(page)
  }

  
  
  const handleAddGroup = async (e) => {
    e.preventDefault()
    console.log(formData)
    try {
      const accessToken = Cookies.get('authToken')
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/group`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.status === 201) {
        toast.success('group is created successfully')
        fetchGroupData()
        setFormData({ name: '' })
        setAddModalOpen(false)
      }
    } catch (error) {
      toast.error('An error occured')
      throw error.response ? error.response.data : new Error('An error occurred')
    }
  }

  // ###################################################################
  // ######################### Edit Group #########################
  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage === -1 ? sortedData.length : newRowsPerPage); // Set to all rows if -1
    setPage(0); // Reset to the first page
  };
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const EditGroupSubmit = async (e) => {
    e.preventDefault()
    console.log(formData)
    try {
      const accessToken = Cookies.get('authToken')
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/group/${formData._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )

      if (response.status === 200) {
        toast.success('group is edited successfully')
        fetchGroupData()
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

  // ###################################################################

  // ###################### Delete Group ##############################

  const deleteGroupSubmit = async (item) => {
    const confirmed = confirm('Do you want to delete this user?');

    // If the user cancels, do nothing
    if (!confirmed) return;

    try {
      const accessToken = Cookies.get('authToken')
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/group/${item._id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (response.status === 200) {
        toast.error('group is deleted successfully')//success toast added in place of error
        fetchGroupData()
      }
    } catch (error) {
      toast.error('An error occurred')
      throw error.response ? error.response.data : new Error('An error occurred')
    }
  }

  const exportToExcel = () => {
    // Map filtered data into the format required for export
    const dataToExport = filteredData.map((item, rowIndex) => {
      const rowData = {
        SN: rowIndex + 1,
        Name: item.name || 'N/A',
      };

      return rowData;
    });

    // Create worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(dataToExport); // Convert data to worksheet format
    const workbook = XLSX.utils.book_new(); // Create a new workbook

    // Append the worksheet to the workbook with the sheet name 'User Data'
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Group Data');

    // Write the Excel file to the client's computer
    XLSX.writeFile(workbook, 'group_data.xlsx');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
  
    // Define the table headers based on the COLUMNS array
    const columns = COLUMNS().map((col) => col.Header); // Extract headers
  
    // Map over your filteredData to create rows
    const rows = filteredData.map((item) => {
      return COLUMNS().map((col) => item[col.accessor] || '--'); // Map values based on accessor
    });
  
    // Create table using autoTable
    doc.autoTable({
      head: [columns],  // Pass headers dynamically
      body: rows,       // Pass rows dynamically
      startY: 20,
    });
  
    // Save the PDF
    doc.save('group_data.pdf');
  };
  

  //  ###############################################################

  return (
    <div className="d-flex flex-column mx-md-3 mt-3 h-auto">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="d-flex justify-content-between mb-2">
        <div>
          <h2>Company</h2>
        </div>

        <div className="d-flex">
          <div className="me-3 d-none d-md-block">
            <input
              type="search"
              className="form-control"
              placeholder="search here..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div>
            <button
              onClick={() => setAddModalOpen(true)}
              variant="contained"
              className="btn btn-secondary"
            >
              Add Comapany
            </button>
          </div>
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

         {/* <TableContainer
      component={Paper}
      sx={{
        height: 'auto',
        overflowX: 'auto',
        overflowY: 'auto',
        marginBottom: '10px',
        borderRadius: '10px',
        border: '1px solid black',
      }}
    >
      <CTable
        style={{ fontFamily: 'Roboto, sans-serif', fontSize: '14px' }}
        bordered
        align="middle"
        className="mb-2 border min-vh-25 rounded-top-3"
        hover
        responsive
      >
        <CTableHead className="text-nowrap">
          <CTableRow>
            <CTableHeaderCell className="text-center bg-body-secondary">
              <strong>SN</strong>
            </CTableHeaderCell>
            {columns.map((col) => (
              <CTableHeaderCell
                key={col.accessor}
                className="text-center bg-body-secondary"
              >
                <strong>{col.Header}</strong>
              </CTableHeaderCell>
            ))}
            <CTableHeaderCell className="text-center bg-body-secondary">
              <strong>Actions</strong>
            </CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
  {loading ? (
    <CTableRow>
      <CTableDataCell colSpan={columns.length + 2} className="text-center">
        <div className="placeholder-glow">
          <span className="placeholder col-12" />
          <span className="placeholder col-12" />
          <span className="placeholder col-12" />
        </div>
      </CTableDataCell>
    </CTableRow>
  ) : sortedData.length > 0 ? (
    sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
      <CTableRow key={index}>
        <CTableDataCell
          className="text-center p-0"
          style={{
            backgroundColor: index % 2 === 0 ? '#ffffff' : '#eeeeefc2',
          }}
        >
          {index + 1}
        </CTableDataCell>
        {columns.map((col) => (
          <CTableDataCell
            key={col.accessor}
            className="text-center p-0"
            style={{
              backgroundColor: index % 2 === 0 ? '#ffffff' : '#eeeeefc2',
            }}
          >
            {item[col.accessor]}
          </CTableDataCell>
        ))}
        <CTableDataCell
          className="text-center d-flex p-0"
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: index % 2 === 0 ? '#ffffff' : '#eeeeefc2',
          }}
        >
          <IconButton aria-label="edit" onClick={() => handleEdit(item)}>
            <RiEdit2Fill style={{ fontSize: '20px', color: 'lightBlue', margin: '3px' }} />
          </IconButton>
          <IconButton aria-label="delete" onClick={() => handleDelete(item)}>
            <AiFillDelete style={{ fontSize: '20px', color: 'red', margin: '3px' }} />
          </IconButton>
        </CTableDataCell>
      </CTableRow>
    ))
  ) : (
    <CTableRow>
      <CTableDataCell colSpan={columns.length + 2} className="text-center">
        <div
          className="d-flex flex-column justify-content-center align-items-center"
          style={{ height: '200px' }}
        >
          <p className="mb-0 fw-bold">
            "Oops! Looks like there's no data available.
            <br /> Maybe it's time to add some entries!"
          </p>
          <div>
            <button
              onClick={() => setAddModalOpen(true)}
              variant="contained"
              className="btn btn-primary m-3 text-white"
            >
              <IoMdAdd className="fs-5" /> Add Entry
            </button>
          </div>
        </div>
      </CTableDataCell>
    </CTableRow>
  )}
</CTableBody>

      </CTable>
    </TableContainer> */}
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
            padding: '8px 12px', // Reduced padding for top and bottom
            borderBottom: '1px solid #e0e0e0', // Light border under headers
            textAlign: 'center', // Center header text
          }}
        >
          SN
        </CTableHeaderCell>
        {columns.map((col) => (
          <CTableHeaderCell
            key={col.accessor}
            className="text-center"
            style={{
              padding: '8px 12px', // Reduced padding for top and bottom
              borderBottom: '1px solid #e0e0e0', // Light border under headers
              textAlign: 'center', // Center header text
            }}
          >
            {col.Header}
          </CTableHeaderCell>
        ))}
        <CTableHeaderCell
          className="text-center"
          style={{
            padding: '8px 12px', // Reduced padding for top and bottom
            borderBottom: '1px solid #e0e0e0', // Light border under headers
            textAlign: 'center', // Center header text
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
              padding: '20px 0', // Reduced padding for top and bottom
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
                backgroundColor: index % 2 === 0 ? 'transparent' : 'transparent', // No background color
                transition: 'background-color 0.3s ease',
                borderBottom: '1px solid #e0e0e0',
              }}
              hover
            >
              <CTableDataCell
                className="text-center"
                style={{
                  padding: '8px 12px', // Reduced padding for top and bottom
                  color: '#555',
                  fontSize: '12px', // Smaller font size for table data
                }}
              >
                {index + 1}
              </CTableDataCell>

              {columns.map((col) => (
                <CTableDataCell
                  key={col.accessor}
                  className="text-center"
                  style={{
                    padding: '8px 12px', // Reduced padding for top and bottom
                    color: '#555',
                    fontSize: '12px', // Smaller font size for table data
                  }}
                >
                  {item[col.accessor] || '--'}
                </CTableDataCell>
              ))}

              <CTableDataCell
                className="text-center"
                style={{
                  padding: '8px 12px', // Reduced padding for top and bottom
                  display: 'flex',
                  justifyContent: 'center', // Center horizontally
                  alignItems: 'center', // Center vertically
                }}
              >
                <IconButton
                  aria-label="edit"
                  onClick={() => handleEdit(item)}
                  style={{
                    backgroundColor: '#4CAF50',
                    borderRadius: '50%',
                    padding: '8px',
                    marginRight: '8px',
                    transition: 'background-color 0.3s',
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#45a049';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = '#4CAF50';
                  }}
                >
                  <RiEdit2Fill style={{ fontSize: '18px', color: '#ffffff' }} />
                </IconButton>
                <IconButton
                  aria-label="delete"
                  onClick={() => handleDelete(item)}
                  style={{
                    backgroundColor: '#FF4C4C',
                    borderRadius: '50%',
                    padding: '8px',
                    transition: 'background-color 0.3s',
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#f44336';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = '#FF4C4C';
                  }}
                >
                  <AiFillDelete style={{ fontSize: '18px', color: '#ffffff' }} />
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
              padding: '20px 0', // Reduced padding for top and bottom
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










      <CDropdown className="position-fixed bottom-0 end-0 m-3">
        <CDropdownToggle
          color="secondary"
          style={{ borderRadius: '50%', padding: '10px', height: '48px', width: '48px' }}
        >
          <CIcon icon={cilSettings} />

        </CDropdownToggle>
        <CDropdownMenu>
          <CDropdownItem onClick={exportToPDF} >PDF</CDropdownItem>
          <CDropdownItem onClick={exportToExcel} >Excel</CDropdownItem>
        </CDropdownMenu>
      </CDropdown>
   
  <StyledTablePagination>
  <TablePagination
    rowsPerPageOptions={[{ label: "All", value: -1 },1, 10, 25, 100, 1000]}
    component="div"
    count={sortedData.length}
    rowsPerPage={rowsPerPage === sortedData.length ? -1 : rowsPerPage}
    page={page}
    onPageChange={(event, newPage) => {
      console.log("Page changed:", newPage);
      handleChangePage(event, newPage);
    }}
    onRowsPerPageChange={(event) => {
      console.log("Rows per page changed:", event.target.value);
      handleChangeRowsPerPage(event);
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
              Add New Group
            </Typography>
            <IconButton
           
              onClick={handleAddModalClose}
            >
              <CloseIcon />
            </IconButton>
          </div>
          <DialogContent>
            <form onSubmit={handleAddGroup}>
              <FormControl style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <TextField
                  label="Group Name"
                  name="name"
                  value={formData.name !== undefined ? formData.name : ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <GroupIcon
                          sx={{ borderRadius: "50%", backgroundColor: "rgba(0, 0, 0, 0.54)", color: "white", padding: "5px", fontSize: "28px" }}
                        />
                      </InputAdornment>
                    ),
                  }}
                />
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

      {/* edit model */}
      <Modal
        open={editModalOpen}
        onClose={handleEditModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="d-flex justify-content-between">
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Edit Group
            </Typography>
            <IconButton
              // style={{ marginLeft: 'auto', marginTop: '-40px', color: '#aaa' }}
              onClick={handleEditModalClose}
            >
              <CloseIcon />
            </IconButton>
          </div>
          <DialogContent>
            <form onSubmit={EditGroupSubmit}>
              <FormControl style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <TextField
                  label="Group Name"
                  name="name"
                  value={formData.name !== undefined ? formData.name : ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <GroupIcon
                          sx={{ borderRadius: "50%", backgroundColor: "rgba(0, 0, 0, 0.54)", color: "white", padding: "5px", fontSize: "28px" }}
                        />
                      </InputAdornment>
                    ),
                  }}
                />
              </FormControl>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                style={{ marginTop: '20px' }}
              >
                Edit
              </Button>
            </form>
          </DialogContent>
        </Box>
      </Modal>
    </div>
  )
}

export default Company
