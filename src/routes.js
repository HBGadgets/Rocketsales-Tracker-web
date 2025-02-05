import React from 'react'

const DashBoard = React.lazy(() => import('./views/theme/dashboard/DashBoard'))
const LiveTrack = React.lazy(() => import('./views/theme/livetrack/LiveTrack'))
const IndividualTrack = React.lazy(() => import('./views/theme/livetrack/IndividualTrack'))
const ChatBot = React.lazy(() => import('./views/theme/chatbot/ChatBot'))

const Attendance = React.lazy(() => import('./views/base/ManageAttend/Attendance'))
const LeaveApplication = React.lazy(() => import('./views/base/ManageAttend/LeaveApplication'))
const Manual = React.lazy(() => import('./views/base/ManageAttend/ManualAttendance/Manual'))
const VisitShop = React.lazy(() => import('./views/base/ManageAttend/VistShop'))

const InventoryManagment = React.lazy(() => import('./views/base/ManageOrder/InventoryManage'))
const InvoiceForm = React.lazy(() => import('./views/base/ManageOrder/Invoice'))
const Po = React.lazy(() => import('./views/base/ManageOrder/PO'))

const TaskManagment = React.lazy(() => import('./views/base/Management/TaskManagement/TaskManagement'))
const UserDetailsForm = React.lazy(() => import('./views/base/Management/UserMange'))

const ExpenseDetails = React.lazy(() => import('./views/base/ExpenseMange/ExpenseDet'))
const ManualExpense = React.lazy(() => import('./views/base/ExpenseMange/ManualExpense'))

const ReportInventory = React.lazy(() => import('./views/base/ReportMange/Inventory'))
const EmployeeDetails = React.lazy(() => import('./views/base/ReportMange/EmployeeDetail'))

const Settings = React.lazy(() => import('./views/forms/settings/Settings'))
const HelpSupp = React.lazy(() => import('./views/forms/help-support/HelpSupp'))
const Company=React.lazy(()=>import('./views/base/Management/Company/Company'))
const Branches=React.lazy(()=>import('./views/base/Management/Branches/Branches'))
const BranchGroup=React.lazy(()=>import('./views/base/Management/BranchGroup'))
const Supervisor=React.lazy(()=>import('./views/base/Management/Supervisor/Supervisor'))
const UserManage=React.lazy(()=>import('./views/base/Management/UserManage/UserManage'))
const Attendance1=React.lazy(()=>import('./views/base/ManageAttend/Attendance1/Attendance1'))
const SalesmanLeaveRequest=React.lazy(()=>import('./views/base/ManageAttend/SalesmanLeaveRequest/SalesmanLeaveRequest'))
const ApproveRequest=React.lazy(()=>import('./views/base/ManageAttend/ApproveRequest/ApproveRequest'))
const DeniedRequest=React.lazy(()=>import('./views/base/ManageAttend/DeniedRequest/DeniedRequest'))
const SalesmanExpenceManagement=React.lazy(()=>import('./views/base/ManageOrder/SalesmanExpenceManagement/SalesmanExpenceManagement'))
// const Company=React.lazy(()=>import('./views/base/Management/Company'))
// const Company=React.lazy(()=>import('./views/base/Management/Company'))
const OrderList=React.lazy(()=>import('./views/base/ManageOrder/OrderList/OrderList'))
const ProductList=React.lazy(()=>import('./views/base/ManageOrder/ProductList/ProductList'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  

  // { path: '/theme', name: 'Theme', element: Colors, exact: true },
  { path: '/dashboard', name: 'DashBoard', element: DashBoard },
  { path: '/chatbot', name: 'ChatBot', element: ChatBot },
  { path: '/livetrack', name: 'LiveTrack', element: LiveTrack },
  { path: '/salesman', name: 'IndividualTrack', element: IndividualTrack },

  { path: '/attendance', name: 'Attendance1', element: Attendance },
  { path: '/order-list', name: 'order List', element: OrderList },
  { path: '/product-list', name: 'product List', element: ProductList },

  { path: '/leave-application', name: 'Leave Application', element: LeaveApplication },
  { path: '/visit-shop', name: 'Visit Shop', element: VisitShop },

  { path: '/invoice', name: 'Invoice', element: InvoiceForm },
  { path: '/po', name: 'PO', element: Po },
  { path: '/inventory-management', name: 'Inventory Management', element: InventoryManagment },
  
  { path: '/task-management', name: 'Task Management', element: TaskManagment },
  { path: '/user-management', name: 'User Management', element: UserDetailsForm },
  { path: '/Company', name: 'Comapany', element: Company },
  { path: '/Branches', name: 'Branches', element: Branches },
  { path: '/Supervisor', name: 'Supervisor', element: Supervisor },
  { path: '/UserManage', name: 'UserManage', element: UserManage },
  { path: '/Branch-Group', name: 'Branch-Group', element: BranchGroup },
  { path: '/expense-details', name: 'Expense Details', element: ExpenseDetails },
  { path: '/manual-expense', name: 'Manual Expense', element: ManualExpense },
  
  { path: '/inventory', name: 'Inventory', element: ReportInventory },
  { path: '/employee-details', name: 'Employee Details', element: EmployeeDetails },
  
  { path: '/setting', name: 'Setting', element: Settings },
  { path: '/h&s', name: 'Help & Support', element: HelpSupp },
  { path: '/Attendance1', name: 'Attendance', element: Attendance1 },
  { path: '/SalesmanLeaveRequest', name: 'Salesman Leave Request', element: SalesmanLeaveRequest },
  { path: '/ApproveRequest', name: 'Approve Request', element: ApproveRequest },
  { path: '/DeniedRequest', name: 'Rejected Request', element: DeniedRequest },
  { path: '/SalesmanExpenceManagement', name: 'Salesman Expence Management', element: SalesmanExpenceManagement },
]

export default routes
