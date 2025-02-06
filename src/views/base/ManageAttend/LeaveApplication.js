import React, { useState } from 'react'
import {
  TableContainer,
  Paper,
  IconButton,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Button,
  Typography,
  InputBase,
} from '@mui/material'
import { RiEdit2Fill } from 'react-icons/ri'
import { AiFillDelete } from 'react-icons/ai'
import SearchIcon from '@mui/icons-material/Search'
import girl1 from './Images/girl-1.jpg'
import girls3 from './Images/girls-3.jpg'
import girls5 from './Images/girls-5.jpg'
import mens1 from './Images/mens-1.jpg'
import mens2 from './Images/mens-2.jpg'
import mens4 from './Images/mens-4.jpg'
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CImage,
  CModal,
  CModalBody,
} from '@coreui/react'

const data = [
  { id: 101, name: 'Vihaan Deshmukh', mobile: '123-456-7890', image: girl1 },
  { id: 102, name: 'Dom', mobile: '123-456-7449', image: mens1 },
  { id: 103, name: 'Paul', mobile: '123-456-7449', image: girls3 },
  { id: 104, name: 'Whick', mobile: '123-456-7449', image: mens2 },
  { id: 105, name: 'Kavin', mobile: '123-456-7449', image: mens4 },
  { id: 106, name: 'Olive', mobile: '123-456-7449', image: girls5 },
]

const LeaveApplication = () => {
  const [open, setOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [confirmationDialog, setConfirmationDialog] = useState({ open: false, action: null })
  const [showSearch, setShowSearch] = useState(false) // To toggle search bar
  const [searchQuery, setSearchQuery] = useState('') // To handle the search input
 const [sortedData, setSortedData] = useState([])
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [selectedPeriod, setSelectedPeriod] = useState('today')
  const [showCustomDates, setShowCustomDates] = useState(false)
  // Function to handle image click
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

  const handleImageClick = (image) => {
    setSelectedImage(image)
    setOpen(true)
  }

  // Function to close the image modal
  const handleClose = () => {
    setOpen(false)
    setSelectedImage(null)
  }

  // Function to open the confirmation dialog for approve/reject
  const handleActionClick = (action) => {
    setConfirmationDialog({ open: true, action })
  }

  // Function to close the confirmation dialog
  const handleConfirmClose = () => {
    setConfirmationDialog({ open: false, action: null })
  }

  // Function to confirm approve/reject action
  const handleConfirmAction = () => {
    // Add logic for approve or reject here (e.g., updating the backend)
    console.log(`Confirmed ${confirmationDialog.action}`)
    setConfirmationDialog({ open: false, action: null })
  }

  // Handle search icon click to toggle search bar visibility
  const handleSearchIconClick = () => {
    setShowSearch(!showSearch)
    if (!showSearch) setSearchQuery('') // Reset search when search bar is hidden
  }

  // Filter data based on the search query for Name and Mobile fields
  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.mobile.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: '10px',
        }}
      >
        <Typography variant="h6" gutterBottom>
          Leave Application
        </Typography>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* Search bar */}
          {showSearch && (
            <InputBase
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                marginRight: '5px',
                backgroundColor: '#f0f0f0',
                borderRadius: '3px',
                padding: '5px 10px',
                transition: 'width 0.5s',
                width: showSearch ? '200px' : '0px',
              }}
            />
          )}
          <IconButton onClick={handleSearchIconClick} style={{ color: 'grey' }}>
            <SearchIcon />
          </IconButton>
        </div>
      </div>

      <div
        style={{
          overflowX: 'auto',
          backgroundColor: '#212631',
          borderRadius: '10px',
        }}
      >
        <TableContainer component={Paper} style={{ width: '100%' }}>
          <CTable align="middle" className="mb-0 border" hover responsive>
            <CTableHead className="text-center">
              <CTableRow>
                <CTableHeaderCell className="bg-body-tertiary text-center">Image</CTableHeaderCell>
                <CTableHeaderCell className="bg-body-tertiary text-center">Name</CTableHeaderCell>
                <CTableHeaderCell className="bg-body-tertiary text-center">Mobile</CTableHeaderCell>
                <CTableHeaderCell className="bg-body-tertiary text-center">Status</CTableHeaderCell>
                <CTableHeaderCell className="bg-body-tertiary text-center">
                  Actions
                </CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {filteredData.map((row) => (
                <CTableRow key={row.id}>
                  <CTableDataCell className="text-center">
                    <CImage
                      src={row.image}
                      rounded
                      thumbnail
                      onClick={() => handleImageClick(row.image)}
                      style={{
                        cursor: 'pointer',
                        borderRadius: '50%',
                        width: '60px', // Adjust the size if necessary
                        height: '60px',
                        objectFit: 'cover', // Ensures the image covers the circle area
                      }}
                    />
                  </CTableDataCell>
                  <CTableDataCell className="text-center">{row.name}</CTableDataCell>
                  <CTableDataCell className="text-center">{row.mobile}</CTableDataCell>
                  <CTableDataCell className="text-center">
                    <Button
                      variant="contained"
                      style={{ backgroundColor: 'green', color: 'white', marginRight: '8px' }}
                      onClick={() => handleActionClick('approve')}
                    >
                      Approved
                    </Button>
                    <Button
                      variant="contained"
                      style={{ backgroundColor: 'red', color: 'white' }}
                      onClick={() => handleActionClick('reject')}
                    >
                      Rejected
                    </Button>
                  </CTableDataCell>
                  <CTableDataCell className="text-center">
                    <IconButton color="primary">
                      <RiEdit2Fill />
                    </IconButton>
                    <IconButton color="error">
                      <AiFillDelete />
                    </IconButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </TableContainer>
      </div>

      {/* Image Zoom Modal */}
      <CModal alignment="center" visible={open} onClose={handleClose}>
        <CModalBody>
          {selectedImage && (
            <CImage src={selectedImage} style={{ width: '100%', height: 'auto' }} />
          )}
        </CModalBody>
      </CModal>

      {/* Confirmation Dialog for Approve/Reject */}
      <Dialog open={confirmationDialog.open} onClose={handleConfirmClose}>
        <DialogTitle>
          {`Are You Sure You Want To ${
            confirmationDialog.action === 'approve' ? 'Approve' : 'Reject'
          }?`}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleConfirmClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmAction} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default LeaveApplication
