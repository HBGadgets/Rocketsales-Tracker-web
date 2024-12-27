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
} from '@coreui/react'
import { IconButton } from '@mui/material'
import { RiEdit2Fill } from 'react-icons/ri'
import { AiFillDelete } from 'react-icons/ai'

// Importing images from the Images folder for the profile pictures
import girl1 from './Images/girl-1.jpg'
import girls3 from './Images/girls-3.jpg'
import girls5 from './Images/girls-5.jpg'
import mens1 from './Images/mens-1.jpg'
import mens2 from './Images/mens-2.jpg'
import mens4 from './Images/mens-4.jpg'

// Importing images from the Bills folder for the uploaded bills
import bill1 from './Bills/bill-1.jpg'
import bill2 from './Bills/bill-2.jpg'
import bill3 from './Bills/bill-3.jpg'
import bill4 from './Bills/bill-4.png'
import bill5 from './Bills/bill-5.jpg'
import bill6 from './Bills/bill-6.jpg'

// Updated data with profile and bill details
const data = [
  {
    id: 101,
    name: 'John',
    image: girl1, // Profile image from Images folder
    mobile: '123-456-7890',
    expensesType: 'Travel',
    expensesDescription: 'Flight to New York',
    amount: '$400',
    date: '2023-09-01',
    uploadBill: bill1, // Bill image from Bills folder
  },
  {
    id: 102,
    name: 'Dom',
    image: mens1,
    mobile: '123-456-7449',
    expensesType: 'Accommodation',
    expensesDescription: 'Hotel stay in London',
    amount: '$200',
    date: '2023-08-28',
    uploadBill: bill2,
  },
  {
    id: 103,
    name: 'Paul',
    image: girls3,
    mobile: '123-456-7449',
    expensesType: 'Meals',
    expensesDescription: 'Business lunch in Paris',
    amount: '$50',
    date: '2023-09-05',
    uploadBill: bill3,
  },
  {
    id: 104,
    name: 'Whick',
    image: mens2,
    mobile: '123-456-7449',
    expensesType: 'Travel',
    expensesDescription: 'Train ticket to Berlin',
    amount: '$120',
    date: '2023-09-03',
    uploadBill: bill4,
  },
  {
    id: 105,
    name: 'Kavin',
    image: mens4,
    mobile: '123-456-7449',
    expensesType: 'Supplies',
    expensesDescription: 'Office supplies in Madrid',
    amount: '$75',
    date: '2023-09-07',
    uploadBill: bill5,
  },
  {
    id: 106,
    name: 'Olive',
    image: girls5,
    mobile: '123-456-7449',
    expensesType: 'Entertainment',
    expensesDescription: 'Client dinner in Tokyo',
    amount: '$150',
    date: '2023-09-08',
    uploadBill: bill6,
  },
]

const ExpenseDetails = () => {
  const [open, setOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)

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

  return (
    <div>
      <CTable align="middle" hover responsive>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Image</CTableHeaderCell>
            <CTableHeaderCell>ID</CTableHeaderCell>
            <CTableHeaderCell>Name</CTableHeaderCell>
            <CTableHeaderCell>Mobile No</CTableHeaderCell>
            <CTableHeaderCell>Expenses Type</CTableHeaderCell>
            <CTableHeaderCell>Expenses Description</CTableHeaderCell>
            <CTableHeaderCell>Amount</CTableHeaderCell>
            <CTableHeaderCell>Date</CTableHeaderCell>
            <CTableHeaderCell>Upload Bill</CTableHeaderCell>
            <CTableHeaderCell className="text-center">Actions</CTableHeaderCell>
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
                  src={item.image} // Display profile image
                  onClick={() => handleImageClick(item.image)}
                  style={{ width: '60px', height: '60px', cursor: 'pointer' }}
                />
              </CTableDataCell>
              <CTableDataCell>{item.id}</CTableDataCell>
              <CTableDataCell>{item.name}</CTableDataCell>
              <CTableDataCell>{item.mobile}</CTableDataCell>
              <CTableDataCell>{item.expensesType}</CTableDataCell>
              <CTableDataCell>{item.expensesDescription}</CTableDataCell>
              <CTableDataCell>{item.amount}</CTableDataCell>
              <CTableDataCell>{item.date}</CTableDataCell>
              <CTableDataCell>
                <CImage
                  rounded
                  thumbnail
                  src={item.uploadBill} // Display bill image
                  onClick={() => handleImageClick(item.uploadBill)}
                  style={{ width: '60px', height: '60px', cursor: 'pointer' }}
                />
              </CTableDataCell>
              <CTableDataCell>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                  <IconButton aria-label="edit">
                    <RiEdit2Fill style={{ fontSize: '25px', color: 'lightBlue' }} />
                  </IconButton>
                  <IconButton aria-label="delete">
                    <AiFillDelete style={{ fontSize: '25px', color: 'brown' }} />
                  </IconButton>
                </div>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>

      {/* Modal for zoomed image */}
      <CModal alignment="center" visible={open} onClose={handleClose}>
        <CModalBody>
          <CImage src={selectedImage} style={{ width: '100%', height: 'auto' }} />
        </CModalBody>
      </CModal>
    </div>
  )
}

export default ExpenseDetails
