

import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import {
  TableContainer,
  Paper,
  IconButton,
  Dialog,
  DialogContent,
  Typography,
  Button,
  InputBase,
  Modal,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from '@mui/material'
import { RiEdit2Fill } from 'react-icons/ri'
import { AiFillDelete } from 'react-icons/ai'
import {
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
  CFormSelect,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import TablePagination from '@mui/material/TablePagination'
import { useNavigate } from 'react-router-dom'
import Loader from '../../../../components/Loader/Loader'
import CloseIcon from '@mui/icons-material/Close'
import { MdConnectWithoutContact } from 'react-icons/md'
import { AiOutlineUpload } from 'react-icons/ai'
import ReactPaginate from 'react-paginate'
import Cookies from 'js-cookie'
import { IoMdAdd } from 'react-icons/io'
import toast, { Toaster } from 'react-hot-toast'
import * as XLSX from 'xlsx' // For Excel export
import jsPDF from 'jspdf' // For PDF export
import 'jspdf-autotable' // For table formatting in PDF
import CIcon from '@coreui/icons-react'
import GroupIcon from '@mui/icons-material/Group'
import { cilSettings } from '@coreui/icons'
import '../../../../../src/app.css'
import { COLUMNS } from './columns'
import { StyledTablePagination } from '../../../../views/PaginationCssFile/TablePaginationStyles'
// import { FaBriefcase   } from 'react-icons/fa';
import { BsFillPersonCheckFill } from 'react-icons/bs'
import '../../ReusablecodeforTable/styles.css'
import ExcelJS from 'exceljs'
import PDFExporter from '../../ReusablecodeforTable/PDFExporter'
import ExcelExporter from '../../ReusablecodeforTable/ExcelExporter'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { FaThumbsUp } from 'react-icons/fa'
import { CTooltip } from '@coreui/react'
import debounce from 'lodash.debounce'
import myGif from '../../ReusablecodeforTable/loadergif.gif'
// import { useNavigate } from 'react-router-dom';
import { Autocomplete,Checkbox } from '@mui/material'
import { PiRoadHorizonDuotone } from "react-icons/pi";
import { EventSourcePolyfill } from 'event-source-polyfill'; // ✅ Correct

const DistanceReport = () => {
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(true)
  // const [data, setData] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  const [pageCount, setPageCount] = useState()
  // const handleEditModalClose = () => setEditModalOpen(false)
  // const handleAddModalClose = () => setAddModalOpen(false)
  const [filteredData, setFilteredData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(25)
  // const columns = COLUMNS()
  const [sortedData, setSortedData] = useState([])
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [selectedPeriod, setSelectedPeriod] = useState('today')
  const [showCustomDates, setShowCustomDates] = useState(false)
  const [sortBy, setSortBy] = useState('')
  const [sortOrder, setSortOrder] = useState('asc')
  const navigate = useNavigate()
  const [columnTotals, setColumnTotals] = useState({});
  const [isStreamingComplete, setIsStreamingComplete] = useState(false);
  
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

  const style = {
    position: 'absolute',
    top: '50%',
    borderRadius: '10px',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '35%',
    maxHeight: '90vh',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    overflowY: 'auto', // Enable vertical scrolling
    display: 'flex',
    flexDirection: 'column',
    padding: '1rem',
    marginTop: '8px',
  }

  const [columns, setColumns] = useState([])
  const [data, setData] = useState([])

  // const fetchData = async (startDate, endDate, selectedPeriod, page = 1) => {
  //   setLoading(true)
  //   const accessToken = Cookies.get('token')

  //   const usernamesQuery =
  //     selectedSalesmen.length > 0 ? `usernames=${selectedSalesmen.join(',')}` : ''
  //   let url = `${import.meta.env.VITE_SERVER_URL}/api/distancedaywise?${usernamesQuery}`

  //   if (selectedPeriod && selectedPeriod !== 'Custom') {
  //     url += `&filter=${selectedPeriod}`
  //   } else if (startDate && endDate) {
  //     url += `&startDate=${startDate}&endDate=${endDate}`
  //   }

  //   console.log('Generated URL:', url)

  //   try {
  //     const response = await axios.get(url, {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     })

  //     console.log('Response:', response.data)

  //     if (response.data) {
  //       const apiData = response.data

  //       if (apiData.length > 0) {
  //         // Extract unique keys dynamically
  //         const keys = Object.keys(apiData[0])

  //         // Create dynamic columns
  //         const dynamicColumns = keys.map((key) => ({
  //           Header: key == 'salesmanName' ? 'Salesman Name' : key, // Format header
  //           accessor: key,
  //         }))

  //         setColumns(dynamicColumns)
  //       }

  //       setData(apiData)
  //     } else {
  //       console.error('Error:', response.data.message)
  //     }
  //   } catch (error) {
  //     console.error('Error fetching data:', error)
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  
 
//   const fetchData = (startDate, endDate, selectedPeriod) => {
//     setLoading(true);
//     const accessToken = Cookies.get('token');
  
//     const usernamesQuery =
//       selectedSalesmen.length > 0 ? `usernames=${selectedSalesmen.join(',')}` : '';
//     let url = `${import.meta.env.VITE_SERVER_URL}/api/distancedaywise?${usernamesQuery}`;
  
//     if (selectedPeriod && selectedPeriod !== 'Custom') {
//       url += `&filter=${selectedPeriod}`;
//     } else if (startDate && endDate) {
//       url += `&startDate=${startDate}&endDate=${endDate}`;
//     }
  
//     console.log('Generated URL:', url);
  
//     const eventSource = new EventSourcePolyfill(url, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         "Content-Type": "text/event-stream",
//       },
//       withCredentials: true,  // Ensures cookies and credentials are sent
//       heartbeatTimeout: 45000 // Helps prevent automatic disconnection
//     });
  
//   eventSource.onmessage = (event) => {
//   console.log("Raw SSE Event:", event); // Log entire event object
  
//   try {
//     const newData = JSON.parse(event.data);
//     console.log("Received SSE Data:", newData);

//     if (Array.isArray(newData) && newData.length > 0) {
//       console.table(newData);
//       setColumns((prevColumns) => {
//         if (prevColumns.length === 0) {
//           const keys = Object.keys(newData[0]);
//           return keys.map((key) => ({
//             Header: key === "salesmanName" ? "Salesman Name" : key,
//             accessor: key,
//           }));
//         }
//         return prevColumns;
//       });

//       setData((prevData) => [...prevData, ...newData]);
//     }
//   } catch (error) {
//     console.error("Error parsing SSE data:", error, event.data);
//   }
// };
    
//     // setLoading(false)
//     eventSource.onopen = () => {
//       console.log("Connection to SSE opened.");
//       setIsStreamingComplete(false);
//       setColumnTotals({});
//     };
    
//     eventSource.onerror = (error) => {
//       console.error("SSE Error:", error);
//       eventSource.close();
//       setLoading(false);
//       setIsStreamingComplete(true);
//     };
  
//     return () => {
//       eventSource.close();
//     };
//   };
  


const fetchData = (startDate, endDate, selectedPeriod) => {
    setLoading(true);
    const accessToken = Cookies.get("token");

    // ✅ Construct URL with filters
    const usernamesQuery =
        selectedSalesmen.length > 0 ? `usernames=${selectedSalesmen.join(",")}` : "";
    let url = `${import.meta.env.VITE_SERVER_URL}/api/distancedaywise?${usernamesQuery}`;

    if (selectedPeriod && selectedPeriod !== "Custom") {
        url += `&filter=${selectedPeriod}`;
    } else if (startDate && endDate) {
        url += `&startDate=${startDate}&endDate=${endDate}`;
    }

    console.log("Generated URL:", url);

    // ✅ Use `EventSourcePolyfill` to send authentication headers
    const eventSource = new EventSourcePolyfill(url, {
        headers: {
            Authorization: `Bearer ${accessToken}`, // ✅ Send token
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive"
        },
        withCredentials: true // Ensures credentials like cookies are sent
    });

    eventSource.onopen = () => {
        console.log("SSE connection opened");
    };

    eventSource.onmessage = (event) => {
        console.log("Raw SSE Event:", event);

        try {
            const newData = JSON.parse(event.data);
            console.log("Received SSE Data:", newData);

            if (Array.isArray(newData) && newData.length > 0) {
                console.table(newData);
                setColumns((prevColumns) => {
                    if (prevColumns.length === 0) {
                        const keys = Object.keys(newData[0]);
                        return keys.map((key) => ({
                            Header: key === "salesmanName" ? "Salesman Name" : key,
                            accessor: key
                        }));
                    }
                    return prevColumns;
                });

                setData((prevData) => [...prevData, ...newData]);
            }
        } catch (error) {
            console.error("Error parsing SSE data:", error, event.data);
        }
    };

    eventSource.onerror = (error) => {
        console.error("SSE Error:", error);
        eventSource.close();
        setLoading(false);
    };

    return () => {
        eventSource.close();
    };
};


  

  function formatDate(date) {
    const d = new Date(date)
    const day = String(d.getDate()).padStart(2, '0') // Add leading zero if single digit
    const month = String(d.getMonth() + 1).padStart(2, '0') // Add leading zero to month
    const year = d.getFullYear()
    return `${day}-${month}-${year}`
  }

  // Example: parsing the formatted date string back to a Date object if needed
  function parseDate(dateString) {
    const [day, month, year] = dateString.split('-').map(Number)
    return new Date(year, month - 1, day)
  }
  useEffect(() => {
    fetchData(formatToUTCString(startDate), formatToUTCString(endDate), selectedPeriod)
  }, [])
  // useEffect(() => {
  //   setLoading(true)
  //   // fetchData() // Refetch data when searchQuery changes
  //   fetchData(formatToUTCString(startDate), formatToUTCString(endDate), selectedPeriod)
  // }, [searchQuery]) // Dependency array ensures the effect runs whenever searchQuery changes

  // ##################### Filter data by search query #######################
  const filterGroups = () => {
    if (!searchQuery) {
      setFilteredData(data) // No query, show all drivers
    } else {
      const filtered = data.filter((group) =>
        group.salesmanName.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredData(filtered)
      setCurrentPage(1)
    }
  }
  const debouncedFilter = useCallback(
    debounce((query, sourceData) => {
      if (!query) {
        setFilteredData(sourceData)
        return
      }
      const filtered = sourceData.filter((item) =>
        Object.values(item).some((value) =>
          value?.toString().toLowerCase().includes(query.toLowerCase()),
        ),
      )
      // const filtered = sourceData.filter(item =>
      //   Object.entries(item).some(([key, value]) => {
      //     if (key === 'profileImgUrl') return false; // Skip searching the profileImage field
      //     return value?.toString().toLowerCase().includes(query.toLowerCase());
      //   })
      // );

      setFilteredData(filtered)
    }, 500),
    [],
  )
  // Handle search input changes
  const handleSearchChange = (e) => {
    const query = e.target.value
    setSearchQuery(query)
    debouncedFilter(query, data)
  }

  // Cancel debounce on component unmount
  useEffect(() => {
    return () => debouncedFilter.cancel()
  }, [debouncedFilter])
  useEffect(() => {
    setFilteredData(data)
  }, [data])
  // useEffect(() => {
  //   filterGroups(searchQuery)
  // }, [data, searchQuery])

  const handlePageClick = (e) => {
    console.log(e.selected + 1)
    let page = e.selected + 1
    setCurrentPage(page)
    setLoading(true)
    fetchData(page)
  }

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10)
    setRowsPerPage(newRowsPerPage === -1 ? sortedData.length : newRowsPerPage) // Set to all rows if -1
    setPage(0) // Reset to the first page
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const exportToExcel = ExcelExporter({
    mytitle: 'Approved Request Data',
    columns: COLUMNS(),
    data: filteredData,
    fileName: 'Approve_Request_data.xlsx',
  })

  // const exportToPDF = PDFExporter({
  //   title: 'Approved Request Data',
  //   columns: COLUMNS(),
  //   data: filteredData,
  //   fileName: 'Approve_Request_report.pdf',
  // })
  const exportToPDF = () => {
    const doc = new jsPDF('l', 'mm', 'a2'); // Landscape mode for wider tables
  
    // Define column headers
    const columnHeaders = ['SN', 'Salesman Name', ...columns.map((col) => col.Header), 'Total Distance'];
  
    // Calculate data rows
    const rows = data.map((item, index) => {
      let rowTotal = 0;
      const rowData = [index + 1, item.salesmanName];
  
      columns.forEach((col) => {
        let value = parseFloat(item[col.accessor]) || 0;
        rowTotal += value;
        rowData.push(value.toFixed(2) + ' km');
      });
  
      rowData.push(rowTotal.toFixed(2) + ' km'); // Total per row
      return rowData;
    });
  
    // Calculate column totals
    const columnTotals = columns.map((col) => 
      data.reduce((sum, item) => sum + (parseFloat(item[col.accessor]) || 0), 0)
    );
  
    const totalRow = ['Total', '', ...columnTotals.map((total) => total.toFixed(2) + ' km'), 
      columnTotals.reduce((sum, val) => sum + val, 0).toFixed(2) + ' km'
    ];
    rows.push(totalRow); // Append total row
  
    // Title Styling
    doc.setFontSize(20);
    doc.text('Salesman Distance Report', doc.internal.pageSize.width / 2, 15, { align: 'center' });
  
    // Auto-calculate column widths
    const calculateColumnWidth = () => {
      const pageWidth = doc.internal.pageSize.width - 20;
      return Math.floor(pageWidth / columnHeaders.length);
    };
  
    const columnWidth = calculateColumnWidth();
  
    // Table Styling
    doc.autoTable({
      head: [columnHeaders],
      body: rows,
      startY: 30,
      theme: 'striped',
      headStyles: {
        fillColor: [23, 54, 93],  // Dark blue
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 10,
        halign: 'center',
      },
      bodyStyles: {
        fontSize: 8,
        cellPadding: 2,
      },
      styles: {
        overflow: 'linebreak',
        cellWidth: 'wrap',
      },
      columnStyles: {
        0: { cellWidth: columnWidth }, // Adjust first column width
        1: { cellWidth: 35, halign: 'left' }, // Salesman Name
      },
      margin: { top: 40, left: 10, right: 10 },
    });
  
    // Page Numbering
    const pageCount = doc.internal.getNumberOfPages();
    doc.setFontSize(10);
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 10);
    }
  
    // Save the PDF
    doc.save('Salesman_Distance_Report.pdf');
  };
  
  
  

  const handleSort = (accessor) => {
    if (sortBy === accessor) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(accessor)
      setSortOrder('asc')
    }
  }
  useEffect(() => {
    if (sortBy) {
      const sorted = [...filteredData].sort((a, b) => {
        const aValue = a[sortBy]
        const bValue = b[sortBy]

        // Handle different data types
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortOrder === 'asc' ? aValue - bValue : bValue - aValue
        }

        // Handle dates
        if (aValue instanceof Date && bValue instanceof Date) {
          return sortOrder === 'asc' ? aValue - bValue : bValue - aValue
        }

        // Default string comparison
        return sortOrder === 'asc'
          ? String(aValue).localeCompare(String(bValue))
          : String(bValue).localeCompare(String(aValue))
      })

      setSortedData(sorted)
    } else {
      setSortedData(filteredData)
    }
  }, [filteredData, sortBy, sortOrder])

  const [selectedSalesmen, setSelectedSalesmen] = useState('')
  const [salesmen, setSalesmen] = useState([])
  useEffect(() => {
    const fetchDatasalesman = async () => {
      const accessToken = Cookies.get('token')
      const url = `${import.meta.env.VITE_SERVER_URL}/api/salesman`

      try {
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })

        if (response.data && response.data.salesmandata) {
          const formattedData = response.data.salesmandata.map((item) => ({
            _id: item._id,
            username: item.username,
            salesmanName: item.salesmanName || 'Unknown',
          }))
          setSalesmen(formattedData)
        } else {
          console.error('Salesman data is missing or incorrectly structured.')
        }
      } catch (error) {
        console.error('Error fetching salesman data:', error)
      }
    }

    fetchDatasalesman()
  }, [])
  const salesmanOptions = [{ username: "all", salesmanName: "Select All" }, ...salesmen];
  let totalDistance=0;
  
  return (
    <div className="d-flex flex-column mx-md-3 mt-3 h-auto">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="d-flex justify-content-between mb-2">
        <div style={{ display: 'flex', gap: '42px' }}>
          <div>
            <h2
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: '#4c637c',
                fontWeight: '600',
                fontFamily: "'Poppins', sans-serif",
                whiteSpace:"nowrap",
                flexWrap:"nowrap",
                overflow:"hidden",
                textOverflow:"ellipsis",
              }}
            >
              
              <PiRoadHorizonDuotone style={{ fontSize: '24px', color: '#4c637c' }} />
              Distance Report
            </h2>
          </div>
     <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <label style={{ fontWeight: "bold" }}>Salesman:</label>
      <FormControl fullWidth>
        <Autocomplete
          multiple
          id="searchable-salesman-select"
          options={salesmanOptions}
          getOptionLabel={(option) => option?.salesmanName || "Unknown"}
          value={salesmen.filter((s) => selectedSalesmen.includes(s?.username)) || []}
          onChange={(event, newValue) => {
            if (newValue.some((item) => item.username === "all")) {
              setSelectedSalesmen(selectedSalesmen.length === salesmen.length ? [] : salesmen.map((s) => s.username));
            } else {
              setSelectedSalesmen(newValue.map((s) => s.username));
            }
            console.log("Selected Salesmen:", selectedSalesmen);
          }}
          isOptionEqualToValue={(option, value) => option.username === value.username}
          renderTags={(value, getTagProps) => {
            // ✅ Convert selected items to a comma-separated string
            const selectedText = value.map((v) => v.salesmanName).join(", ");
            return selectedText.length > 30 ? `${selectedText.slice(0, 30)}...` : selectedText;
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Select Salesman"
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  height: "38px",
                  minWidth: "150px",
                  paddingRight: "32px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis", // ✅ Ensure truncation
                },
                "& input": {
                  padding: "8px 14px",
                },
              }}
            />
          )}
        />
      </FormControl>
    </div>

          <div style={styles.container}>
            <div style={styles.inputGroup}>
              <label htmlFor="period" style={styles.label}>
                Period:
              </label>
              <select
                id="period"
                value={selectedPeriod}
                onChange={handlePeriodChange}
                style={styles.select}
              >
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="thisWeek">This Week</option>
                <option value="lastWeek">Previous Week</option>
                <option value="thisMonth">This Month</option>
                <option value="preMonth">Previous Month</option>
                <option value="Custom">Custom</option>
              </select>
            </div>

            {showCustomDates && (
              <>
                <div style={styles.inputGroup}>
                  <label htmlFor="startDate" style={styles.label}>
                    From
                  </label>
                  <input
                    type="datetime-local"
                    id="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    style={styles.input}
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label htmlFor="endDate" style={styles.label}>
                    To
                  </label>
                  <input
                    type="datetime-local"
                    id="endDate"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    style={styles.input}
                  />
                </div>
              </>
            )}

            <button onClick={handleApply} style={styles.button}>
              Apply
            </button>
          </div>
        </div>

        <div className="d-flex align-items-center">
          <div className="me-3 d-none d-md-block">
            <input
              type="search"
              className="form-control"
              placeholder="🔍 Search here..."
              value={searchQuery}
              // onChange={(e) => setSearchQuery(e.target.value)}
              onChange={handleSearchChange}
              style={{
                height: '40px', // Ensure consistent height
                padding: '8px 12px',
                fontSize: '16px',
                borderRadius: '8px',
                border: '1px solid #ccc',
              }}
            />
          </div>

          {/* Settings Dropdown */}

          {/* Add Button */}

          <CDropdown className="position-relative me-3">
            <CDropdownToggle
              color="secondary"
              style={{
                borderRadius: '50%',
                padding: '10px',
                height: '48px',
                width: '48px',
                marginLeft: '12px',
              }}
            >
              <CIcon icon={cilSettings} />
            </CDropdownToggle>
            <CDropdownMenu>
              {/* <CDropdownItem onClick={exportToPDF}>PDF</CDropdownItem> */}
              <CDropdownItem onClick={exportToPDF}>PDF</CDropdownItem>
              <CDropdownItem onClick={exportToExcel}>Excel</CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
        </div>
      </div>
      <div className="d-md-none mb-2">
        <input
          type="search"
          className="form-control"
          placeholder="search here..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <TableContainer
        component={Paper}
        sx={{
          height: 'auto',
          overflowX: 'auto',
        }}
      >
        <CTable
          style={{
            fontFamily: 'Roboto, sans-serif',
            fontSize: '14px',
            borderCollapse: 'collapse',
            width: '100%',
            border: '1px solid #e0e0e0', // Light border
          }}
          bordered
          align="middle"
          className="mb-2"
          hover
          responsive
        >
         <CTableHead>
  <CTableRow>
    <CTableHeaderCell
      className="text-center"
      style={{
        backgroundColor: '#1d3d5f', // Dark blue background
        padding: '8px 16px', // Adjusted padding for better spacing
        borderBottom: '2px solid #e0e0e0', // Stronger border for clarity
        textAlign: 'center', // Ensures text is centered
        verticalAlign: 'middle', // Aligns text in the middle
        color: 'white', // White text for contrast
        fontWeight: 'bold', // Makes the header text stand out
        letterSpacing: '0.5px', // Adds slight spacing for readability
        textTransform: 'uppercase', // Converts text to uppercase for a sleek look
      }}
    >
      SN
    </CTableHeaderCell>
    {columns.map((col) => (
      <CTableHeaderCell
        key={col.accessor}
        className="text-center"
        style={{
          padding: '8px 16px', // Adjusted padding for better spacing
          borderBottom: '2px solid #e0e0e0', // Stronger border
          textAlign: 'center',
          verticalAlign: 'middle',
          backgroundColor: '#1d3d5f',
          color: 'white',
          fontWeight: 'bold',
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
          cursor: 'pointer', // Indicate clickability for sorting
          userSelect: 'none', // Prevent text selection when clicking
        }}
        onClick={() => handleSort(col.accessor)}
      >
        {col.Header}
        {sortBy === col.accessor && (
          <span style={{ marginLeft: '8px', fontSize: '14px' }}>
            {sortOrder === 'asc' ? '↑' : '↓'}
          </span>
        )}
      </CTableHeaderCell>
    ))}
     <CTableHeaderCell
      className="text-center"
      style={{
        backgroundColor: '#1d3d5f', // Dark blue background
        padding: '8px 16px', // Adjusted padding for better spacing
        borderBottom: '2px solid #e0e0e0', // Stronger border for clarity
        textAlign: 'center', // Ensures text is centered
        verticalAlign: 'middle', // Aligns text in the middle
        color: 'white', // White text for contrast
        fontWeight: 'bold', // Makes the header text stand out
        letterSpacing: '0.5px', // Adds slight spacing for readability
        textTransform: 'uppercase', // Converts text to uppercase for a sleek look
      }}
    >
      Total Distance
    </CTableHeaderCell>
  </CTableRow>
