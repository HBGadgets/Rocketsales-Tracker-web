import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, Typography, Box, CircularProgress, IconButton } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { AreaChart, Area, ResponsiveContainer } from 'recharts'
import axios from 'axios'
import Cookies from 'js-cookie'
import RefreshIcon from '@mui/icons-material/Refresh'


const TaskManagementCard = () => {
  const [completed, setCompleted] = useState(0)
  const [pending, setPending] = useState(0)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchTaskCount(setCompleted, setPending, setLoading)
  }, [])

  const handleCardClick = () => {
    navigate('/task-management')
  }

  const totalTasks = completed + pending
  const completionRate = totalTasks > 0 ? ((completed / totalTasks) * 100).toFixed(1) : 0
  const fetchTaskCount = async (setCompleted, setPending, setLoading) => {
    const accessToken = Cookies.get('token')
    const url = `${import.meta.env.VITE_SERVER_URL}/api/task`
  
    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
  
      if (response.data) {
        const tasks = response.data
        console.log('my response task', tasks)
        const completedTasks = tasks.filter((task) => task.status == 'Completed').length
        const pendingTasks = tasks.filter((task) => task.status == 'Pending').length
        console.log('completed', completedTasks)
        console.log('pending', pendingTasks)
        setCompleted(completedTasks)
        setPending(pendingTasks)
      } else {
        console.error('Task data is missing or incorrectly structured.')
      }
    } catch (error) {
      console.error('Error fetching task data:', error)
    } finally {
      setLoading(false)
    }
  }
  return (
    <Card
      sx={{
        backgroundColor: '#FFB300', // Orange color
        color: '#fff',
        borderRadius: 2,
        width: 280,
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
      }}
      onClick={handleCardClick}
    >
      <CardContent>
        {/* Top Section */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight="bold">
            {loading ? <CircularProgress size={20} color="inherit" /> : `${completionRate}%`}{' '}
            <span style={{ fontSize: '14px', opacity: 0.8 }}>
              ({completed}/{totalTasks} completed)
            </span>
          </Typography>
          <IconButton
  size="small"
  sx={{ color: 'white' }}
  onClick={(event) => {
    event.stopPropagation(); // Prevents navigation
    fetchTaskCount(setCompleted, setPending, setLoading);
  }}
>
  <RefreshIcon />
</IconButton>

        </Box>

        {/* Title */}
        <Typography variant="body2">Task Completion Rate</Typography>

        {/* Stats */}
        <Box mt={1}>
          <Typography variant="body2">✅ Completed: {completed}</Typography>
          <Typography variant="body2">⏳ Pending: {pending}</Typography>
        </Box>

        {/* Graph at the bottom */}
        <Box sx={{ height: 50, mt: 2 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={[{ value: 30 }, { value: 50 }, { value: 40 }, { value: 60 }]}>
              <Area
                type="monotone"
                dataKey="value"
                stroke="white"
                fill="rgba(255, 255, 255, 0.3)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  )
}

export default TaskManagementCard
