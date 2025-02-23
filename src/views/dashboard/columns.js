export const columns = [
  {
    Header: 'Profile',
    accessor: 'profileImage',
  },
  {
    Header: 'Name',
    accessor: 'salesmanName',
  },
  {
    Header: 'Phone',
    accessor: 'salesmanPhone',
  },
  {
    Header: 'Company ', // Since there's no companyName in the data
    accessor: 'companyName',
  },
  {
    Header: 'Branch ', // Since there's no branchName in the data
    accessor: 'branchName',
  },
  {
    Header: 'Supervisor ', // Since there's no supervisorName in the data
    accessor: 'supervisorName',
  },
  {
    Header: 'Created At',
    accessor: 'createdAt',
     Cell: ({ value }) => (value ? new Date(value).toLocaleDateString() : 'N/A'),
  },
];