</CTableHead>



{/* this is code where there is showing 0.00km if no data */}
{/* <CTableBody>
  {loading ? (
    <CTableRow>
      <CTableDataCell
        colSpan={columns.length + 2}
        className="text-center"
        style={{
          padding: '20px 0',
          fontSize: '16px',
          color: '#999',
        }}
      >
        <img src={myGif} alt="Loading" width="100" />
      </CTableDataCell>
    </CTableRow>
  ) : data.length > 0 ? (
    (() => {
      // Initialize columnTotals to store the sum of each column
      let columnTotals = {};

      return (
        <>
          {data.map((item, index) => {
            let rowTotal = 0; // Track total per row

            return (
              <CTableRow key={index}>
               
                <CTableDataCell
                  className="text-center"
                  style={{
                    padding: '0px 12px',
                    color: '#242424',
                    fontSize: '13px',
                    backgroundColor: index % 2 === 0 ? 'transparent' : '#f1f8fd',
                  }}
                >
                  {index + 1}
                </CTableDataCell>

              
                <CTableDataCell
                  className="text-center"
                  style={{
                    padding: '0px 12px',
                    color: '#242424',
                    fontSize: '13px',
                    backgroundColor: index % 2 === 0 ? 'transparent' : '#f1f8fd',
                    fontWeight: 'bold',
                  }}
                >
                  {item.salesmanName}
                </CTableDataCell>

                
                {columns.map((col) => {
                  if (col.accessor !== "salesmanName") {
                    let value = parseFloat(item[col.accessor]) || 0;
                    rowTotal += value;

                    // Add value to columnTotals for the respective column
                    columnTotals[col.accessor] =
                      (columnTotals[col.accessor] || 0) + value;

                    return (
                      <CTableDataCell
                        key={col.accessor}
                        className="text-center"
                        style={{
                          padding: '0px 12px',
                          color: '#242424',
                          fontSize: '13px',
                          backgroundColor:
                            index % 2 === 0 ? 'transparent' : '#f1f8fd',
                        }}
                      >
                        {value.toFixed(2)} km
                      </CTableDataCell>
                    );
                  }
                  return null;
                })}

               
                <CTableDataCell
                  className="text-center"
                  style={{
                    fontWeight: 'bold',
                    padding: '0px 12px',
                    fontSize: '13px',
                    backgroundColor: index % 2 === 0 ? 'transparent' : '#f1f8fd',
                  }}
                >
                  {rowTotal.toFixed(2)} km
                </CTableDataCell>
              </CTableRow>
            );
          })}

         
          <CTableRow>
            <CTableDataCell
              colSpan={2}
              className="text-center"
              style={{
                fontWeight: 'bold',
                padding: '10px',
                fontSize: '14px',
                backgroundColor: '#e0f7fa',
              }}
            >
              Column Totals:
            </CTableDataCell>

           
            {columns.map((col) =>
              col.accessor !== "salesmanName" ? (
                <CTableDataCell
                  key={col.accessor}
                  className="text-center"
                  style={{
                    fontWeight: 'bold',
                    padding: '10px',
                    fontSize: '14px',
                    backgroundColor: '#e0f7fa',
                  }}
                >
                  {columnTotals[col.accessor]?.toFixed(2)} km
                </CTableDataCell>
              ) : null
            )}

           
            <CTableDataCell
              className="text-center"
              style={{
                fontWeight: 'bold',
                padding: '10px',
                fontSize: '14px',
                backgroundColor: '#e0f7fa',
              }}
            >
              {Object.values(columnTotals)
                .reduce((sum, colTotal) => sum + colTotal, 0)
                .toFixed(2)}{' '}
              km
            </CTableDataCell>
          </CTableRow>
        </>
      );
    })()
  ) : (
    <CTableRow>
      <CTableDataCell
        colSpan={columns.length + 2}
        className="text-center"
        style={{
          padding: '20px 0',
          fontSize: '16px',
          color: '#999',
        }}
      >
        No data available
      </CTableDataCell>
    </CTableRow>
  )}
</CTableBody> */}

