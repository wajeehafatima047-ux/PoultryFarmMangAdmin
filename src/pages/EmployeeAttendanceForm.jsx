import React, { useState, useEffect } from 'react';
import { addData, updateData, getDataById, getAllData } from '../Helper/firebaseHelper';

const EmployeeAttendanceForm = ({ attendanceId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    employee: '',
    status: 'Present',
    checkin: '',
    checkout: '',
    workHours: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [employees, setEmployees] = useState([]);

  const statusOptions = ['Present', 'Absent', 'Late', 'Half Day', 'On Leave', 'Sick Leave'];

  useEffect(() => {
    loadEmployees();
    if (attendanceId) {
      loadAttendanceData();
    }
  }, [attendanceId]);

  const loadEmployees = async () => {
    try {
      const employeesData = await getAllData('employees');
      setEmployees(employeesData || []);
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  };

  const loadAttendanceData = async () => {
    try {
      setLoading(true);
      const attendanceData = await getDataById('attendance', attendanceId);
      if (attendanceData) {
        setFormData({
          employee: attendanceData.employee || attendanceData.employeeId || '',
          status: attendanceData.status || 'Present',
          checkin: attendanceData.checkin || '',
          checkout: attendanceData.checkout || '',
          workHours: attendanceData.workHours || '',
          date: attendanceData.date || new Date().toISOString().split('T')[0]
        });
      }
    } catch (error) {
      setError('Failed to load attendance data');
      console.error('Error loading attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-calculate work hours when checkin and checkout are both set
    if (name === 'checkin' || name === 'checkout') {
      if (formData.checkin && formData.checkout) {
        calculateWorkHours(name === 'checkin' ? value : formData.checkin, name === 'checkout' ? value : formData.checkout);
      }
    }
  };

  const calculateWorkHours = (checkinTime, checkoutTime) => {
    if (checkinTime && checkoutTime) {
      const checkin = new Date(`2000-01-01T${checkinTime}`);
      const checkout = new Date(`2000-01-01T${checkoutTime}`);
      
      if (checkout > checkin) {
        const diffMs = checkout - checkin;
        const diffHours = diffMs / (1000 * 60 * 60);
        setFormData(prev => ({
          ...prev,
          workHours: diffHours.toFixed(2)
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const attendanceData = {
        ...formData,
        workHours: parseFloat(formData.workHours) || 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (attendanceId) {
        // Update existing attendance
        await updateData('attendance', attendanceId, attendanceData);
      } else {
        // Create new attendance
        await addData('attendance', attendanceData);
      }

      onSuccess();
      onClose();
    } catch (error) {
      setError('Failed to save attendance');
      console.error('Error saving attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickCheckin = () => {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);
    setFormData(prev => ({
      ...prev,
      checkin: currentTime,
      status: 'Present'
    }));
  };

  const handleQuickCheckout = () => {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);
    setFormData(prev => ({
      ...prev,
      checkout: currentTime
    }));
    
    if (formData.checkin) {
      calculateWorkHours(formData.checkin, currentTime);
    }
  };

  if (loading && attendanceId) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Loading attendance data...</p>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '10px',
        width: '90%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3>{attendanceId ? 'Edit Attendance' : 'Add Attendance Record'}</h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#666'
            }}
          >
            ×
          </button>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#ffebee',
            color: '#c62828',
            padding: '10px',
            borderRadius: '5px',
            marginBottom: '20px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Employee:
              </label>
              <select
                name="employee"
                value={formData.employee}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '14px'
                }}
              >
                <option value="">Select Employee</option>
                {employees.map(employee => (
                  <option key={employee.id} value={employee.id}>
                    {employee.employee || employee.name} - {employee.position || employee.role}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Date:
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '14px'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Status:
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '14px'
                }}
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Work Hours:
              </label>
              <input
                type="number"
                name="workHours"
                value={formData.workHours}
                onChange={handleInputChange}
                min="0"
                max="24"
                step="0.5"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '14px'
                }}
                placeholder="0.00"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Check-in Time:
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="time"
                  name="checkin"
                  value={formData.checkin}
                  onChange={handleInputChange}
                  style={{
                    flex: 1,
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    fontSize: '14px'
                  }}
                />
                <button
                  type="button"
                  onClick={handleQuickCheckin}
                  style={{
                    padding: '10px 15px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Now
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Check-out Time:
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="time"
                  name="checkout"
                  value={formData.checkout}
                  onChange={handleInputChange}
                  style={{
                    flex: 1,
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    fontSize: '14px'
                  }}
                />
                <button
                  type="button"
                  onClick={handleQuickCheckout}
                  style={{
                    padding: '10px 15px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Now
                </button>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 20px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                backgroundColor: 'white',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '5px',
                backgroundColor: loading ? '#ccc' : '#007bff',
                color: 'white',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '14px'
              }}
            >
              {loading ? 'Saving...' : (attendanceId ? 'Update Attendance' : 'Add Attendance')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeAttendanceForm;