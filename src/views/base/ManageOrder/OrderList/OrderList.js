// OrderList.js
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
  Grid,
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
import { Autocomplete } from '@mui/material'
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
import jwt_decode from 'jwt-decode'
import BusinessIcon from '@mui/icons-material/Business'
import { FiUser } from 'react-icons/fi'
import { FiGitBranch } from 'react-icons/fi'
import PDFExporter from '../../ReusablecodeforTable/PDFExporter'
import ExcelExporter from '../../ReusablecodeforTable/ExcelExporter'
import { LazyLoadImage } from 'react-lazy-load-image-component'
// import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from '@mui/icons-material'
import { IoShareSocialOutline } from 'react-icons/io5'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import DeleteIcon from '@mui/icons-material/Delete'
import './OrderList.css'
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material'
import PercentIcon from '@mui/icons-material/Percent' // Import GST percent icon
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber'
import DiscountIcon from '@mui/icons-material/Discount'
import myGif from "../../ReusablecodeforTable/loadergif.gif"
const OrderList = () => {
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [invoicemodalopen, setinvoicemodalopen] = useState(false)
  const [formData, setFormData] = useState({
    products: [{ productName: '', quantity: '', price: '' }],
  })
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
  const [BranchData, setBranchData] = useState([])

  const [selectedPeriod, setSelectedPeriod] = useState('today')
  const [showCustomDates, setShowCustomDates] = useState(false)
  const [role, setRole] = useState(null)
  const [companyData, setCompanyData] = useState([])
  const [SupervisorData, setSupervisorData] = useState([])
  const [SalesmanData, setSalesmanData] = useState([])
  const [ProductData, setProductData] = useState([])
  const [expandedRows, setExpandedRows] = useState([])
  const [invoiceFormData, setInvoiceFormData] = useState({})
   const [sortBy, setSortBy] = useState('')
    const [sortOrder, setSortOrder] = useState('asc')
  const toggleRowExpansion = (id) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id],
    )
  }
  const navigate = useNavigate()
  const handleEditModalClose = () => {
    setFormData({ products: [{ productName: '', quantity: '', price: '' }] })
    setEditModalOpen(false)
  }
  const handleEditSubmit = async (e) => {
    e.preventDefault()
    console.log(formData)
    try {
      const accessToken = Cookies.get('token')
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/order/${formData._id}`,
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
  const handleInvoiceSubmit = async (e) => {
    e.preventDefault()
    const accessToken = Cookies.get('token')

    try {
      if (!selectedOrder) {
        alert('Error: No order selected for invoice!')
        return
      }

      let products = selectedOrder.products || []

      // Ensure products is an array
      if (!Array.isArray(products) || products.length === 0) {
        console.error('Products array is empty!', products)
        alert('Error: Products list is missing!')
        return
      }

      // Calculate totalAmount and assign perPiecePrice as UnitPrice
      let totalAmount = 0
      products = products.map((product) => {
        const perPiecePrice = product.quantity ? product.price / product.quantity : 0
        totalAmount += product.price
        return { ...product, UnitPrice: perPiecePrice }
      })

      const requestData = {
        ...selectedOrder,
        products,
        totalAmount,
        customerName: selectedOrder.shopName || 'Unknown',
      }

      console.log('Final Data Sent to API:', JSON.stringify(requestData, null, 2))

      const response = await fetch('http://104.251.218.102:8080/api/invoice', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })

      const responseData = await response.json()

      if (!response.ok) {
        console.error('Server Error Response:', responseData)
        throw new Error(responseData.message || 'Failed to submit invoice')
      }

      console.log('Invoice submitted successfully:', responseData)
      alert('Invoice form created successfully')
      fetchData()
      handleInvoiceModalClose()
    } catch (error) {
      console.error('Error submitting invoice:', error)
      alert(`Submission Error: ${error.message}`)
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
  const filteredBranches = formData.companyId
    ? BranchData.filter((branch) => branch.companyId._id === formData.companyId)
    : []
  const handleEditGroup = async (item) => {
    console.log(item)
    setEditModalOpen(true)
    setFormData({ ...item })
    console.log('this is before edit', formData)
  }
  const haqndleIn = async (item) => {
    console.log('my item for invoice', item)
    setinvoicemodalopen(true)
    setFormData({ ...item })
    console.log('this is before invoice', formData)
  }
  const handleAddModalClose = () => {
    setFormData({ products: [{ productName: '', quantity: '', price: '' }] })
    setAddModalOpen(false)
  }
  const [selectedOrder, setSelectedOrder] = useState(null) // State to store matched order

  const handleAddSubmit = async (e) => {
    e.preventDefault()
    try {
      const accessToken = Cookies.get('token')
      if (!accessToken) throw new Error('Token is missing')

      const decodedToken = jwt_decode(accessToken)

      if (decodedToken.role === 2) {
        formData.companyId = decodedToken.id
      } else if (decodedToken.role === 3) {
        formData.companyId = decodedToken.companyId
        formData.branchId = decodedToken.id
      } else if (decodedToken.role === 4) {
        formData.supervisorId = decodedToken.id
        formData.companyId = decodedToken.companyId
        formData.branchId = decodedToken.branchId
      }

      const products = Array.isArray(formData.products)
        ? formData.products.map((product) => ({
            productName: product.productName || '',
            quantity: Number(product.quantity) || 0,
            price: Number(product.price) || 0,
          }))
        : []

      const orderData = {
        ...formData,
        products,
        shopName: formData.shopName || '',
        shopAddress: formData.shopAddress || '',
        shopOwnerName: formData.shopOwnerName || '',
        phoneNo: formData.phoneNo || '',
        deliveryDate: formData.deliveryDate || '',
      }

      console.log('Submitting Order Data:', orderData)

      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/order`, orderData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.status === 201) {
        const createdOrder = response.data.data._id
        console.log('Order Created Successfully:', createdOrder)

        toast.success('Order is created successfully')

        // Fetch updated order data
        await new Promise((resolve) => setTimeout(resolve, 2000)) // Increase delay
        const fetchedData = await fetchData()
        console.log('Fetched Data After Order Creation:', fetchedData)

        const matchedOrder = fetchedData.find(
          (order) => order._id?.toString() === createdOrder?.toString(),
        )

        if (!matchedOrder) {
          console.warn('New order not found in fetched data:', createdOrder)
        } else {
          console.log('Matched Order:', matchedOrder)
          setSelectedOrder(matchedOrder) // Update selectedOrder state
        }

        // Reset form data
        setFormData({ products: [{ productName: '', quantity: '', price: '' }] })
        setAddModalOpen(false)
      } else {
        throw new Error(`Unexpected response status: ${response.status}`)
      }
    } catch (error) {
      console.error('Error creating order:', error)
      toast.error(error.response?.data?.message || 'An error occurred')
    }
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
    width: '40%',
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

  const fetchData = async () => {
    setLoading(true)
    const accessToken = Cookies.get('token')
    let url

    console.log(selectedPeriod)

    if (selectedPeriod && selectedPeriod !== 'Custom') {
      url = `${import.meta.env.VITE_SERVER_URL}/api/order?filter=${selectedPeriod}`
    } else if (startDate && endDate) {
      url = `${import.meta.env.VITE_SERVER_URL}/api/order?startDate=${startDate}&endDate=${endDate}`
    } else {
      url = `${import.meta.env.VITE_SERVER_URL}/api/order`
    }

    console.log('my url', url)
    console.log('Access Token:', accessToken)

    try {
      const response = await axios.get(url, {
        headers: { Authorization: 'Bearer ' + accessToken },
      })

      console.log('Response order:', response.data)

      if (response.data) {
        const filteredData = response.data.data
          .map((item) => ({
            ...item,
            createdAt: item.createdAt ? formatDate(item.createdAt) : null,
            salesmanName: item.salesmanId ? item.salesmanId.salesmanName : null,
            companyName: item.companyId ? item.companyId.companyName : 'N/A',
            companyId: item.companyId ? item.companyId._id : 'N/A',
            branchName: item.branchId ? item.branchId.branchName : 'N/A',
            branchId: item.branchId ? item.branchId._id : 'N/A',
            companyAddress: item.branchId ? item.branchId.branchLocation : 'N/A',
            supervisorName: item.supervisorId ? item.supervisorId.supervisorName : null,
            supervisorId: item.supervisorId ? item.supervisorId._id : null,
            products: item.products || [],
          }))
          .filter((item) =>
            Object.values(item).some(
              (value) =>
                value !== null &&
                value !== undefined &&
                value.toString().toLowerCase().includes(searchQuery.toLowerCase()),
            ),
          )

        setData(filteredData) // Set the filtered data to `data`
        setSortedData(filteredData) // Set the filtered data to `sortedData`
        setLoading(false)

        return filteredData // ✅ Ensure function returns an array
      } else {
        console.warn('API response does not contain expected data:', response.data)
        setLoading(false)
        return [] // ✅ Return an empty array if data is missing
      }
    } catch (error) {
      setLoading(false)
      console.error('Error fetching data:', error)
      return [] // ✅ Return an empty array in case of an error
    }
  }

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
  const fetchsalesman = async () => {
    const accessToken = Cookies.get('token')
    const url = `${import.meta.env.VITE_SERVER_URL}/api/salesman`

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      })
      console.log('my data response', response.data)
      const salesman = response.data.salesman || []
      if (response.data) {
        // const companydata1 = response.data
        setSalesmanData(salesman || [])
      }
      console.log('salesman  are', SalesmanData)
    } catch (error) {
      setLoading(false)
      console.error('Error fetching data:', error)
      throw error // Re-throw the error for further handling if needed
    }
  }
  const fetchproduct = async () => {
    const accessToken = Cookies.get('token')
    const url = `${import.meta.env.VITE_SERVER_URL}/api/product`

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      })
      console.log('my data for product', response.data.data)
      if (response.data) {
        // const companydata1 = response.data
        setProductData(response.data.data)
      }
      console.log('products are', companyData)
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
    fetchsalesman()
    fetchproduct()
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
        group.productName.toLowerCase().includes(searchQuery.toLowerCase()),
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

  // Uncomment and modify the following block if you need deletion functionality
  const haqndleDeletesubmit = async (item) => {
    if (!item._id) {
      toast.error('Invalid item selected for deletion.')
      return
    }

    const confirmed = confirm('Do you want to delete this order?')
    if (!confirmed) return
    console.log(`${import.meta.env.VITE_SERVER_URL}/api/order/${item._id}`)
    try {
      const accessToken = Cookies.get('token')
      if (!accessToken) {
        toast.error('Authentication token is missing.')
        return
      }

      const response = await axios({
        method: 'DELETE', // Explicitly specifying DELETE method
        url: `${import.meta.env.VITE_SERVER_URL}/api/order/${item._id}`,
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
  // const [ProductData, setProductData] = useState([]); // Populate this with your fetched product data

  const handleProductChange = (index, newValue) => {
    const updatedProducts = [...formData.products]
    updatedProducts[index].productName = newValue?.productName || ''
    setFormData({ ...formData, products: updatedProducts })
  }

  const handleQuantityChange = (index, value) => {
    const updatedProducts = [...formData.products]
    updatedProducts[index].quantity = value
    setFormData({ ...formData, products: updatedProducts })
  }

  const handlePriceChange = (index, value) => {
    const updatedProducts = [...formData.products]
    updatedProducts[index].price = value
    setFormData({ ...formData, products: updatedProducts })
  }

  const addProductRow = () => {
    setFormData({
      ...formData,
      products: [...formData.products, { productName: '', quantity: '', price: '' }],
    })
  }
  const deleteProductRow = (index) => {
    const updatedProducts = [...formData.products]
    updatedProducts.splice(index, 1)
    setFormData({ ...formData, products: updatedProducts })
  }

  const handleInvoiceModalClose = () => {
    setFormData({})
    setinvoicemodalopen(false)
  }
  const handleInvoiceModalOpen = (event) => {
    handleAddSubmit(event) // Submit the form first
    setInvoiceFormData(formData) // Store the formData for invoice submission
    setinvoicemodalopen(true)
  }

  // Function to close the modal
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
              <ShoppingCart style={{ fontSize: '24px', color: '#4c637c' }} />
              Orders
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
            <span className="add-text ms-2">New Order</span>
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
              ></CTableHeaderCell>
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
                  <img src={myGif} alt="Animated GIF" width="100" />
                </CTableDataCell>
              </CTableRow>
            ) : sortedData.length > 0 ? (
              sortedData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item, index) => (
                  <React.Fragment key={item._id}>
                    <CTableRow
                      key={index}
                      style={{
                        backgroundColor: index % 2 === 0 ? 'transparent' : '#f1f8fd',
                        transition: 'background-color 0.3s ease',
                        borderBottom: '1px solid #e0e0e0',
                      }}
                      hover
                    >
                      {/* Expand Column */}
                      <CTableDataCell
                        style={{
                          padding: '0px 12px',
                          cursor: 'pointer',
                          backgroundColor: index % 2 === 0 ? 'transparent' : '#f1f8fd',
                        }}
                      >
                        <IconButton size="small" onClick={() => toggleRowExpansion(item._id)}>
                          {expandedRows.includes(item._id) ? (
                            <ArrowDropUp style={{ color: '#1d3d5f' }} />
                          ) : (
                            <ArrowDropDown style={{ color: '#1d3d5f' }} />
                          )}
                        </IconButton>
                      </CTableDataCell>
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
                        <IconButton
                          aria-label="delete"
                          onClick={() => haqndleIn(item)}
                          className="icon-button icon-button-icon"
                          style={{ backgroundColor: '#307ac4' }}
                        >
                          <IoShareSocialOutline className="icon-button-icon" />
                        </IconButton>
                      </CTableDataCell>
                    </CTableRow>

                    {expandedRows.includes(item._id) && (
                      <CTableRow>
                        <CTableDataCell
                          colSpan={columns.length + 3}
                          style={{ padding: '0 24px', backgroundColor: '#f9f9f9' }}
                        >
                          <div style={{ margin: '16px 0' }}>
                            <h5 style={{ marginBottom: '12px', color: '#1d3d5f' }}>
                              Products Details
                            </h5>
                            <CTable bordered hover>
                              <CTableHead>
                                <CTableRow>
                                  <CTableHeaderCell>Product Name</CTableHeaderCell>
                                  <CTableHeaderCell>Quantity</CTableHeaderCell>
                                  <CTableHeaderCell>Price</CTableHeaderCell>
                                  <CTableHeaderCell>Total</CTableHeaderCell>
                                </CTableRow>
                              </CTableHead>
                              <CTableBody>
                                {item.products.map((product, pIndex) => {
                                  const productTotal = product.quantity * product.price
                                  return (
                                    <CTableRow key={pIndex}>
                                      <CTableDataCell>{product.productName}</CTableDataCell>
                                      <CTableDataCell>{product.quantity}</CTableDataCell>
                                      <CTableDataCell>
                                        ₹
                                        {typeof product.price === 'number'
                                          ? product.price.toFixed(2)
                                          : '0.00'}
                                      </CTableDataCell>
                                      <CTableDataCell>
                                        ₹{productTotal ? productTotal.toFixed(2) : '0.00'}
                                      </CTableDataCell>
                                    </CTableRow>
                                  )
                                })}

                                {/* Gross Total Row */}
                                {item.products.length > 0 && (
                                  <CTableRow style={{ backgroundColor: '#f1f8fd' }}>
                                    <CTableDataCell
                                      colSpan={3}
                                      style={{ textAlign: 'right', fontWeight: 'bold' }}
                                    >
                                      Gross Total:
                                    </CTableDataCell>
                                    <CTableDataCell style={{ fontWeight: 'bold' }}>
                                      ₹
                                      {item.products
                                        .reduce(
                                          (sum, product) => sum + product.quantity * product.price,
                                          0,
                                        )
                                        .toFixed(2)}
                                    </CTableDataCell>
                                  </CTableRow>
                                )}
                              </CTableBody>
                            </CTable>
                            <div style={{ display: "flex", justifyContent: "flex-end" }}>
  <button onClick={() => haqndleIn(item)}
 style={styles.button}>
  Generate Invoice</button>
</div>
                          </div>
                        </CTableDataCell>
                      </CTableRow>
                    )}
                  </React.Fragment>

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
              Add New order
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
                <Box
                  sx={{
                    padding: 2,
                    borderRadius: 2,
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                    backgroundColor: '#fff',
                    maxWidth: '800px',
                    margin: '0 auto',
                  }}
                >
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{ textAlign: 'center', fontWeight: 'bold', marginBottom: 2 }}
                  >
                    Add Products
                  </Typography>

                  <FormControl variant="outlined" fullWidth>
                    {(formData.products || []).map((product, index) => (
                      <Grid
                        container
                        spacing={2}
                        key={index}
                        alignItems="center"
                        sx={{ marginBottom: 2 }}
                      >
                        {/* Product Dropdown */}
                        <Grid item xs={6} sm={6}>
                          <Autocomplete
                            id={`product-select-${index}`}
                            options={ProductData || []}
                            getOptionLabel={(option) => option.productName || ''}
                            value={
                              ProductData.find(
                                (item) => item.productName === formData.products[index].productName,
                              ) || null
                            }
                            onChange={(event, newValue) => handleProductChange(index, newValue)}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Select Product"
                                variant="outlined"
                                placeholder="Select Product"
                                size="small"
                                InputProps={{
                                  ...params.InputProps,
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <BusinessIcon />
                                    </InputAdornment>
                                  ),
                                }}
                                sx={{
                                  borderRadius: 2,
                                  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
                                }}
                              />
                            )}
                          />
                        </Grid>

                        {/* Quantity Input */}
                        <Grid item xs={2} sm={2}>
                          <TextField
                            label="Quantity"
                            variant="outlined"
                            type="number"
                            value={product.quantity}
                            onChange={(e) => handleQuantityChange(index, e.target.value)}
                            fullWidth
                            disabled={!product.productName}
                            size="small"
                            sx={{
                              borderRadius: 2,
                              boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
                            }}
                            InputLabelProps={{
                              shrink: true, // This will force the label to stay "shrunk" (on top)
                            }}
                          />
                        </Grid>

                        {/* Price Input */}
                        <Grid item xs={3} sm={3}>
                          <TextField
                            label="Price"
                            variant="outlined"
                            type="number"
                            value={product.price}
                            onChange={(e) => handlePriceChange(index, e.target.value)}
                            fullWidth
                            disabled={!product.productName}
                            size="small"
                            sx={{
                              borderRadius: 2,
                              boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
                            }}
                            InputLabelProps={{
                              shrink: true, // This will force the label to stay "shrunk" (on top)
                            }}
                          />
                        </Grid>

                        {/* Delete Product Button */}
                        <Grid item xs={1} sm={1} sx={{ textAlign: 'center' }}>
                          <IconButton
                            onClick={() => deleteProductRow(index)}
                            color="error"
                            sx={{
                              color: '#f44336', // Red color for the icon
                              '&:hover': {
                                color: '#d32f2f', // Darker red on hover
                              },
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Grid>
                      </Grid>
                    ))}

                    {/* Add Product Row Button */}
                    <Box sx={{ textAlign: 'center', marginTop: 0 }}>
                      <IconButton
                        onClick={addProductRow}
                        color="success"
                        sx={{
                          color: '#4caf50', // Green color for the icon
                          '&:hover': {
                            color: '#388e3c', // Darker green on hover
                          },
                        }}
                      >
                        <AddCircleIcon fontSize="large" />
                      </IconButton>
                    </Box>
                  </FormControl>
                </Box>
                {COLUMNS()
                  .slice(0, -5)
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

              {/* <Button
      variant="contained"
      color="primary"
      style={{ marginTop: '20px' }}
      onClick={handleInvoiceModalOpen} // Open modal on click
    >
      Submit and generate invoice
    </Button> */}
              <Button
                variant="contained"
                color="primary"
                style={{ marginTop: '20px' }}
                onClick={handleInvoiceModalOpen} // Submit and open modal
              >
                Submit and generate invoice
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
                            ? SupervisorData.filter(
                                (supervisor) => supervisor.branchId?._id === formData.branchId,
                              )
                            : []
                        }
                        getOptionLabel={(option) => option.supervisorName || ''}
                        value={
                          Array.isArray(SupervisorData)
                            ? SupervisorData.find(
                                (supervisor) => supervisor._id === formData.supervisorId,
                              )
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
                            placeholder={
                              !formData.branchId ? 'Select Branch First' : 'Select Supervisor'
                            }
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
                <Box
                  sx={{
                    padding: 2,
                    borderRadius: 2,
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                    backgroundColor: '#fff',
                    maxWidth: '800px',
                    margin: '0 auto',
                  }}
                >
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{ textAlign: 'center', fontWeight: 'bold', marginBottom: 2 }}
                  >
                    Add Products
                  </Typography>

                  <FormControl variant="outlined" fullWidth>
                    {(formData.products || []).map((product, index) => (
                      <Grid
                        container
                        spacing={2}
                        key={index}
                        alignItems="center"
                        sx={{ marginBottom: 2 }}
                      >
                        {/* Product Dropdown */}
                        <Grid item xs={6} sm={6}>
                          <Autocomplete
                            id={`product-select-${index}`}
                            options={ProductData || []}
                            getOptionLabel={(option) => option.productName || ''}
                            value={
                              ProductData.find(
                                (item) => item.productName === formData.products[index].productName,
                              ) || null
                            }
                            onChange={(event, newValue) => handleProductChange(index, newValue)}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Select Product"
                                variant="outlined"
                                placeholder="Select Product"
                                size="small"
                                InputProps={{
                                  ...params.InputProps,
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <BusinessIcon />
                                    </InputAdornment>
                                  ),
                                }}
                                sx={{
                                  borderRadius: 2,
                                  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
                                }}
                              />
                            )}
                          />
                        </Grid>

                        {/* Quantity Input */}
                        <Grid item xs={2} sm={2}>
                          <TextField
                            label="Quantity"
                            variant="outlined"
                            type="number"
                            value={product.quantity}
                            onChange={(e) => handleQuantityChange(index, e.target.value)}
                            fullWidth
                            disabled={!product.productName}
                            size="small"
                            sx={{
                              borderRadius: 2,
                              boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
                            }}
                            InputLabelProps={{
                              shrink: true, // This will force the label to stay "shrunk" (on top)
                            }}
                          />
                        </Grid>

                        {/* Price Input */}
                        <Grid item xs={3} sm={3}>
                          <TextField
                            label="Price"
                            variant="outlined"
                            type="number"
                            value={product.price}
                            onChange={(e) => handlePriceChange(index, e.target.value)}
                            fullWidth
                            disabled={!product.productName}
                            size="small"
                            sx={{
                              borderRadius: 2,
                              boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
                            }}
                            InputLabelProps={{
                              shrink: true, // This will force the label to stay "shrunk" (on top)
                            }}
                          />
                        </Grid>

                        {/* Delete Product Button */}
                        <Grid item xs={1} sm={1} sx={{ textAlign: 'center' }}>
                          <IconButton
                            onClick={() => deleteProductRow(index)}
                            color="error"
                            sx={{
                              color: '#f44336', // Red color for the icon
                              '&:hover': {
                                color: '#d32f2f', // Darker red on hover
                              },
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Grid>
                      </Grid>
                    ))}

                    {/* Add Product Row Button */}
                    <Box sx={{ textAlign: 'center', marginTop: 0 }}>
                      <IconButton
                        onClick={addProductRow}
                        color="success"
                        sx={{
                          color: '#4caf50', // Green color for the icon
                          '&:hover': {
                            color: '#388e3c', // Darker green on hover
                          },
                        }}
                      >
                        <AddCircleIcon fontSize="large" />
                      </IconButton>
                    </Box>
                  </FormControl>
                </Box>
                {COLUMNS()
                  .slice(0, -5)
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
        open={invoicemodalopen}
        onClose={handleInvoiceModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="d-flex justify-content-between">
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Generate Invoice
            </Typography>
            <IconButton onClick={handleInvoiceModalClose}>
              <CloseIcon />
            </IconButton>
          </div>
          <DialogContent>
            <form onSubmit={handleInvoiceSubmit}>
              <FormControl style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <TextField
                  key="gst"
                  label="GST (%)"
                  variant="outlined"
                  name="gst"
                  value={formData.gst || ''} // Ensure it doesn't show undefined
                  onChange={(e) => setFormData({ ...formData, gst: e.target.value })}
                  sx={{ marginBottom: '10px' }}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PercentIcon /> {/* GST Icon in input field */}
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  key="HSNcode"
                  label="HSN Code"
                  variant="outlined"
                  name="HSNcode"
                  value={formData.HSNcode || ''}
                  onChange={(e) => setFormData({ ...formData, HSNcode: e.target.value })}
                  sx={{ marginBottom: '10px' }}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ConfirmationNumberIcon /> {/* HSN Code Icon */}
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  key="discount"
                  label="Discount (amount)"
                  variant="outlined"
                  name="discount"
                  value={formData.discount || ''}
                  onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                  sx={{ marginBottom: '10px' }}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <DiscountIcon /> {/* Discount Icon */}
                      </InputAdornment>
                    ),
                  }}
                />

                {COLUMNS()
                  .slice(0, -10)
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
    </div>
  )
}

export default OrderList
// ....
