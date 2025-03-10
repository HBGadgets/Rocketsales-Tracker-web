import React from 'react'
import { CCardFooter, CRow, CCol, CProgress } from '@coreui/react'
import classNames from 'classnames'

export default function Progress() {
  const progressExample = [
    { title: 'Sales', value: '29.703 Users', percent: 40, color: 'success' },
    { title: 'Unique', value: '24.093 Users', percent: 20, color: 'info' },
    { title: 'Pageviews', value: '78.706 Views', percent: 60, color: 'warning' },
    { title: 'New Users', value: '22.123 Users', percent: 80, color: 'danger' },
    { title: 'Bounce Rate', value: 'Average Rate', percent: 40.15, color: 'primary' },
  ]

  return (
    <div>
      <CCardFooter>
        <CRow
          xs={{ cols: 1, gutter: 4 }}
          sm={{ cols: 2 }}
          lg={{ cols: 4 }}
          xl={{ cols: 5 }}
          className="mb-2 text-center"
        >
          {progressExample.map((item, index, items) => (
            <CCol
              className={classNames({
                'd-none d-xl-block': index + 1 === items.length,
              })}
              key={index}
            >
              <div className="text-body-secondary">{item.title}</div>
              <div className="fw-semibold text-truncate">
                {item.value} ({item.percent}%)
              </div>
              <CProgress thin className="mt-2" color={item.color} value={item.percent} />
            </CCol>
          ))}
        </CRow>
      </CCardFooter>
    </div>
  )
}
