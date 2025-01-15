import React, { useState } from 'react';
import AppSidebarNav from './AppSidebarNav';
import _nav from '../_nav'; 

const Dashboard = () => {
  const [selectedItem, setSelectedItem] = useState('');

  const renderContent = () => {
    switch (selectedItem) {
      case 'Dashboard':
        return <div>Dashboard Content</div>;
      case 'Task Management':
        return <div>Task Management Content</div>;
      case 'User Management':
        return <div>User Management Content</div>;
      case 'Management':
        return <div>Management Related Content</div>;
      // Add more cases for each item
      default:
        return <div>Welcome to the Dashboard</div>;
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <AppSidebarNav items={_nav} setSelectedItem={setSelectedItem} />
      <div style={{ flex: 1, padding: '20px' }}>
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;
