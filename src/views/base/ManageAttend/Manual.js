import React, { useState } from 'react'
import {
  TableContainer,
  Paper,
  IconButton,
  Dialog,
  DialogContent,
  Typography,
  Button,
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
} from '@coreui/react'

const data = [
  {
    id: 101,
    name: 'John',
    mobile: '9045116165',
    status: 'Present',
    statu: 'Absent',
    image: girl1,
  },
  {
    id: 102,
    name: 'Dom',
    mobile: '90451161554',
    status: 'Present',
    statu: 'Absent',
    image: mens1,
  },
  {
    id: 103,
    name: 'Paul',
    mobile: '9045886165',
    status: 'Present',
    statu: 'Absent',
    image: girls3,
  },
  {
    id: 104,
    name: 'Whick',
    mobile: '9045116165',
    status: 'Present',
    statu: 'Absent',
    image: mens2,
  },
  {
    id: 105,
    name: 'Kavin',
    mobile: '909996165',
    status: 'Present',
    statu: 'Absent',
    image: mens4,
  },
  {
    id: 106,
    name: 'Olive',
    mobile: '9088116165',
    status: 'Present',
    statu: 'Absent',
    image: girls5,
  },
]

// Function to get status color
const getStatusColor = (status) => {
  return status === 'Present' ? 'green' : 'red'
}

const Manual = () => {
  const [open, setOpen] = useState(false) // Dialog state for image zoom
  const [selectedImage, setSelectedImage] = useState(null) // Holds the currently selected image for zoom
  const [showSearch, setShowSearch] = useState(false) // Toggles the search bar visibility
  const [searchQuery, setSearchQuery] = useState('') // Holds the user's search input

  // Function to handle image click and open zoom modal
  const handleImageClick = (image) => {
    setSelectedImage(image)
    setOpen(true) // Opens the dialog/modal
  }

  // Function to close the modal
  const handleClose = () => {
    setOpen(false)
    setSelectedImage(null)
  }

  const handleSearchIconClick = () => {
    setShowSearch(!showSearch)
    if (showSearch) setSearchQuery('') // Reset the search when collapsing
  }

  // Filter data based on search query for Name, Mobile No, and ID
  const filteredData = data.filter((item) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      item.name.toLowerCase().includes(searchLower) ||
      item.mobile.toLowerCase().includes(searchLower) ||
      item.id.toString().toLowerCase().includes(searchLower)
    )
  })

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
          Manual Attendance
        </Typography>
        <div style={{ display: 'flex', alignItems: 'center' }}>
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
            <CTableHead className="text-nowrap">
              <CTableRow>
                <CTableHeaderCell className="bg-body-tertiary text-center">Image</CTableHeaderCell>
                <CTableHeaderCell className="bg-body-tertiary text-center">ID</CTableHeaderCell>
                <CTableHeaderCell className="bg-body-tertiary text-center">Name</CTableHeaderCell>
                <CTableHeaderCell className="bg-body-tertiary text-center">
                  Mobile No
                </CTableHeaderCell>
                <CTableHeaderCell className="bg-body-tertiary text-center">Status</CTableHeaderCell>
                <CTableHeaderCell className="bg-body-tertiary text-center">
                  Actions
                </CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {filteredData.map((item, index) => (
                <CTableRow key={index}>
                  <CTableDataCell className="text-center">
                    <CImage
                      rounded
                      thumbnail
                      src={item.image}
                      onClick={() => handleImageClick(item.image)}
                      style={{ width: '60px', height: '60px', cursor: 'pointer' }} // Image size handling
                    />
                  </CTableDataCell>
                  <CTableDataCell className="text-center">{item.id}</CTableDataCell>
                  <CTableDataCell className="text-center">{item.name}</CTableDataCell>
                  <CTableDataCell className="text-center">{item.mobile}</CTableDataCell>
                  <CTableDataCell className="text-center">
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                      <Typography
                        style={{
                          backgroundColor: getStatusColor(item.status),
                          color: 'white',
                          padding: '4px 10px',
                          borderRadius: '10px',
                          display: 'inline-block',
                        }}
                      >
                        {item.status}
                      </Typography>
                      <Typography
                        style={{
                          backgroundColor: getStatusColor(item.statu),
                          color: 'white',
                          padding: '4px 10px',
                          borderRadius: '10px',
                          display: 'inline-block',
                        }}
                      >
                        {item.statu}
                      </Typography>
                    </div>
                  </CTableDataCell>
                  <CTableDataCell className="text-center">
                    <IconButton aria-label="edit">
                      <RiEdit2Fill style={{ fontSize: '25px', color: 'blue' }} />
                    </IconButton>
                    <IconButton aria-label="delete">
                      <AiFillDelete style={{ fontSize: '25px', color: 'brown' }} />
                    </IconButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </TableContainer>
      </div>

      {/* Modal for zoomed image */}
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            overflow: 'hidden',
            borderRadius: '0',
            maxWidth: 'none',
          },
        }}
      >
        <DialogContent style={{ padding: 0 }}>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Zoomed"
              style={{
                width: '500px', // Zoomed image size
                height: '500px',
                objectFit: 'cover',
                borderRadius: '0',
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Manual