<CTableBody>
  {loading ? (
    <CTableRow>
      <CTableDataCell
        colSpan={columns.length + 2}
        className="text-center"
        style={{
          padding: '20px 0',
          fontSize: '16px',
          color: '#999',
        }}
      >
        <img src={myGif} alt="Loading" width="100" />
      </CTableDataCell>
    </CTableRow>
  ) : data.length > 0 ? (
    (() => {
      let columnTotals = {};

      return (
        <>
          {data.map((item, index) => {
            let rowTotal = 0;

            return (
              <CTableRow key={index}>
               
                <CTableDataCell className="text-center" style={{
                  padding: '0px 12px',
                  color: '#242424',
                  fontSize: '13px',
                  backgroundColor: index % 2 === 0 ? 'transparent' : '#f1f8fd',
                }}>
                  {index + 1}
                </CTableDataCell>

               
                <CTableDataCell className="text-center" style={{
                  padding: '0px 12px',
                  color: '#242424',
                  fontSize: '13px',
                  backgroundColor: index % 2 === 0 ? 'transparent' : '#f1f8fd',
                  fontWeight: 'bold',
                }}>
                  {item.salesmanName}
                </CTableDataCell>

               
                {columns.map((col) => {
                  if (col.accessor !== "salesmanName") {
                    let value = parseFloat(item[col.accessor]) || 0;
                    rowTotal += value;
                    columnTotals[col.accessor] = (columnTotals[col.accessor] || 0) + value;

                    return (
                      <CTableDataCell key={col.accessor} className="text-center" style={{
                        padding: '0px 12px',
                        color: '#242424',
                        fontSize: '13px',
                        backgroundColor: index % 2 === 0 ? 'transparent' : '#f1f8fd',
                      }}>
                        {value.toFixed(2) === "0.00" ? "--" : `${value.toFixed(2)} km`}
                      </CTableDataCell>
                    );
                  }
                  return null;
                })}

                
                <CTableDataCell className="text-center" style={{
                  fontWeight: 'bold',
                  padding: '0px 12px',
                  fontSize: '13px',
                  backgroundColor: index % 2 === 0 ? 'transparent' : '#f1f8fd',
                }}>
                  {rowTotal.toFixed(2) === "0.00" ? "--" : `${rowTotal.toFixed(2)} km`}
                </CTableDataCell>
              </CTableRow>
            );
          })}

        
          <CTableRow>
            <CTableDataCell colSpan={2} className="text-center" style={{
              fontWeight: 'bold',
              padding: '10px',
              fontSize: '14px',
              backgroundColor: '#e0f7fa',
            }}>
              Column Totals:
            </CTableDataCell>

          
            {columns.map((col) =>
              col.accessor !== "salesmanName" ? (
                <CTableDataCell key={col.accessor} className="text-center" style={{
                  fontWeight: 'bold',
                  padding: '10px',
                  fontSize: '14px',
                  backgroundColor: '#e0f7fa',
                }}>
                  {columnTotals[col.accessor]?.toFixed(2) === "0.00" ? "--" : `${columnTotals[col.accessor]?.toFixed(2)} km`}
                </CTableDataCell>
              ) : null
            )}

          
            <CTableDataCell className="text-center" style={{
              fontWeight: 'bold',
              padding: '10px',
              fontSize: '14px',
              backgroundColor: '#e0f7fa',
            }}>
              {Object.values(columnTotals).reduce((sum, colTotal) => sum + colTotal, 0).toFixed(2) === "0.00"
                ? "--"
                : `${Object.values(columnTotals).reduce((sum, colTotal) => sum + colTotal, 0).toFixed(2)} km`}
            </CTableDataCell>
          </CTableRow>
        </>
      );
    })()
  ) : (
    <CTableRow>
      <CTableDataCell colSpan={columns.length + 2} className="text-center" style={{
        padding: '20px 0',
        fontSize: '16px',
        color: '#999',
      }}>
        No data available
      </CTableDataCell>
    </CTableRow>
  )}
