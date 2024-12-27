import React, { useState } from 'react'
import {
  CAvatar,
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
import {
  Button,
  IconButton,
  Typography,
  Collapse,
  Select,
  MenuItem,
  DialogActions,
  DialogTitle,
} from '@mui/material'
import { RiEdit2Fill } from 'react-icons/ri'
import { AiFillDelete } from 'react-icons/ai'
import { IoCalendarClearOutline } from 'react-icons/io5'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import girl1 from './Images/girl-1.jpg'
import girls3 from './Images/girls-3.jpg'
import girls5 from './Images/girls-5.jpg'
import mens1 from './Images/mens-1.jpg'
import mens2 from './Images/mens-2.jpg'
import mens4 from './Images/mens-4.jpg'

const data = [
  { id: 101, name: 'John', mobile: '123-456-7890', image: girl1, totalAssignShop: 10 },
  { id: 102, name: 'Dom', mobile: '123-456-7449', image: mens1, totalAssignShop: 11 },
  { id: 103, name: 'Paul', mobile: '123-456-7449', image: girls3, totalAssignShop: 20 },
  { id: 104, name: 'Whick', mobile: '123-456-7449', image: mens2, totalAssignShop: 51 },
  { id: 105, name: 'Kavin', mobile: '123-456-7449', image: mens4, totalAssignShop: 33 },
  { id: 106, name: 'Olive', mobile: '123-456-7449', image: girls5, totalAssignShop: 29 },
]

const VisitShop = () => {
  const [attendanceData, setAttendanceData] = useState(data)
  const [expandedRows, setExpandedRows] = useState([])
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const [open, setOpen] = useState(false)

  // Handle row click to expand/collapse
  const handleRowClick = (id) => {
    const isExpanded = expandedRows.includes(id)
    if (isExpanded) {
      setExpandedRows(expandedRows.filter((rowId) => rowId !== id))
    } else {
      setExpandedRows([...expandedRows, id])
    }
  }

  // Function to handle image click
  const handleImageClick = (image) => {
    setSelectedImage(image)
    setOpen(true)
  }

  // Function to close the modal
  const handleClose = () => {
    setOpen(false)
    setSelectedImage(null)
  }

  const handleCalendarOpen = () => {
    setCalendarOpen(true)
  }

  const handleCalendarClose = () => {
    setCalendarOpen(false)
  }

  const handleDateChange = (date) => {
    setSelectedDate(date)
    setCalendarOpen(false)
  }

  const handleDropdownChange = (id, value) => {
    const updatedData = attendanceData.map((item) => {
      if (item.id === id) {
        return { ...item, selectedOption: value }
      }
      return item
    })
    setAttendanceData(updatedData)

    if (value === 'Choose from Calendar') {
      handleCalendarOpen()
    }
  }

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Visit Shop
      </Typography>
      <div
        style={{
          overflowX: 'auto',
          backgroundColor: '#212631',
          borderRadius: '10px',
        }}
      >
        <CTable align="middle" className="mb-0 border" hover responsive>
          <CTableHead className="text-nowrap">
            <CTableRow>
              <CTableHeaderCell className="text-center">Image</CTableHeaderCell>
              <CTableHeaderCell className="text-center">ID</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Name</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Mobile No</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Total Shop Visit</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Option</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Progress</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {attendanceData.map((item) => (
              <React.Fragment key={item.id}>
                <CTableRow onClick={() => handleRowClick(item.id)}>
                  <CTableDataCell className="text-center">
                    <CImage
                      src={item.image}
                      rounded
                      thumbnail
                      onClick={() => handleImageClick(item.image)}
                      style={{
                        cursor: 'pointer',
                        borderRadius: '50%',
                        width: '60px',
                        height: '60px',
                        objectFit: 'cover',
                      }}
                    />
                  </CTableDataCell>
                  <CTableDataCell className="text-center">{item.id}</CTableDataCell>
                  <CTableDataCell className="text-center">{item.name}</CTableDataCell>
                  <CTableDataCell className="text-center">{item.mobile}</CTableDataCell>
                  <CTableDataCell className="text-center">{item.totalAssignShop}</CTableDataCell>
                  <CTableDataCell className="text-center">
                    <Select
                      style={{ width: '150px' }}
                      value={item.selectedOption || 'Today'}
                      onChange={(e) => handleDropdownChange(item.id, e.target.value)}
                      fullWidth
                      displayEmpty
                    >
                      <MenuItem value="Today">Today</MenuItem>
                      <MenuItem value="Yesterday">Yesterday</MenuItem>
                      <MenuItem value="Tomorrow">Tomorrow</MenuItem>
                      <MenuItem value="Choose from Calendar">
                        Choose from Calendar <IoCalendarClearOutline />
                      </MenuItem>
                    </Select>
                  </CTableDataCell>
                  <CTableDataCell className="text-center">
                    <Button
                      variant="contained"
                      style={{
                        backgroundColor: 'rgba(253, 227, 167)',
                        color: 'black',
                        marginRight: '10px',
                      }}
                    >
                      View Progress
                    </Button>
                  </CTableDataCell>
                  <CTableDataCell className="text-center">
                    <div
                      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                    >
                      <IconButton aria-label="edit" style={{ marginRight: '10px' }}>
                        <RiEdit2Fill style={{ fontSize: '25px', color: 'blue' }} />
                      </IconButton>
                      <IconButton aria-label="delete">
                        <AiFillDelete style={{ fontSize: '25px', color: 'red' }} />
                      </IconButton>
                    </div>
                  </CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableDataCell colSpan={8} style={{ paddingBottom: 0, paddingTop: 0 }}>
                    <Collapse in={expandedRows.includes(item.id)} timeout="auto" unmountOnExit>
                      <div
                        style={{
                          backgroundColor: '#2a303d',
                          padding: '10px',
                          borderRadius: '10px',
                          margin: '10px 0',
                        }}
                      >
                        <Typography variant="body2" style={{ color: 'wheat' }}>
                          {/* Additional details can be added here if needed */}
                        </Typography>
                      </div>
                    </Collapse>
                  </CTableDataCell>
                </CTableRow>
              </React.Fragment>
            ))}
          </CTableBody>
        </CTable>
      </div>

      {/* Image Modal */}
      <CModal alignment="center" visible={open} onClose={handleClose}>
        <CModalBody>
          {selectedImage && (
            <CImage src={selectedImage} style={{ width: '100%', height: 'auto' }} />
          )}
        </CModalBody>
      </CModal>
    </div>
  )
}

export default VisitShop
