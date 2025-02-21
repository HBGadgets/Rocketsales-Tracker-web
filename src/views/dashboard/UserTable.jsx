import React from 'react'
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CAvatar,
  // CIcon,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import avatar1 from 'src/assets/images/avatars/1.jpg'
import avatar2 from 'src/assets/images/avatars/2.jpg'
import avatar3 from 'src/assets/images/avatars/3.jpg'
import avatar4 from 'src/assets/images/avatars/4.jpg'
import avatar5 from 'src/assets/images/avatars/5.jpg'
import avatar6 from 'src/assets/images/avatars/6.jpg'

import {
  cibCcAmex,
  cibCcApplePay,
  cibCcMastercard,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,
  cibGoogle,
  cibFacebook,
  cibLinkedin,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifPl,
  cifUs,
  cibTwitter,
  cilCloudDownload,
  cilPeople,
  cilUser,
  cilUserFemale,
} from '@coreui/icons'

const UserTable = () => {
  const tableData = [
    {
      avatar: { src: avatar1, status: 'success' },
      user: { name: 'Yiorgos Avraamu', new: true, registered: 'Jan 1, 2023' },
      country: { name: 'USA', flag: cifUs },
      usage: { value: 50, period: 'Jun 11, 2023 - Jul 10, 2023' },
      payment: { name: 'Mastercard', icon: cibCcMastercard },
      activity: '10 sec ago',
    },
    {
      avatar: { src: avatar2, status: 'danger' },
      user: { name: 'Avram Tarasios', new: false, registered: 'Jan 1, 2023' },
      country: { name: 'Brazil', flag: cifBr },
      usage: { value: 22, period: 'Jun 11, 2023 - Jul 10, 2023' },
      payment: { name: 'Visa', icon: cibCcVisa },
      activity: '5 minutes ago',
    },
    {
      avatar: { src: avatar3, status: 'warning' },
      user: { name: 'Quintin Ed', new: true, registered: 'Jan 1, 2023' },
      country: { name: 'India', flag: cifIn },
      usage: { value: 74, period: 'Jun 11, 2023 - Jul 10, 2023' },
      payment: { name: 'Stripe', icon: cibCcStripe },
      activity: '1 hour ago',
    },
    {
      avatar: { src: avatar4, status: 'secondary' },
      user: { name: 'Enéas Kwadwo', new: true, registered: 'Jan 1, 2023' },
      country: { name: 'France', flag: cifFr },
      usage: { value: 98, period: 'Jun 11, 2023 - Jul 10, 2023' },
      payment: { name: 'PayPal', icon: cibCcPaypal },
      activity: 'Last month',
    },
    {
      avatar: { src: avatar5, status: 'success' },
      user: { name: 'Agapetus Tadeáš', new: true, registered: 'Jan 1, 2023' },
      country: { name: 'Spain', flag: cifEs },
      usage: { value: 22, period: 'Jun 11, 2023 - Jul 10, 2023' },
      payment: { name: 'Google Wallet', icon: cibCcApplePay },
      activity: 'Last week',
    },
    {
      avatar: { src: avatar6, status: 'danger' },
      user: { name: 'Friderik Dávid', new: true, registered: 'Jan 1, 2023' },
      country: { name: 'Poland', flag: cifPl },
      usage: { value: 43, period: 'Jun 11, 2023 - Jul 10, 2023' },
      payment: { name: 'Amex', icon: cibCcAmex },
      activity: 'Last week',
    },
  ]

  return (
    <CTable align="middle" className="mb-0 border" hover responsive>
      <CTableHead color="light">
        <CTableRow>
          <CTableHeaderCell>Avatar</CTableHeaderCell>
          <CTableHeaderCell>User</CTableHeaderCell>
          <CTableHeaderCell>Country</CTableHeaderCell>
          <CTableHeaderCell>Usage</CTableHeaderCell>
          <CTableHeaderCell>Payment</CTableHeaderCell>
          <CTableHeaderCell>Activity</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        {tableData.map((item, index) => (
          <CTableRow key={index}>
            <CTableDataCell>
              <CAvatar src={item.avatar.src} status={item.avatar.status} />
            </CTableDataCell>
            <CTableDataCell>
              <div>{item.user.name}</div>
              <div className="small text-body-secondary">
                {item.user.new ? 'New' : 'Returning'} | {item.user.registered}
              </div>
            </CTableDataCell>
            <CTableDataCell>
              <CIcon icon={item.country.flag} size="xl" /> {item.country.name}
            </CTableDataCell>
            <CTableDataCell>
              <div className="clearfix">
                <div className="fw-semibold">{item.usage.value}%</div>
                <div className="text-body-secondary small">{item.usage.period}</div>
              </div>
            </CTableDataCell>
            <CTableDataCell>
              <CIcon icon={item.payment.icon} size="xl" /> {item.payment.name}
            </CTableDataCell>
            <CTableDataCell>{item.activity}</CTableDataCell>
          </CTableRow>
        ))}
      </CTableBody>
    </CTable>
  )
}

export default UserTable
