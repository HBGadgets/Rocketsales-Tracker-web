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
  import { FiGitBranch } from 'react-icons/fi'
  import BusinessIcon from '@mui/icons-material/Business'
  import '../../ReusablecodeforTable/styles.css'
  import ExcelJS from 'exceljs'
  import PDFExporter from '../../ReusablecodeforTable/PDFExporter'
  import ExcelExporter from '../../ReusablecodeforTable/ExcelExporter'
  import jwt_decode from 'jwt-decode'
  import EditIcon from '@mui/icons-material/Edit'
  import DeleteIcon from '@mui/icons-material/Delete'
  import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered'
  import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled'
  import RoomIcon from '@mui/icons-material/Room';
  import { Checkbox, FormControlLabel } from '@mui/material';
  import VisibilityIcon from '@mui/icons-material/Visibility';
import debounce from 'lodash.debounce';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
// import { set } from 'core-js/core/dict'

  // const token = Cookies.get('token')
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
    const [role, setRole] = useState(null)
    // const columns = COLUMNS()
    const columns = COLUMNS(role);
    const [sortedData, setSortedData] = useState([])
    const [companyData, setCompanyData] = useState([])
    const [BranchData, setBranchData] = useState([])
    const [SupervisorData, setSupervisorData] = useState([])
    const [taskModalOpen, setTaskModalOpen] = useState(false)
    const [taskData, setTaskData] = useState([])
    const [selectedRow, setSelectedRow] = useState([])
    const [taskAddModalOpen, setTaskAddModalOpen] = useState(false)
    const [tokenData, setTokenData] = useState([])
    const [newTask, setNewTask] = useState({
      taskDescription: '',
      deadline: '',
      assignedTo: [],
      companyId: '',
      branchId: '',
      supervisorId: '',
      latitude: null, // Initialize as null
      longitude: null, // Initialize as null
      address:"",

    });
    const [editTaskModalOpen, setEditTaskModalOpen] = useState(false);
  const [editTaskData, setEditTaskData] = useState({
    _id: '',
    taskDescription: '',
    deadline: '',
    address: '',
    latitude: null,
    longitude: null,
    status: 'Pending', // Add status field
  });
  const handleEditTask = (task) => {
    setEditTaskData({
      _id: task._id,
      taskDescription: task.taskDescription,
      deadline: task.deadline.split('T')[0],
      address: task.address,
      latitude: task.latitude,
      longitude: task.longitude,
      status: task.status || 'Pending', // Add status from task
    });
    setEditTaskModalOpen(true);
  };
  const handleStatusChange = async (item) => {
    try {
      const token = Cookies.get('token');
      const newStatus = item.status === "Completed" ? "Pending" : "Completed"; // Toggle status
  
      // API call to update status
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/task/status/${item._id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (response.status === 200) {
        toast.success(`Task marked as ${newStatus}`);
  
        // ✅ Update state instantly instead of making an extra GET request
        setTaskData((prevTasks) =>
          prevTasks.map((task) =>
            task._id === item._id ? { ...task, status: newStatus } : task
          )
        );
        fetchData(); // Refresh the task data
      }
    } catch (error) {
      toast.error('Error updating task status');
      console.error('Task status update error:', error);
    }
  };
  
  
    // Add this function to handle task updates
    const handleEditTaskSubmit = async (e) => {
      e.preventDefault();
      try {
        const token = Cookies.get('token');
        const response = await axios.put(
          `${import.meta.env.VITE_SERVER_URL}/api/task/${editTaskData._id}`,
          {
            ...editTaskData,
            deadline: new Date(editTaskData.deadline).toISOString(),
            status: editTaskData.status,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
    
        if (response.status === 200) {
          toast.success('Task updated successfully');
          // Refresh task data
          const taskResponse = await axios.get(
            `${import.meta.env.VITE_SERVER_URL}/api/task/${selectedRow._id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setTaskData(taskResponse.data);
          setEditTaskModalOpen(false);
        }
      } catch (error) {
        toast.error('Error updating task');
        console.error('Task update error:', error);
      }
    };
    // Update selectedRow effect to set company/branch/supervisor
    useEffect(() => {
      if (selectedRow) {
        setNewTask((prev) => ({
          ...prev,
          companyId: selectedRow.companyId,
          branchId: selectedRow.branchId,
          supervisorId: selectedRow.supervisorId,
          assignedTo: [selectedRow._id], // Set the salesman ID as assignedTo
        }))
      }
    }, [selectedRow])
    // Handle form field changes
    const handleTaskFieldChange = (e) => {
      const { name, value } = e.target;

      setNewTask((prevTask) => ({
        ...prevTask,
        [name]: name === "latitude" || name === "longitude" ? parseFloat(value) || 0 : value, // Convert to number
      }));
    }
    // Handle task submission
    const handleTaskSubmit = async (e) => {
      e.preventDefault()
      try {
        const token = Cookies.get('token')
        
        const response = await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/api/task`,
          {
            ...newTask,
          
            deadline: new Date(newTask.deadline).toISOString(), // Convert to ISO format
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        )
        
        if (response.status === 201) {
          toast.success('Task created successfully')
          // Refresh task data
          const taskResponse = await axios.get(
            `${import.meta.env.VITE_SERVER_URL}/api/task/${selectedRow._id}`,
            { headers: { Authorization: `Bearer ${token}` } },
          )
          setTaskData(taskResponse.data)
          setTaskAddModalOpen(false)
          setNewTask({
            taskDescription: '',
            deadline: '',
            assignedTo: [],
            companyId: '',
            branchId: '',
            supervisorId: '',
            latitude: '',
            longitude: '',
            address:'',
          })
        }
      } catch (error) {
        toast.error('Error creating task')
        console.error('Task creation error:', error)
      }
    }
    const handleEditModalClose = () => {
      setFormData({})
      setEditModalOpen(false)
    }

    const handleAddModalClose = () => {
      setFormData({})
      setAddModalOpen(false)
    }
    const handleTaskModalClose = () => {
      // setFormData({})
      setTaskData([])
      setTaskModalOpen(false)
    }
    const handleRowClick = async (item) => {
      console.log('row clicked', item)
      setSelectedRow(item)
      setTaskModalOpen(true)
      const id = item._id
      const token = Cookies.get('token')
      try {
        // Fetch the task details from the API
        const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/task/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
          },
        })
        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`)
        }

        const data = await response.json()
        console.log('Task details:', data)
        setTaskData(data)

        // Perform any state updates or logic with the fetched data
        // setSelectedRow(data); // Save the fetched task details for the modal
      } catch (error) {
        console.error('Failed to fetch task details:', error.message)
      }
    }
    const handleTaskDelete = async (item) => {
      const id = item
      const token = Cookies.get('token')
      try {
        // Send a DELETE request to the API
        const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/task/${id}`, {
          method: 'DELETE', // Ensure it's DELETE, not "Delete"
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
          },
        })

        if (!response.ok) {
          // Handle error if response is not OK
          throw new Error(`Error: ${response.status} - ${response.statusText}`)
        }

        // If the task is deleted successfully, update the state (taskData)
        // Assuming the response contains the updated task data or status
        // If no response body is returned, you can simply filter out the task from the state.
        const data = await response.json()
        console.log('Deleted task:', data) // Log the response or data if necessary

        // Update state to remove the task from taskData
        setTaskData((prevData) => prevData.filter((task) => task._id !== id))
      } catch (error) {
        console.error('Failed to delete task:', error.message)
      }
    }
    const handleAddTaskBySal = () => {
      console.log('selected row', selectedRow)
      setTaskAddModalOpen(true)
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

    useEffect(() => {
      const fetchRole = () => {
        const token = Cookies.get('token')
        if (token) {
          const decodedToken = jwt_decode(token)
          console.log('decoded token', decodedToken);
          setTokenData(decodedToken)
          setRole(decodedToken.role)
        } else {
          setRole(null)
        }
      }

      fetchRole() // Call the function to fetch role
    }, [])
    // ##################### getting data  ###################
    // const fetchData = async (page = 1) => {
    //   const accessToken = Cookies.get('token')
    //   const url = `https://rocketsales-server.onrender.com/api/salesman`

    //   try {
    //     const response = await axios.get(url, {
    //       headers: {
    //         Authorization: 'Bearer ' + accessToken,
    //       },
    //     })

    //     // Log the full response data to inspect its structure
    //     console.log('Full Response Data:', response.data)

    //     // Process the salesmandata
    //     const salesmandata = response.data.salesmandata.map((item) => ({
    //       ...item,
    //       companyName: item.companyId?.companyName || null, // Extract companyName or set null
    //       companyId: item.companyId?._id || null, // Extract companyId or set null
    //       branchName: item.branchId?.branchName || null, // Extract branchName or set null
    //       branchId: item.branchId?._id || null, // Extract branchId or set null
    //       supervisorName: item.supervisorId?.supervisorName || null, // Extract supervisorName or set null
    //       supervisorId: item.supervisorId?._id || null, // Extract supervisorId or set null
    //     }))

    //     console.log('Processed Data:', salesmandata)

    //     if (salesmandata) {
    //       // Filter the data based on the search query if it is not empty
    //       const filteredData = salesmandata
    //         .map((item) => {
    //           // Apply the formatDate method to 'createdAt' field if it exists
    //           if (item.createdAt) {
    //             item.createdAt = formatDate(item.createdAt) // Use your custom formatDate method
    //           }

    //           return item
    //         })
    //         .filter((item) =>
    //           Object.values(item).some((value) =>
    //             value?.toString().toLowerCase().includes(searchQuery.toLowerCase()),
    //           ),
    //         )

    //       setData(filteredData) // Set the filtered data to `data`
    //       setSortedData(filteredData) // Set the filtered data to `sortedData`
    //       setLoading(false)
    //     } else {
    //       console.error('Salesman data is missing or incorrectly structured.')
    //       setLoading(false)
    //     }
    //   } catch (error) {
    //     setLoading(false)
    //     console.error('Error fetching data:', error)
    //     throw error // Re-throw the error for further handling if needed
    //   }
    // }
    // const fetchData = async () => {
    //   const accessToken = Cookies.get('token');
    //   // const url = `https://rocketsales-server.onrender.com/api/salesman`;
    //   // const url = `https://rocketsales-server.onrender.com/api/salesman`;
    //   const salId = tokenData.id;
    //   const url = (role == 5) ? `${import.meta.env.VITE_SERVER_URL}/api/task/${salId}` : `https://rocketsales-server.onrender.com/api/salesman`;
    
    //   try {
    //     const response = await axios.get(url, {
    //       headers: { Authorization: `Bearer ${accessToken}` },
    //     });
    
    //     console.log("dta of tasssskksksksksksksksk", response.data);
    //     // Ensure the response contains the salesmandata array
    //     if (response.data && response.data.salesmandata) {
    //       const formattedData = response.data.salesmandata.map((item) => ({
    //         ...item,
    //         companyName: item.companyId?.companyName || null, // Extract companyName or default to null
    //         companyId: item.companyId?._id || null,             // Extract companyId or default to null
    //         branchName: item.branchId?.branchName || null,       // Extract branchName or default to null
    //         branchId: item.branchId?._id || null,                // Extract branchId or default to null
    //         supervisorName: item.supervisorId?.supervisorName || null, // Extract supervisorName or default to null
    //         supervisorId: item.supervisorId?._id || null,        // Extract supervisorId or default to null
    //         // Format the createdAt date if it exists
    //         createdAt: item.createdAt ? formatDate(item.createdAt) : item.createdAt,
    //       }));
    
    //       // Filter the data based on the search query
    //       const filteredData = formattedData.filter((item) =>
    //         Object.values(item).some((value) =>
    //           value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    //         )
    //       );
    
    //       setData(filteredData);
    //       setSortedData(filteredData);
    //       setLoading(false);
    //     }else if(true){
      
    //     } 
    //     else {
    //       console.error('Salesman data is missing or incorrectly structured.');
    //       setLoading(false);
    //     }
    //   } catch (error) {
    //     setLoading(false);
    //     console.error('Error fetching salesman data:', error);
    //   }
    // };
    const fetchData = async () => {
      const accessToken = Cookies.get('token'); 
      
      try {
        let url;
        let response;
        
        if (tokenData.role==5) { // Salesman role
          url = `${import.meta.env.VITE_SERVER_URL}/api/task/${tokenData.id}`;
          response = await axios.get(url, { 
            headers: { Authorization: `Bearer ${accessToken}` } 
          });
          // Transform task data to match table structure
          const formattedData = response.data.map(task => ({
            ...task,
            _id: task._id,
            salesmanName: task.assignedTo[0]?.salesmanName || 'N/A',
            companyName: task.companyId?.companyName || 'N/A',
            branchName: task.branchId?.branchName || 'N/A',
            supervisorName: task.supervisorId?.supervisorName || 'N/A',
            createdAt: task.createdAt ? formatDate(task.createdAt) : 'N/A',
            // Add other task-related fields as needed
          }));
          console.log("dta of tasssskksksksksksksksk", formattedData);
          setData(formattedData);
          setSortedData(formattedData);
        } else {
          url = `${import.meta.env.VITE_SERVER_URL}/api/salesman`;
          response = await axios.get(url, { 
            headers: { Authorization: `Bearer ${accessToken}` } 
          });
    
          // Original salesman data processing
          const formattedData = response.data.salesmandata.map((item) => ({
            ...item,
            companyName: item.companyId?.companyName || null,
            branchName: item.branchId?.branchName || null,
            supervisorName: item.supervisorId?.supervisorName || null,
            createdAt: item.createdAt ? formatDate(item.createdAt) : item.createdAt,
          }));
    
          setData(formattedData);
          setSortedData(formattedData);
        }
    
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error('Error fetching data:', error);
      }
    };
    const fetchCompany = async () => {
      const accessToken = Cookies.get('token')
      const url = `${import.meta.env.VITE_SERVER_URL}/api/company`

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
      const url = `${import.meta.env.VITE_SERVER_URL}/api/branch`

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
      const url = `${import.meta.env.VITE_SERVER_URL}/api/supervisor`

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
    useEffect(() => {
      fetchCompany()
      fetchBranch()
      fetchsupervisor()
    }, [])
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
          setLoading(true);
          fetchData();
        }, [role]);
    // useEffect(() => {
    //   setLoading(true)
    //   // fetchcompany()
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

    const handleAddSubmit = async (e) => {
      e.preventDefault()
      try {
        const accessToken = Cookies.get('token')
        if (!accessToken) {
          throw new Error('Token is missing')
        }

        // Decode the token to get role and other details
        const decodedToken = jwt_decode(accessToken)

        // Determine the user's role and update formData accordingly
        if (decodedToken.role === 2) {
          formData.companyId = decodedToken.id // Use companyId from the token
        } else if (decodedToken.role === 3) {
          formData.companyId = decodedToken.companyId // Use companyId from the token
          formData.branchId = decodedToken.id // Use branchId from the token
        } else if (decodedToken.role === 4) {
          formData.supervisorId = decodedToken.id // Use supervisorId from the token
          formData.companyId = decodedToken.companyId // Use companyId from the token
          formData.branchId = decodedToken.branchId // Use branchId from the token
        }

        // Perform the POST request
        const response = await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/api/salesman`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          },
        )

        if (response.status === 201) {
          toast.success('Branch is created successfully')
          fetchData() // Refresh data
          setFormData({ name: '' }) // Reset form data
          setAddModalOpen(false) // Close modal
        }
      } catch (error) {
        toast.error('An error occurred')
        throw error.response ? error.response.data : new Error('An error occurred')
      }
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
    const handleEditSubmit = async (e) => {
      e.preventDefault()
      console.log(formData)
      try {
        const accessToken = Cookies.get('token')
        const response = await axios.put(
          `${import.meta.env.VITE_SERVER_URL}/api/salesman/${formData._id}`,
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
          url: `${import.meta.env.VITE_SERVER_URL}/api/salesman/${item._id}`,
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
      mytitle: 'UserManage Data Report',
    })

    const exportToPDF = PDFExporter({
      title: 'UserManage Data Report',
      columns: COLUMNS(),
      data: filteredData,
      fileName: 'UserManage_data_report.pdf',
      
    })
   
    
    

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
              <FiGitBranch style={{ fontSize: '24px', color: '#4c637c' }} />
              Task Assignment
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
            {/* <div
              className="add-container d-flex align-items-center"
              onClick={() => setAddModalOpen(true)}
            >
              <div className="add-icon">+</div>
              <span className="add-text ms-2">ADD</span>
            </div> */}
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
                  Tasks
                </CTableHeaderCell>
                {/* <CTableHeaderCell
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
                </CTableHeaderCell> */}
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
                        backgroundColor: index % 2 === 0 ? 'transparent' : '#f1f8fd', // Grey for even rows, transparent for odd rows
                        transition: 'background-color 0.3s ease',
                        borderBottom: '1px solid #e0e0e0',
                        
                      }}
                      // onClick={() => handleRowClick(item)}
                      onClick={role !== 5 ? () => handleRowClick(item) : undefined}
                      hover
                    >
                      <CTableDataCell
                        className="text-center"
                        onClick={() => handleRowClick(item)}
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
                          onClick={() => handleRowClick(item)}
                          style={{
                            padding: '0px 12px',
                            color: '#242424',
                            fontSize: '13px',
                            backgroundColor: index % 2 === 0 ? 'transparent' : '#f1f8fd',
                          }}
                        >
                          {item[col.accessor] || '--'}
                        </CTableDataCell>
                      ))}

                      {/* <CTableDataCell
          className={`text-center table-cell ${index % 2 === 0 ? 'table-cell-even' : 'table-cell-odd'}`}
        >
          <IconButton
            aria-label="edit"
            onClick={() => handleEditGroup(item)}
            className="icon-button icon-button-edit"
          >
            <RiEdit2Fill className="icon-button-icon" />
          </IconButton>

        
        </CTableDataCell>          */}
                      <CTableDataCell
                        className={`text-center table-cell ${index % 2 === 0 ? 'table-cell-even' : 'table-cell-odd'}`}
                      >
                        {role === 5 ? (<>
    {/* <IconButton
      aria-label="edit"
      className="icon-button icon-button-edit"
    >
      <CheckCircleIcon className="icon-button-icon" />
    </IconButton>
     <IconButton
     aria-label="edit"
     className="icon-button icon-button-delete"
   >
     <RadioButtonUncheckedIcon className="icon-button-icon" />
   </IconButton> */}
   <IconButton
  aria-label="status"
  className="icon-button icon-button-status"
  onClick={() => handleStatusChange(item)} // Dynamic status update
>
  {item.status === "Completed" ? (
    <CheckCircleIcon className="icon-button-icon" style={{ color: "green" }} />
  ) : (
    <RadioButtonUncheckedIcon className="icon-button-icon" style={{ color: "red" }} />
  )}
</IconButton>

   </>) : ( <IconButton
    aria-label="edit"
    // onClick={() => handleEditGroup(item)}
    className="icon-button icon-button-edit"
  >
    <VisibilityIcon className="icon-button-icon" />
  </IconButton>)}
                       

                        {/* <IconButton
                          aria-label="delete"
                          onClick={() => haqndleDeletesubmit(item)}
                          className="icon-button icon-button-delete"
                        >
                          <AiFillDelete className="icon-button-icon" />
                        </IconButton> */}
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
                            Array.isArray(companyData)
                              ? companyData.find((company) => company._id == formData.companyId)
                              : null
                          }
                          onChange={(event, newValue) =>
                            setFormData({
                              ...formData,
                              companyId: newValue?._id || '',
                            })
                          }
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
                              ? SupervisorData.find(
                                  (supervisor) => supervisor._id === formData.supervisorId,
                                )
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
                              ? SupervisorData.find(
                                  (supervisor) => supervisor._id === formData.supervisorId,
                                )
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
                  ) : null}
                  {COLUMNS()
                    .slice(0, -3)
                    .map((column) => (
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
                            <InputAdornment position="start">{column.icon}</InputAdornment>
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
                          value={
                            Array.isArray(companyData)
                              ? companyData.find((company) => company._id == formData.companyId)
                              : null
                          }
                          onChange={(event, newValue) =>
                            setFormData({
                              ...formData,
                              companyId: newValue?._id || '',
                            })
                          }
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
                              ? SupervisorData.find(
                                  (supervisor) => supervisor._id === formData.supervisorId,
                                )
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
                              ? SupervisorData.find(
                                  (supervisor) => supervisor._id === formData.supervisorId,
                                )
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
                  ) : null}

                  {COLUMNS()
                    .slice(0, -3)
                    .map((column) => (
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
                            <InputAdornment position="start">{column.icon}</InputAdornment>
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
          open={taskModalOpen}
          onClose={handleTaskModalClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <div className="d-flex justify-content-between">
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Task details
              </Typography>
              <IconButton onClick={handleTaskModalClose}>
                <CloseIcon />
              </IconButton>
            </div>

            {/* Task List */}
            <div style={{ marginTop: '20px', maxHeight: '400px', overflowY: 'auto' }}>
              {taskData && taskData.length > 0 ? (
                taskData.map((task) => (
                  <div
                    key={task._id}
                    style={{
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      padding: '10px',
                      marginBottom: '10px',
                      backgroundColor: "#f1f8fd",
                      // backgroundColor: task.status === 'Completed' ? 'lightgreen' : '#f1f8fd',
                    }}
                  >
                    {/* Task Description and Status */}
                    <div className="d-flex align-items-center justify-content-between">
                      <Typography variant="subtitle1" component="h3">
                        <strong>{task.taskDescription}</strong>
                      </Typography>
                      {/* <div
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor:
                      task.status === "Completed" ? "green" : "offwhite",
                  }}
                ></div> */}
                    </div>
                    
                    <Typography variant="body2" color="textSecondary" style={{ marginTop: '5px' }}>
                      <strong>Address: </strong>{task.address}
                    </Typography>    
                    {/* Deadline */}
                    <Typography variant="body2" color="textSecondary" style={{ marginTop: '5px' }}>
                    <strong>Deadline: </strong> {new Date(task.deadline).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" style={{ marginTop: '5px' }}>
                    <strong>Status: </strong> {task.status}
                    </Typography>
                    
                    {/* Edit and Delete Icons */}
                    <div className="d-flex justify-content-end" style={{ marginTop: '1px' }}>
                      {/* <IconButton
                  onClick={() => alert(`Edit task with ID: ${task._id}`)}
                  style={{ marginRight: "10px" }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => alert(`Delete task with ID: ${task._id}`)}
                >
                  <DeleteIcon />
                </IconButton> */}
                     
                     
                    </div>
                    <div className="d-flex align-items-center justify-content-end" style={{ gap: "10px", marginTop: "1px" }}>
  <IconButton
    aria-label="status"
    className="icon-button icon-button-fab"
    onClick={() => handleStatusChange(task)}
    style={{ color: "#FFFFFF", opacity: 1 }}
  >
    {task.status === "Completed" ? (
      <CheckCircleIcon className="icon-button-icon" style={{ color: "green" }} />
    ) : (
      <RadioButtonUncheckedIcon className="icon-button-icon" style={{ color: "red" }} />
    )}
  </IconButton>

  <IconButton
    aria-label="edit"
    onClick={() => handleEditTask(task)}
    className="icon-button icon-button-edit"
  >
    <RiEdit2Fill className="icon-button-icon" />
  </IconButton>

  <IconButton
    aria-label="delete"
    onClick={() => handleTaskDelete(task._id)}
    className="icon-button icon-button-delete"
  >
    <AiFillDelete className="icon-button-icon" />
  </IconButton>
</div>


                    {/* Company, Branch, and Supervisor Info */}
                    {/* <Typography variant="body2" style={{ marginTop: "5px" }}>
                <strong>Company:</strong> {task.companyId?.companyName}
              </Typography>
              <Typography variant="body2" style={{ marginTop: "5px" }}>
                <strong>Branch:</strong> {task.branchId?.branchName}
              </Typography>
              <Typography variant="body2" style={{ marginTop: "5px" }}>
                <strong>Supervisor:</strong> {task.supervisorId?.supervisorName}
              </Typography> */}
                  </div>
                ))
              ) : (
                <Typography>No tasks available</Typography>
              )}
            </div>

            {/* Add Task Button */}
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <Button variant="contained" color="primary" onClick={() => handleAddTaskBySal()}>
                Add Task
              </Button>
            </div>
          </Box>
        </Modal>
        <Modal
          open={taskAddModalOpen}
          onClose={() => setTaskAddModalOpen(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <div className="d-flex justify-content-between">
              <Typography id="modal-modal-title" variant="h6" component="h2">
                ADD Task
              </Typography>
              <IconButton onClick={() => setTaskAddModalOpen(false)}>
                <CloseIcon />
              </IconButton>
            </div>

            <form onSubmit={handleTaskSubmit}>
              <TextField
                label="Task Description"
                name="taskDescription"
                value={newTask.taskDescription}
                onChange={handleTaskFieldChange}
                fullWidth
                margin="normal"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FormatListNumberedIcon />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Deadline"
                name="deadline"
                type="date"
                value={newTask.deadline}
                onChange={handleTaskFieldChange}
                fullWidth
                margin="normal"
                required
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccessTimeFilledIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Address"
                name="address"
                value={newTask.address}
                onChange={handleTaskFieldChange}
                fullWidth
                margin="normal"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <RoomIcon/>
                    </InputAdornment>
                  ),
                }}
              />
  {/* <TextField
    label="Latitude"
    name="latitude"
    value={newTask.latitude ?? ""} // Handle null by showing empty string
    onChange={handleTaskFieldChange}
    fullWidth
    margin="normal"
    type="number"
    inputProps={{ step: "any" }} // Allow decimal values
  />

  <TextField
    label="Longitude"
    name="longitude"
    value={newTask.longitude ?? ""} // Handle null by showing empty string
    onChange={handleTaskFieldChange}
    fullWidth
    margin="normal"
    type="number"
    inputProps={{ step: "any" }} // Allow decimal values
  /> */}

              <Button variant="contained" color="primary" type="submit" style={{ marginTop: '20px' }}>
                Submit
              </Button>
            </form>
          </Box>
        </Modal>
  {/* Edit task modal */}
        <Modal
    open={editTaskModalOpen}
    onClose={() => setEditTaskModalOpen(false)}
    aria-labelledby="edit-task-modal"
  >
    <Box sx={style}>
      <div className="d-flex justify-content-between">
        <Typography variant="h6" component="h2">
          Edit Task
        </Typography>
        <IconButton onClick={() => setEditTaskModalOpen(false)}>
          <CloseIcon />
        </IconButton>
      </div>
      <form onSubmit={handleEditTaskSubmit}>
        <TextField
          label="Task Description"
          name="taskDescription"
          value={editTaskData.taskDescription}
          onChange={(e) => setEditTaskData({...editTaskData, taskDescription: e.target.value})}
          fullWidth
          margin="normal"
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FormatListNumberedIcon />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="Deadline"
          name="deadline"
          type="date"
          value={editTaskData.deadline}
          onChange={(e) => setEditTaskData({...editTaskData, deadline: e.target.value})}
          fullWidth
          margin="normal"
          required
          InputLabelProps={{ shrink: true }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccessTimeFilledIcon />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="Address"
          name="address"
          value={editTaskData.address}
          onChange={(e) => setEditTaskData({...editTaskData, address: e.target.value})}
          fullWidth
          margin="normal"
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <RoomIcon/>
              </InputAdornment>
            ),
          }}
        />
  {/* Add a Checkbox to manage the task status */}
 
        
         
        
        
      

        {/* <TextField
          label="Latitude"
          name="latitude"
          type="number"
          value={editTaskData.latitude || ''}
          onChange={(e) => setEditTaskData({...editTaskData, latitude: parseFloat(e.target.value) || null})}
          fullWidth
          margin="normal"
          inputProps={{ step: "any" }}
        /> */}

        {/* <TextField
          label="Longitude"
          name="longitude"
          type="number"
          value={editTaskData.longitude || ''}
          onChange={(e) => setEditTaskData({...editTaskData, longitude: parseFloat(e.target.value) || null})}
          fullWidth
          margin="normal"
          inputProps={{ step: "any" }}
        /> */}
        <FormControlLabel
    control={
      <Checkbox
        checked={editTaskData.status === 'Completed'}
        onChange={(e) => 
          setEditTaskData({
            ...editTaskData,
            status: e.target.checked ? 'Completed' : 'Pending'
          })
        }
        color="primary"
      />
    }
    label="Completed"
    style={{ marginTop: '10px' }}
  />
        <Button 
          variant="contained" 
          color="primary" 
          type="submit" 
          style={{ marginTop: '20px' }}
        >
          Update Task
        </Button>
      </form>
    </Box>
  </Modal>
      </div>
    )
  }

  export default UserManage
