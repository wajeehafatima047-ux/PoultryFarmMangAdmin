import React, { useState, useEffect } from 'react';
import { addData, updateData, getDataById } from '../Helper/firebaseHelper';

const EmployeeForm = ({ employeeId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    employee: '',
    position: '',
    contact: '',
    cnic: '',
    joiningDate: new Date().toISOString().split('T')[0],
    salary: '',
    status: 'Active'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const positionOptions = [
    'Manager', 'Supervisor', 'Worker', 'Driver', 'Security Guard', 
    'Maintenance Staff', 'Cleaner', 'Accountant', 'Sales Representative', 'Other'
  ];

  const statusOptions = ['Active', 'Inactive', 'On Leave', 'Terminated'];

  useEffect(() => {
    if (employeeId) {
      loadEmployeeData();
    } else {
      // Generate new employee ID
      const newEmployeeId = `EMP-${Date.now().toString().slice(-6)}`;
      setFormData(prev => ({ ...prev, employeeId: newEmployeeId }));
    }
  }, [employeeId]);

  const loadEmployeeData = async () => {
    try {
      setLoading(true);
      const employeeData = await getDataById('employees', employeeId);
      if (employeeData) {
        setFormData({
          employee: employeeData.employee || employeeData.name || '',
          position: employeeData.position || employeeData.role || '',
          contact: employeeData.contact || employeeData.phone || '',
          cnic: employeeData.cnic || '',
          joiningDate: employeeData.joiningDate || employeeData.joinDate || new Date().toISOString().split('T')[0],
          salary: employeeData.salary || '',
          status: employeeData.status || 'Active'
        });
      }
    } catch (error) {
      setError('Failed to load employee data');
      console.error('Error loading employee:', error);
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const employeeData = {
        employee: formData.employee,
        position: formData.position,
        contact: formData.contact,
        cnic: formData.cnic,
        joiningDate: formData.joiningDate,
        salary: parseFloat(formData.salary) || 0,
        status: formData.status,
        // Keep backward compatibility
        name: formData.employee,
        role: formData.position,
        phone: formData.contact,
        joinDate: formData.joiningDate,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (employeeId) {
        // Update existing employee
        await updateData('employees', employeeId, employeeData);
      } else {
        // Create new employee
        const newEmployeeId = `EMP-${Date.now().toString().slice(-6)}`;
        employeeData.employeeId = newEmployeeId;
        await addData('employees', employeeData);
      }

      onSuccess();
      onClose();
    } catch (error) {
      setError('Failed to save employee');
      console.error('Error saving employee:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && employeeId) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Loading employee data...</p>
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
          <h3>{employeeId ? 'Edit Employee' : 'Add New Employee'}</h3>
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
                Employee Name:
              </label>
              <input
                type="text"
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
                placeholder="Enter employee name"
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Position:
              </label>
              <select
                name="position"
                value={formData.position}
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
                <option value="">Select Position</option>
                {positionOptions.map(position => (
                  <option key={position} value={position}>{position}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Contact:
              </label>
              <input
                type="tel"
                name="contact"
                value={formData.contact}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '14px'
                }}
                placeholder="Enter phone number"
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                CNIC Number:
              </label>
              <input
                type="text"
                name="cnic"
                value={formData.cnic}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '14px'
                }}
                placeholder="Enter CNIC number (e.g., 12345-1234567-1)"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Joining Date:
              </label>
              <input
                type="date"
                name="joiningDate"
                value={formData.joiningDate}
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

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Salary ($):
              </label>
              <input
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
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
                Status:
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
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
              {loading ? 'Saving...' : (employeeId ? 'Update Employee' : 'Create Employee')}
          </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;