</CTableBody>

{/* <CTableBody>
  {loading ? (
    <CTableRow>
      <CTableDataCell colSpan={columns.length + 2} className="text-center">
        <img src={myGif} alt="Loading" width="100" />
      </CTableDataCell>
    </CTableRow>
  ) : data.length > 0 ? (
    <>
      {data.map((item, index) => {
        let rowTotal = 0;

        return (
          <CTableRow key={index}>
            <CTableDataCell>{index + 1}</CTableDataCell>
            <CTableDataCell>{item.salesmanName}</CTableDataCell>

            {columns.map((col) => {
              if (col.accessor !== "salesmanName") {
                let value = parseFloat(item[col.accessor]) || 0;
                rowTotal += value;

                return (
                  <CTableDataCell key={col.accessor}>
                    {value.toFixed(2) === "0.00" ? "--" : `${value.toFixed(2)} km`}
                  </CTableDataCell>
                );
              }
              return null;
            })}

            <CTableDataCell>
              {rowTotal.toFixed(2) === "0.00" ? "--" : `${rowTotal.toFixed(2)} km`}
            </CTableDataCell>
          </CTableRow>
        );
      })}

      {isStreamingComplete && (
        <CTableRow>
          <CTableDataCell colSpan={2}>Column Totals:</CTableDataCell>
          {columns.map((col) =>
            col.accessor !== "salesmanName" ? (
              <CTableDataCell key={col.accessor}>
                {columnTotals[col.accessor]?.toFixed(2) === "0.00"
                  ? "--"
                  : `${columnTotals[col.accessor]?.toFixed(2)} km`}
              </CTableDataCell>
            ) : null
          )}
          <CTableDataCell>
            {Object.values(columnTotals).reduce((sum, colTotal) => sum + colTotal, 0).toFixed(2) === "0.00"
              ? "--"
              : `${Object.values(columnTotals).reduce((sum, colTotal) => sum + colTotal, 0).toFixed(2)} km`}
          </CTableDataCell>
        </CTableRow>
      )}
    </>
  ) : (
    <CTableRow>
      <CTableDataCell colSpan={columns.length + 2} className="text-center">
        No data available
      </CTableDataCell>
    </CTableRow>
  )}
</CTableBody> */}



        </CTable>
      </TableContainer>

      <StyledTablePagination>
        <TablePagination
          rowsPerPageOptions={[{ label: 'All', value: -1 }, 1, 10, 25, 100, 1000]}
          component="div"
          count={sortedData.length}
          rowsPerPage={rowsPerPage === sortedData.length ? -1 : rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => {
            console.log('Page changed:', newPage)
            handleChangePage(event, newPage)
          }}
          onRowsPerPageChange={(event) => {
            console.log('Rows per page changed:', event.target.value)
            handleChangeRowsPerPage(event)
          }}
        />
      </StyledTablePagination>
    </div>
  )
}

export default DistanceReport
