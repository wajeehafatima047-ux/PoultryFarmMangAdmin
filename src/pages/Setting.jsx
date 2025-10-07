import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/Slices/HomeDataSlice';

function Setting() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.home.user);

  const handleLogout = () => {
    // Clear user from Redux store
    dispatch(logout());
    // Navigate to login page
    navigate('/');
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '30px' }}>Settings</h1>
      
      <div style={{ 
        backgroundColor: 'white', 
        padding: '30px', 
        borderRadius: '8px', 
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' 
      }}>
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '15px' }}>Account Information</h2>
          <div style={{ marginBottom: '10px' }}>
            <span style={{ fontWeight: '500' }}>Email: </span>
            <span>{user?.email || 'N/A'}</span>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <span style={{ fontWeight: '500' }}>Name: </span>
            <span>{user?.fName} {user?.lName}</span>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <span style={{ fontWeight: '500' }}>Role: </span>
            <span>{user?.role || 'N/A'}</span>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #e0e0e0', paddingTop: '30px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '15px' }}>Account Actions</h2>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: '#dc2626',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '6px',
              border: 'none',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#b91c1c'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#dc2626'}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Setting;