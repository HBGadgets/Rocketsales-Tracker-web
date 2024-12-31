import React, { useState } from 'react'
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
  CBadge,
} from '@coreui/react'
import { IconButton } from '@mui/material'
import { RiEdit2Fill } from 'react-icons/ri'
import { AiFillDelete } from 'react-icons/ai'
import girl1 from './Images/girl-1.jpg'
import girls3 from './Images/girls-3.jpg'
import girls5 from './Images/girls-5.jpg'
import mens1 from './Images/mens-1.jpg'
import mens2 from './Images/mens-2.jpg'
import mens4 from './Images/mens-4.jpg'

const data = [
  {
    id: 101,
    name: 'John',
    mobile: '123-456-7890',
    taskName: 'Task A',
    location: 'New York',
    completionDate: '2023-09-01',
    deadline: '2023-09-10',
    lastStatus: 'Complete',
    image: girl1,
  },
  {
    id: 102,
    name: 'Dom',
    mobile: '123-456-7449',
    taskName: 'Task B',
    location: 'London',
    completionDate: '2023-08-28',
    deadline: '2023-09-05',
    lastStatus: 'In Process',
    image: mens1,
  },
  {
    id: 103,
    name: 'Paul',
    mobile: '123-456-7449',
    taskName: 'Task C',
    location: 'Paris',
    completionDate: '2023-09-05',
    deadline: '2023-09-12',
    lastStatus: 'Pending',
    image: girls3,
  },
  {
    id: 104,
    name: 'Whick',
    mobile: '123-456-7449',
    taskName: 'Task D',
    location: 'Berlin',
    completionDate: '2023-09-03',
    deadline: '2023-09-15',
    lastStatus: 'Complete',
    image: mens2,
  },
  {
    id: 105,
    name: 'Kavin',
    mobile: '123-456-7449',
    taskName: 'Task E',
    location: 'Madrid',
    completionDate: '2023-09-07',
    deadline: '2023-09-14',
    lastStatus: 'In Process',
    image: mens4,
  },
  {
    id: 106,
    name: 'Olive',
    mobile: '123-456-7449',
    taskName: 'Task F',
    location: 'Tokyo',
    completionDate: '2023-09-08',
    deadline: '2023-09-16',
    lastStatus: 'Pending',
    image: girls5,
  },
]

const Company = () => {
  const [open, setOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)

  const handleImageClick = (image) => {
    setSelectedImage(image)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setSelectedImage(null)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Complete':
        return 'success'
      case 'In Process':
        return 'warning'
      case 'Pending':
        return 'danger'
      default:
        return 'secondary'
    }
  }

  return (
    <div>
      <CTable align="middle" hover responsive>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell className="center">Image</CTableHeaderCell>
            <CTableHeaderCell className="center">ID</CTableHeaderCell>
            <CTableHeaderCell className="center">Name</CTableHeaderCell>
            <CTableHeaderCell className="center">Mobile No</CTableHeaderCell>
            <CTableHeaderCell className="center">Task Name</CTableHeaderCell>
            <CTableHeaderCell className="center">Location</CTableHeaderCell>
            <CTableHeaderCell className="center">Completion Date</CTableHeaderCell>
            <CTableHeaderCell className="center">Deadline</CTableHeaderCell>
            <CTableHeaderCell className="center">Last Status</CTableHeaderCell>
            <CTableHeaderCell className="center">Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {data.map((item, index) => (
            <CTableRow
              key={index}
              style={{
                backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#e0e0e0', // Alternating colors
              }}
            >
              <CTableDataCell>
                <CImage
                  rounded
                  thumbnail
                  src={item.image}
                  onClick={() => handleImageClick(item.image)}
                  style={{ width: '60px', height: '60px' }}
                />
              </CTableDataCell>
              <CTableDataCell>{item.id}</CTableDataCell>
              <CTableDataCell>{item.name}</CTableDataCell>
              <CTableDataCell>{item.mobile}</CTableDataCell>
              <CTableDataCell>{item.taskName}</CTableDataCell>
              <CTableDataCell>{item.location}</CTableDataCell>
              <CTableDataCell>{item.completionDate}</CTableDataCell>
              <CTableDataCell>{item.deadline}</CTableDataCell>
              <CTableDataCell>
                <CBadge
                  style={{
                    padding: '10px 10px',
                    borderRadius: '5px',
                    display: 'inline-block',
                  }}
                  color={getStatusColor(item.lastStatus)}
                >
                  {item.lastStatus}
                </CBadge>
              </CTableDataCell>
              <CTableDataCell>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <IconButton>
                    <RiEdit2Fill color="lightBlue" />
                  </IconButton>
                  <IconButton>
                    <AiFillDelete color="brown" />
                  </IconButton>
                </div>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>

      {/* Modal for Image Preview */}
      <CModal alignment="center" visible={open} onClose={handleClose}>
        <CModalBody>
          <CImage src={selectedImage} style={{ width: '100%', height: 'auto' }} />
        </CModalBody>
      </CModal>
    </div>
  )
}

export default Company 
