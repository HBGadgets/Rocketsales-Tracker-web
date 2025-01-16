// import { createSlice } from '@reduxjs/toolkit'


// const navSlice = createSlice({
//     name: 'navbar',
//     initialState: {
//         home: false,
//         master: false,
//         reports: false,
//         expense: false,
//         support:false,

//     },
//     reducers: {
//         // ?action?
//         setToggleSidebar: (state, action) => {
//             state.home = action.payload.home;
//             state.master = action.payload.master;
//             state.reports = action.payload.reports;
//             state.expense = action.payload.expense;
//             state.support = action.payload.support;

//         },
//     },
// })

// export const { setToggleSidebar } = navSlice.actions
// export default navSlice.reducer





import { createSlice } from '@reduxjs/toolkit';

const navSlice = createSlice({
  name: 'navbar',
  initialState: {
    home: false,
    management: true,
    manageAttendance: false,
    manageOrder: false,
    reportManagement: false,
  },
  reducers: {
    // ?action?
    setToggleSidebar: (state, action) => {
        state.home = action.payload.home;
        state.management = action.payload.management;
        state.manageAttendance = action.payload.manageAttendance;
        state.manageOrder = action.payload.manageOrder;
        state.reportManagement = action.payload.reportManagement;
    },
},
});

export const { setToggleSidebar } = navSlice.actions;
export default navSlice.reducer;
